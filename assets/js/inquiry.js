(() => {
  const form = document.querySelector('[data-inquiry-form]');
  if (!form) return;

  const STORE_RUNTIME = '20260812-0138-rest';
  const ensureInquiryStore = () => new Promise((resolve, reject) => {
    const current = window.JNCOSInquiryStore?.diagnostics;
    if (current?.runtimeVersion === STORE_RUNTIME && current?.mode === 'firestore-rest+local') {
      resolve(window.JNCOSInquiryStore);
      return;
    }

    document.querySelectorAll('script[data-inquiry-store-refresh]').forEach((node) => node.remove());
    const script = document.createElement('script');
    script.src = `../assets/js/inquiry-store.js?v=${STORE_RUNTIME}`;
    script.setAttribute('data-inquiry-store-refresh', '');
    script.onload = () => {
      const loaded = window.JNCOSInquiryStore;
      if (loaded?.diagnostics?.runtimeVersion === STORE_RUNTIME) resolve(loaded);
      else reject(Object.assign(new Error('Updated inquiry storage runtime did not initialize.'), { code:'inquiry/runtime-not-loaded' }));
    };
    script.onerror = () => reject(Object.assign(new Error('Updated inquiry storage runtime could not be loaded.'), { code:'inquiry/runtime-load-failed' }));
    document.head.appendChild(script);
  });

  const style = document.createElement('style');
  style.textContent = `
    .inquiry-live-summary{overflow:visible!important}
    .summary-head{padding:22px 20px 18px!important}
    .summary-head>p{margin-top:8px!important;font-size:11px!important;line-height:1.55!important}
    .summary-content{max-height:none!important;overflow:visible!important;padding:0 20px 6px!important}
    .summary-row{padding:11px 0!important}
    .summary-row>span{margin-bottom:4px!important}
    .summary-row>strong{font-size:11.5px!important;line-height:1.42!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .summary-foot{padding:12px 20px!important}
  `;
  document.head.appendChild(style);

  const steps = [...form.querySelectorAll('[data-step]')];
  const progress = document.querySelector('[data-progress-bar]');
  const progressLabel = document.querySelector('[data-current-step-label]');
  const progressCount = document.querySelector('[data-current-step-count]');
  const success = document.querySelector('[data-inquiry-success]');
  let current = 0;

  const value = (name) => form.elements[name]?.value?.trim?.() || '';
  const checked = (name) => [...form.querySelectorAll(`[name="${name}"]:checked`)].map((el) => el.value);
  const compactList = (items, limit = 2) => {
    if (!Array.isArray(items) || !items.length) return '';
    const head = items.slice(0, limit).join(', ');
    return items.length > limit ? `${head} +${items.length - limit}` : head;
  };
  const escapeHtml = (str = '') => String(str).replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  const data = () => ({
    contact: {
      companyName: value('companyName'), contactName: value('contactName'), position: value('position'), companyType: value('companyType'), email: value('email'), phone: value('phone'), country: value('country'), website: value('website'), contactMethod: value('contactMethod'), contactTime: value('contactTime'),
    },
    project: {
      serviceType: value('serviceType'), productCategories: checked('productCategories'), projectStage: value('projectStage'), targetMarkets: value('targetMarkets'), launchTiming: value('launchTiming'), initialQuantity: value('initialQuantity'),
    },
    formulation: {
      skinConcerns: checked('skinConcerns'), textures: checked('textures'), heroIngredients: value('heroIngredients'), claims: checked('claims'), fragrance: value('fragrance'), referenceProducts: value('referenceProducts'),
    },
    packaging: {
      packagingSupport: value('packagingSupport'), primaryPackaging: checked('primaryPackaging'), secondaryPackaging: checked('secondaryPackaging'), designSupport: value('designSupport'), certifications: checked('certifications'),
    },
    notes: {
      keyRequirements: value('keyRequirements'), additionalNotes: value('additionalNotes'), source: value('source'), consent: !!form.elements.consent?.checked,
    }
  });

  const workspace = document.createElement('div');
  workspace.className = 'inquiry-workspace';
  form.parentNode.insertBefore(workspace, form);
  workspace.appendChild(form);

  const summary = document.createElement('aside');
  summary.className = 'inquiry-live-summary';
  summary.setAttribute('aria-live', 'polite');
  summary.innerHTML = `
    <div class="summary-head"><span>PROJECT SUMMARY</span><strong>Your brief at a glance</strong><p>Key decisions only. Full details are saved with your inquiry.</p></div>
    <div class="summary-content" data-summary-content></div>
    <div class="summary-foot">JN COS TECH · OEM / ODM PROJECT BUILDER</div>`;
  workspace.appendChild(summary);
  const summaryContent = summary.querySelector('[data-summary-content]');

  const summaryRow = (label, content, fallback = 'Not selected') => `<div class="summary-row"><span>${escapeHtml(label)}</span><strong class="${content ? '' : 'is-empty'}">${escapeHtml(content || fallback)}</strong></div>`;

  const renderSummary = () => {
    const d = data();
    const company = d.contact.companyName || d.contact.contactName;
    const market = d.project.targetMarkets || d.contact.country;
    const packaging = compactList(d.packaging.primaryPackaging, 2) || d.packaging.packagingSupport;
    const formula = compactList(d.formulation.skinConcerns, 2) || compactList(d.formulation.textures, 2);
    summaryContent.innerHTML = [
      summaryRow('Company', company),
      summaryRow('Service', d.project.serviceType),
      summaryRow('Products', compactList(d.project.productCategories, 2)),
      summaryRow('Formula Focus', formula),
      summaryRow('Packaging', packaging),
      summaryRow('Target Market', market),
      summaryRow('Quantity', d.project.initialQuantity),
      summaryRow('Launch', d.project.launchTiming),
    ].join('');
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

  const show = (index, scroll = true) => {
    current = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, i) => { step.hidden = i !== current; });
    if (progress) progress.style.width = `${((current + 1) / steps.length) * 100}%`;
    if (progressLabel) progressLabel.textContent = steps[current].dataset.stepLabel || `STEP ${current + 1}`;
    if (progressCount) progressCount.textContent = `${String(current + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`;
    renderSummary();
    if (scroll) {
      const shell = document.querySelector('.inquiry-shell');
      const top = Math.max(0, (shell?.offsetTop || form.offsetTop) - 110);
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  form.addEventListener('click', (event) => {
    const next = event.target.closest('[data-next]');
    const prev = event.target.closest('[data-prev]');
    if (next) { if (validateStep(current)) show(current + 1); }
    else if (prev) show(current - 1);
  });

  form.addEventListener('input', (event) => { event.target.closest('.field, .consent-row')?.classList.remove('has-error'); renderSummary(); });
  form.addEventListener('change', (event) => { event.target.closest('.field, .consent-row')?.classList.remove('has-error'); renderSummary(); });

  const prefillFromQuery = () => {
    const params = new URLSearchParams(window.location.search);
    ['companyName','contactName','email','phone','country','website','additionalNotes','source'].forEach((name) => {
      const val = params.get(name); const field = form.elements[name]; if (field && val) field.value = val;
    });
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateStep(current)) return;
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Submitting…';

    try {
      const store = await ensureInquiryStore();
      const saved = await store.create(data());
      workspace.hidden = true;
      document.querySelector('.inquiry-progress-head')?.setAttribute('hidden', '');
      document.querySelector('.inquiry-progress-track')?.setAttribute('hidden', '');
      if (success) {
        success.hidden = false;
        const id = success.querySelector('[data-inquiry-id]');
        if (id) id.textContent = saved.id.slice(0, 8).toUpperCase();
      }
      window.scrollTo({ top: Math.max(0, (document.querySelector('.inquiry-shell')?.offsetTop || 0) - 100), behavior: 'smooth' });
    } catch (error) {
      const last = window.JNCOS_INQUIRY_LAST_RESULT || {};
      console.error('[JNCOS Inquiry Submit]', error, last);
      const code = error?.code || last.code || 'unknown';
      const message = error?.message || last.message || 'Unknown Firebase error.';
      const status = error?.httpStatus || last.httpStatus || '';
      alert(`We could not save your inquiry. Please try again.\n\nFirebase error: ${code}${status ? ` (HTTP ${status})` : ''}\n${message}`);
      submit.disabled = false;
      submit.textContent = 'Submit Inquiry';
    }
  });

  prefillFromQuery();
  renderSummary();
  show(0, false);
})();
