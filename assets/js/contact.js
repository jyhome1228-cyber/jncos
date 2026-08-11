(() => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const status = document.querySelector('[data-contact-form-status]');
  const button = form.querySelector('[type="submit"]');
  const value = (name) => form.elements[name]?.value?.trim?.() || '';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const firebaseConfig = {
    apiKey: 'AIzaSyC-QT7LqvH4qXwhZDHDyyzV4r1y8rZTLcM',
    authDomain: 'jncostech.firebaseapp.com',
    projectId: 'jncostech',
    storageBucket: 'jncostech.firebasestorage.app',
    messagingSenderId: '629672019213',
    appId: '1:629672019213:web:c2c0d5699fb65ce848dc44'
  };

  let firebasePromise = null;
  const getFirebase = () => firebasePromise ||= Promise.all([
    import('https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js')
  ]).then(([appMod, fsMod]) => {
    const app = appMod.getApps().length ? appMod.getApps()[0] : appMod.initializeApp(firebaseConfig);
    return { db: fsMod.getFirestore(app), fs: fsMod };
  });

  const fieldFor = (name) => form.elements[name];
  const ensureErrorEl = (field) => {
    const wrap = field?.closest('.field');
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
    const wrap = field.closest('.field');
    const error = ensureErrorEl(field);
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    wrap?.classList.toggle('has-error', Boolean(message));
    if (error) {
      error.textContent = message;
      error.hidden = !message;
    }
  };

  const showStatus = (title, message, type = 'error') => {
    if (!status) return;
    status.hidden = false;
    status.classList.toggle('is-error', type === 'error');
    status.classList.toggle('is-success', type === 'success');
    status.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  };

  const validate = () => {
    let valid = true;
    setFieldError('email', '');
    setFieldError('message', '');
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
      showStatus('Please check the form.', 'Complete the highlighted fields and try again.', 'error');
      form.querySelector('[aria-invalid="true"]')?.focus();
    }
    return valid;
  };

  form.setAttribute('novalidate', 'novalidate');
  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      if (field.name === 'email') {
        const email = field.value.trim();
        if (!email || emailPattern.test(email)) setFieldError('email', '');
      }
      if (field.name === 'message' && field.value.trim()) setFieldError('message', '');
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (status) status.hidden = true;
    if (!validate()) return;

    const oldLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending…';

    const id = window.crypto?.randomUUID?.() || `contact-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const createdAt = new Date().toISOString();
    const payload = {
      id,
      type: 'contact',
      createdAt,
      createdAtISO: createdAt,
      status: 'New',
      source: value('source') || 'Contact quick inquiry',
      page: location.pathname,
      contact: {
        companyName: value('companyName'),
        contactName: value('contactName'),
        email: value('email'),
        phone: value('phone'),
        country: value('country')
      },
      message: value('message')
    };

    try {
      const { db, fs } = await getFirebase();
      await fs.setDoc(fs.doc(db, 'contacts', id), payload);

      try {
        const current = JSON.parse(localStorage.getItem('jncos_contacts_v1') || '[]');
        localStorage.setItem('jncos_contacts_v1', JSON.stringify([payload, ...current.filter((item) => item.id !== id)]));
      } catch (_) {}

      form.reset();
      showStatus('Message received.', `Reference ${id.slice(0,8).toUpperCase()} · Your request has been sent to JN COS TECH.`, 'success');
    } catch (error) {
      console.error('[JNCOS Contact Firestore]', error);
      const code = error?.code || 'unknown';
      const message = error?.message || 'Unknown Firebase error.';
      showStatus('Message was not sent.', `Firebase error: ${code}. ${message}`, 'error');
    } finally {
      button.disabled = false;
      button.textContent = oldLabel;
    }
  });
})();
