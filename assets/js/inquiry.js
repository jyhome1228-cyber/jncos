(() => {
  const form = document.querySelector('[data-inquiry-form]');
  if (!form || !window.JNCOSInquiryStore) return;

  const steps = [...form.querySelectorAll('[data-step]')];
  const progress = document.querySelector('[data-progress-bar]');
  const progressLabel = document.querySelector('[data-current-step-label]');
  const progressCount = document.querySelector('[data-current-step-count]');
  const success = document.querySelector('[data-inquiry-success]');
  let current = 0;

  const value = (name) => form.elements[name]?.value?.trim?.() || '';
  const checked = (name) => [...form.querySelectorAll(`[name="${name}"]:checked`)].map((el) => el.value);

  const data = () => ({
    contact: {
      companyName: value('companyName'),
      contactName: value('contactName'),
      position: value('position'),
      companyType: value('companyType'),
      email: value('email'),
      phone: value('phone'),
      country: value('country'),
      website: value('website'),
      contactMethod: value('contactMethod'),
      contactTime: value('contactTime'),
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

  const show = (index, scroll = true) => {
    current = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, i) => { step.hidden = i !== current; });
    if (progress) progress.style.width = `${((current + 1) / steps.length) * 100}%`;
    if (progressLabel) progressLabel.textContent = steps[current].dataset.stepLabel || `STEP ${current + 1}`;
    if (progressCount) progressCount.textContent = `${String(current + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`;
    if (scroll) {
      const shell = document.querySelector('.inquiry-shell');
      const top = Math.max(0, (shell?.offsetTop || form.offsetTop) - 110);
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  form.addEventListener('click', (event) => {
    const next = event.target.closest('[data-next]');
    const prev = event.target.closest('[data-prev]');
    if (next) {
      if (validateStep(current)) show(current + 1);
    } else if (prev) {
      show(current - 1);
    }
  });

  form.addEventListener('input', (event) => {
    event.target.closest('.field, .consent-row')?.classList.remove('has-error');
  });
  form.addEventListener('change', (event) => {
    event.target.closest('.field, .consent-row')?.classList.remove('has-error');
  });

  const prefillFromQuery = () => {
    const params = new URLSearchParams(window.location.search);
    const fields = ['companyName','contactName','email','phone','country','website','additionalNotes','source'];
    fields.forEach((name) => {
      const val = params.get(name);
      const field = form.elements[name];
      if (field && val) field.value = val;
    });
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateStep(current)) return;
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Submitting…';
    try {
      const saved = await window.JNCOSInquiryStore.create(data());
      form.hidden = true;
      document.querySelector('.inquiry-progress-head')?.setAttribute('hidden', '');
      document.querySelector('.inquiry-progress-track')?.setAttribute('hidden', '');
      if (success) {
        success.hidden = false;
        const id = success.querySelector('[data-inquiry-id]');
        if (id) id.textContent = saved.id.slice(0, 8).toUpperCase();
      }
      window.scrollTo({ top: Math.max(0, (document.querySelector('.inquiry-shell')?.offsetTop || 0) - 100), behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert('We could not save your inquiry. Please try again.');
      submit.disabled = false;
      submit.textContent = 'Submit Inquiry';
    }
  });

  prefillFromQuery();
  show(0, false);
})();
