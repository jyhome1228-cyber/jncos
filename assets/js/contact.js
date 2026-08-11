(() => {
  const form = document.querySelector('[data-contact-form]');
  if (!form || !window.JNCOSContactStore) return;

  const status = document.querySelector('[data-contact-form-status]');
  const button = form.querySelector('[type="submit"]');
  const value = (name) => form.elements[name]?.value?.trim?.() || '';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const fieldFor = (name) => form.elements[name];
  const fieldWrap = (field) => field?.closest('.field');

  const ensureErrorEl = (field) => {
    const wrap = fieldWrap(field);
    if (!wrap) return null;
    let error = wrap.querySelector('.field-error');
    if (!error) {
      error = document.createElement('small');
      error.className = 'field-error';
      error.setAttribute('role', 'alert');
      error.hidden = true;
      wrap.appendChild(error);
    }
    return error;
  };

  const setFieldError = (name, message = '') => {
    const field = fieldFor(name);
    if (!field) return;
    const wrap = fieldWrap(field);
    const error = ensureErrorEl(field);
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    wrap?.classList.toggle('has-error', Boolean(message));
    if (error) {
      error.textContent = message;
      error.hidden = !message;
    }
  };

  const clearStatus = () => {
    if (!status) return;
    status.hidden = true;
    status.classList.remove('is-error', 'is-success');
    status.innerHTML = '';
  };

  const showStatus = (title, message, type = 'error') => {
    if (!status) return;
    status.hidden = false;
    status.classList.toggle('is-error', type === 'error');
    status.classList.toggle('is-success', type === 'success');
    status.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
    status.scrollIntoView({ behavior:'smooth', block:'nearest' });
  };

  const validate = () => {
    let valid = true;
    ['email', 'message'].forEach((name) => setFieldError(name, ''));

    const email = value('email');
    const message = value('message');

    if (!email) {
      setFieldError('email', 'Please enter your email address.');
      valid = false;
    } else if (!emailPattern.test(email)) {
      setFieldError('email', 'Please enter a valid email address, for example name@company.com.');
      valid = false;
    }

    if (!message) {
      setFieldError('message', 'Please enter a short project or contact message.');
      valid = false;
    }

    if (!valid) {
      const first = form.querySelector('[aria-invalid="true"]');
      first?.focus({ preventScroll:true });
      first?.scrollIntoView({ behavior:'smooth', block:'center' });
      showStatus('Please check the form.', 'Complete the highlighted fields and try again.', 'error');
    }
    return valid;
  };

  const firestoreMessage = (error) => {
    const code = String(error?.code || '').replace(/^firestore\//, '');
    if (code === 'permission-denied') return 'Firebase rejected this request. Please confirm that the published Firestore Rules allow public create access to the contacts collection.';
    if (code === 'unavailable') return 'Firebase is temporarily unavailable or the network connection was interrupted. Please try again.';
    if (code === 'failed-precondition') return 'Firestore is not ready for this request. Please confirm that the database and rules are fully deployed.';
    if (code === 'firebase/not-initialized') return 'Firebase could not be initialized on this page. Please refresh the page and try again.';
    return `The request could not be saved to Firebase${code ? ` (${code})` : ''}. Please try again or email info@jncostech.com.`;
  };

  form.setAttribute('novalidate', 'novalidate');
  form.querySelectorAll('input, textarea, select').forEach((field) => {
    field.addEventListener('input', () => {
      if (field.name === 'email') {
        const email = field.value.trim();
        if (!email || emailPattern.test(email)) setFieldError('email', '');
      } else if (field.name === 'message' && field.value.trim()) {
        setFieldError('message', '');
      }
      if (!form.querySelector('.has-error')) clearStatus();
    });
    field.addEventListener('change', () => {
      if (field.name === 'email') {
        const email = field.value.trim();
        setFieldError('email', !email ? 'Please enter your email address.' : (!emailPattern.test(email) ? 'Please enter a valid email address, for example name@company.com.' : ''));
      }
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearStatus();
    if (!validate()) return;

    button.disabled = true;
    const oldLabel = button.textContent;
    button.textContent = 'Sending…';

    try {
      const payload = {
        contact: {
          companyName: value('companyName'),
          contactName: value('contactName'),
          email: value('email'),
          phone: value('phone'),
          country: value('country')
        },
        message: value('message'),
        source: value('source') || 'Contact quick inquiry',
        page: location.pathname,
        status: 'New'
      };

      const saved = await window.JNCOSContactStore.create(payload);
      form.reset();
      ['email','message'].forEach((name) => setFieldError(name, ''));

      if (status) {
        status.hidden = false;
        status.classList.remove('is-error');
        status.classList.add('is-success');
        status.innerHTML = `<strong>Message received.</strong><span>Reference ${saved.id.slice(0,8).toUpperCase()} · Your request has been saved to JN COS TECH.</span><a href="../Inquiry/?source=Contact%20follow-up&companyName=${encodeURIComponent(payload.contact.companyName)}&contactName=${encodeURIComponent(payload.contact.contactName)}&email=${encodeURIComponent(payload.contact.email)}&phone=${encodeURIComponent(payload.contact.phone)}&country=${encodeURIComponent(payload.contact.country)}&additionalNotes=${encodeURIComponent(payload.message)}">Continue to Detailed Inquiry →</a>`;
      }
    } catch (error) {
      console.error('[JNCOS Contact]', error);
      showStatus('Message was not sent.', firestoreMessage(error), 'error');
    } finally {
      button.disabled = false;
      button.textContent = oldLabel;
    }
  });
})();
