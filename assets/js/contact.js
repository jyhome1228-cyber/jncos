(() => {
  const form = document.querySelector('[data-contact-form]');
  if (!form || !window.JNCOSContactStore) return;

  const status = document.querySelector('[data-contact-form-status]');
  const button = form.querySelector('[type="submit"]');
  const value = (name) => form.elements[name]?.value?.trim?.() || '';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
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
      if (status) {
        status.hidden = false;
        status.innerHTML = `<strong>Message received.</strong><span>Reference ${saved.id.slice(0,8).toUpperCase()} · For a detailed OEM / ODM brief, you can continue to the Project Inquiry form.</span><a href="../Inquiry/?source=Contact%20follow-up&companyName=${encodeURIComponent(payload.contact.companyName)}&contactName=${encodeURIComponent(payload.contact.contactName)}&email=${encodeURIComponent(payload.contact.email)}&phone=${encodeURIComponent(payload.contact.phone)}&country=${encodeURIComponent(payload.contact.country)}&additionalNotes=${encodeURIComponent(payload.message)}">Continue to Detailed Inquiry →</a>`;
      }
    } catch (error) {
      console.error(error);
      alert('We could not save your message. Please try again or email info@jncostech.com.');
    } finally {
      button.disabled = false;
      button.textContent = oldLabel;
    }
  });
})();
