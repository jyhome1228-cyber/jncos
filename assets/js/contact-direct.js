import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyC-QT7LqvH4qXwhZDHDyyzV4r1y8rZTLcM',
  authDomain: 'jncostech.firebaseapp.com',
  projectId: 'jncostech',
  storageBucket: 'jncostech.firebasestorage.app',
  messagingSenderId: '629672019213',
  appId: '1:629672019213:web:c2c0d5699fb65ce848dc44'
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);
const form = document.querySelector('[data-contact-form]');
const status = document.querySelector('[data-contact-form-status]');

if (form) {
  const submit = form.querySelector('[type="submit"]');
  const value = (name) => form.elements[name]?.value?.trim?.() || '';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const getError = (field) => {
    const wrap = field.closest('.field');
    let el = wrap?.querySelector('.field-error');
    if (!el && wrap) {
      el = document.createElement('small');
      el.className = 'field-error';
      el.hidden = true;
      wrap.appendChild(el);
    }
    return el;
  };

  const setError = (name, message = '') => {
    const field = form.elements[name];
    if (!field) return;
    const wrap = field.closest('.field');
    const error = getError(field);
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
    setError('email', '');
    setError('message', '');
    let ok = true;
    if (!value('email')) {
      setError('email', 'Please enter your email address.');
      ok = false;
    } else if (!emailPattern.test(value('email'))) {
      setError('email', 'Please enter a valid email address, for example name@company.com.');
      ok = false;
    }
    if (!value('message')) {
      setError('message', 'Please enter a short project or contact message.');
      ok = false;
    }
    return ok;
  };

  form.setAttribute('novalidate', 'novalidate');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (status) status.hidden = true;
    if (!validate()) {
      showStatus('Please check the form.', 'Complete the highlighted fields and try again.');
      return;
    }

    const oldText = submit.textContent;
    submit.disabled = true;
    submit.textContent = 'Sending…';

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
      await setDoc(doc(db, 'contacts', id), payload);
      localStorage.setItem('jncos_contacts_v1', JSON.stringify([
        payload,
        ...(() => { try { return JSON.parse(localStorage.getItem('jncos_contacts_v1') || '[]'); } catch { return []; } })().filter((x) => x.id !== id)
      ]));
      form.reset();
      showStatus('Message received.', `Reference ${id.slice(0,8).toUpperCase()} · Your request has been sent to JN COS TECH.`, 'success');
    } catch (error) {
      console.error('[JNCOS Contact direct write]', error);
      const code = error?.code || 'unknown';
      showStatus('Message was not sent.', `Firebase error: ${code}. ${error?.message || 'Please try again or email info@jncostech.com.'}`);
    } finally {
      submit.disabled = false;
      submit.textContent = oldText;
    }
  });
}
