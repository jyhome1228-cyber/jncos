(() => {
  const form = document.querySelector('[data-inquiry-form]');
  if (!form || !window.JNCOSInquiryStore) return;

  const steps = [...form.querySelectorAll('[data-step]')];
  const stepButtons = [...document.querySelectorAll('[data-step-indicator]')];
  const progress = document.querySelector('[data-progress-bar]');
  const summary = document.querySelector('[data-live-summary]');
  const success = document.querySelector('[data-inquiry-success]');
  let current = 0;

  const params = new URLSearchParams(window.location.search);
  ['companyName','contactName','email','additionalNotes','source'].forEach((name) => {
    const field = form.elements[name];
    const incoming = params.get(name);
    if (field && incoming && !field.value) field.value = incoming;
  });
  if (!form.elements.source?.value && (params.get('companyName') || params.get('contactName') || params.get('email') || params.get('additionalNotes'))) {
    form.elements.source.value = 'Contact quick inquiry';
  }

  const value = (name) => form.elements[name]?.value?.trim?.() || '';
  const checked = (name) => [...form.querySelectorAll(`[name="${name}"]:checked`)].map((el) => el.value);

  const data = () => ({
    contact: {
      companyName: value('companyName'),
      contactName: value('contactName'),
      email: value('email'),
      phone: value('phone'),
      country: value('country'),
      website: value('website'),
      contactMethod: value('contactMethod'),
    },
    project: {
      serviceType: value('serviceType'),
      productCategories: checked('productCategories'),
      projectStage: value('projectStage'),
      targetMarkets: value('targetMarkets'),
      launchTiming: value('launchTiming'),
      initialQuantity: value('initialQuantity'),
    },
    formulation: {
      skinConcerns: checked('skinConcerns'),
      textures: checked('textures'),
      heroIngredients: value('heroIngredients'),
      claims: checked('claims'),
      fragrance: value('fragrance'),
      referenceProducts: value('referenceProducts'),
    },
    packaging: {
      packagingSupport: value('packagingSupport'),
      primaryPackaging: checked('primaryPackaging'),
      secondaryPackaging: checked('secondaryPackaging'),
      designSupport: value('designSupport'),
      certifications: checked('certifications'),
    },
    notes: {
      keyRequirements: value('keyRequirements'),
      additionalNotes: value('additionalNotes'),
      source: value('source'),
      consent: !!form.elements.consent?.checked,
    }
  });

  const escapeHtml = (str = '') => str.replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const listText = (items) => items?.length ? items.join(', ') : '—';

  const renderSummary = () => {
    if (!summary) return;
    const d = data();
    summary.innerHTML = `
      <div class="summary-block"><span>Company</span><strong>${escapeHtml(d.contact.companyName || '—')}</strong></div>
      <div class="summary-block"><span>Service</span><strong>${escapeHtml(d.project.serviceType || '—')}</strong></div>
      <div class="summary-block"><span>Products</span><strong>${escapeHtml(listText(d.project.productCategories))}</strong></div>
      <div class="summary-block"><span>Target market</span><strong>${escapeHtml(d.project.targetMarkets || '—')}</strong></div>
      <div class="summary-block"><span>Quantity</span><strong>${escapeHtml(d.project.initialQuantity || '—')}</strong></div>
      <div class="summary-block"><span>Claims</span><strong>${escapeHtml(listText(d.formulation.claims))}</strong></div>
    `;
  };

  const validateStep = (index) => {
    const required = [...steps[index].querySelectorAll('[required]')];
    let ok = true;
    required.forEach((field) => {
      const valid = field.type === 'checkbox' ? field.checked : field.checkValidity();
      field.closest('.field, .consent-row')?.classList.toggle('has-error', !valid);
      if (!valid && ok) field.focus();
      ok = ok && valid;
    });
    return ok;
  };

  const show = (index) => {
    current = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, i) => step.hidden = i !== current);
    stepButtons.forEach((btn, i) => {
      btn.classList.toggle('is-active', i === current);
      btn.classList.toggle('is-done', i < current);
      btn.setAttribute('aria-current', i === current ? 'step' : 'false');
    });
    if (progress) progress.style.width = `${((current + 1) / steps.length) * 100}%`;
    renderSummary();
    window.scrollTo({ top: Math.max(0, form.offsetTop - 110), behavior: 'smooth' });
  };

  form.addEventListener('click', (event) => {
    const next = event.target.closest('[data-next]');
    const prev = event.target.closest('[data-prev]');
    if (next) {
      if (validateStep(current)) show(current + 1);
    }
    if (prev) show(current - 1);
  });

  form.addEventListener('input', renderSummary);
  form.addEventListener('change', renderSummary);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateStep(current)) return;
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Submitting…';
    try {
      const payload = data();
      const saved = await window.JNCOSInquiryStore.create(payload);
      form.hidden = true;
      if (success) {
        success.hidden = false;
        const id = success.querySelector('[data-inquiry-id]');
        if (id) id.textContent = saved.id.slice(0, 8).toUpperCase();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert('We could not save your inquiry. Please try again.');
      submit.disabled = false;
      submit.textContent = 'Submit Inquiry';
    }
  });

  show(0);
})();
