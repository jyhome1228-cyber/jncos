(() => {
  const store = window.JNCOSInquiryStore;
  if (!store) return;

  const listEl = document.querySelector('[data-admin-list]');
  const emptyEl = document.querySelector('[data-admin-empty]');
  const detailEl = document.querySelector('[data-admin-detail]');
  const searchEl = document.querySelector('[data-admin-search]');
  const statusEl = document.querySelector('[data-admin-filter-status]');
  const countEls = [...document.querySelectorAll('[data-count]')];
  let items = [];
  let activeId = null;

  const escapeHtml = (str = '') => String(str).replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const formatDate = (iso) => new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
  const listText = (value) => Array.isArray(value) && value.length ? value.join(', ') : (value || '—');
  const get = (obj, path, fallback = '—') => path.split('.').reduce((acc, key) => acc?.[key], obj) ?? fallback;

  const fields = [
    ['Company', 'contact.companyName'], ['Contact', 'contact.contactName'], ['Email', 'contact.email'], ['Phone / WhatsApp', 'contact.phone'],
    ['Country', 'contact.country'], ['Website / Social', 'contact.website'], ['Preferred contact', 'contact.contactMethod'],
    ['Service type', 'project.serviceType'], ['Product categories', 'project.productCategories'], ['Project stage', 'project.projectStage'],
    ['Target markets', 'project.targetMarkets'], ['Launch timing', 'project.launchTiming'], ['Initial quantity', 'project.initialQuantity'],
    ['Skin concerns', 'formulation.skinConcerns'], ['Textures', 'formulation.textures'], ['Hero ingredients', 'formulation.heroIngredients'],
    ['Claims', 'formulation.claims'], ['Fragrance', 'formulation.fragrance'], ['Reference products', 'formulation.referenceProducts'],
    ['Packaging support', 'packaging.packagingSupport'], ['Primary packaging', 'packaging.primaryPackaging'],
    ['Secondary packaging', 'packaging.secondaryPackaging'], ['Design support', 'packaging.designSupport'], ['Certifications', 'packaging.certifications'],
    ['Key requirements', 'notes.keyRequirements'], ['Additional notes', 'notes.additionalNotes'], ['How they found us', 'notes.source']
  ];

  const filtered = () => {
    const q = (searchEl?.value || '').toLowerCase().trim();
    const status = statusEl?.value || 'All';
    return items.filter((item) => {
      const haystack = [get(item,'contact.companyName',''), get(item,'contact.contactName',''), get(item,'contact.email',''), get(item,'project.serviceType','')].join(' ').toLowerCase();
      return (!q || haystack.includes(q)) && (status === 'All' || item.status === status);
    });
  };

  const renderCounts = () => {
    const totals = { All: items.length, New: 0, Reviewing: 0, Replied: 0, Closed: 0 };
    items.forEach((item) => totals[item.status] = (totals[item.status] || 0) + 1);
    countEls.forEach((el) => el.textContent = totals[el.dataset.count] || 0);
  };

  const renderList = () => {
    const rows = filtered();
    if (emptyEl) emptyEl.hidden = rows.length > 0;
    listEl.innerHTML = rows.map((item) => `
      <button class="admin-inquiry-row ${item.id === activeId ? 'is-active' : ''}" data-open-inquiry="${item.id}" type="button">
        <span class="admin-row-main"><strong>${escapeHtml(get(item,'contact.companyName','Unknown company'))}</strong><small>${escapeHtml(get(item,'project.serviceType','General inquiry'))}</small></span>
        <span class="admin-row-meta"><em class="status-pill status-${escapeHtml(item.status.toLowerCase())}">${escapeHtml(item.status)}</em><small>${escapeHtml(formatDate(item.createdAt))}</small></span>
      </button>
    `).join('');
  };

  const renderDetail = (item) => {
    if (!item) {
      detailEl.innerHTML = '<div class="admin-detail-placeholder"><span>INQUIRY DETAIL</span><h2>Select an inquiry</h2><p>Choose an item from the list to review its complete project brief.</p></div>';
      return;
    }
    detailEl.innerHTML = `
      <div class="detail-head">
        <div><span class="admin-kicker">${escapeHtml(item.id.slice(0,8).toUpperCase())}</span><h2>${escapeHtml(get(item,'contact.companyName','Inquiry'))}</h2><p>${escapeHtml(formatDate(item.createdAt))}</p></div>
        <div class="detail-actions"><button type="button" class="admin-btn" data-export-pdf>Export PDF</button><button type="button" class="admin-btn danger" data-delete-inquiry>Delete</button></div>
      </div>
      <div class="detail-status"><label>Status</label><select data-detail-status>${['New','Reviewing','Replied','Closed'].map((s)=>`<option ${item.status===s?'selected':''}>${s}</option>`).join('')}</select></div>
      <div class="detail-grid">${fields.map(([label,path]) => `<div class="detail-field"><span>${escapeHtml(label)}</span><strong>${escapeHtml(listText(get(item,path)))}</strong></div>`).join('')}</div>
    `;
  };

  const select = (id) => {
    activeId = id;
    renderList();
    renderDetail(items.find((item) => item.id === id));
  };

  const exportPdf = (item) => {
    if (!item || !window.jspdf?.jsPDF) return alert('PDF library is not available.');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const left = 18, width = 174;
    let y = 18;
    const nextPage = (need = 14) => { if (y + need > 280) { doc.addPage(); y = 18; } };
    const addText = (label, value) => {
      nextPage(18);
      doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(130); doc.text(label.toUpperCase(), left, y);
      y += 5;
      doc.setFont('helvetica','normal'); doc.setFontSize(10); doc.setTextColor(35);
      const lines = doc.splitTextToSize(listText(value), width);
      doc.text(lines, left, y); y += Math.max(8, lines.length * 5 + 3);
    };
    doc.setFont('helvetica','bold'); doc.setFontSize(20); doc.setTextColor(35); doc.text('JNCOS TECH — Project Inquiry', left, y); y += 9;
    doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(110); doc.text(`Inquiry ${item.id.slice(0,8).toUpperCase()} · ${formatDate(item.createdAt)} · ${item.status}`, left, y); y += 12;
    fields.forEach(([label,path]) => addText(label, get(item,path)));
    const filename = `${get(item,'contact.companyName','jncos-inquiry').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'') || 'jncos-inquiry'}-${item.id.slice(0,8)}.pdf`;
    doc.save(filename);
  };

  const init = async () => {
    items = await store.list();
    renderCounts(); renderList(); renderDetail(null);
    if (items.length) select(items[0].id);
  };

  listEl.addEventListener('click', (e) => { const btn = e.target.closest('[data-open-inquiry]'); if (btn) select(btn.dataset.openInquiry); });
  detailEl.addEventListener('change', async (e) => {
    if (!e.target.matches('[data-detail-status]') || !activeId) return;
    await store.setStatus(activeId, e.target.value);
    const item = items.find((x) => x.id === activeId); if (item) item.status = e.target.value;
    renderCounts(); renderList();
  });
  detailEl.addEventListener('click', async (e) => {
    const item = items.find((x) => x.id === activeId);
    if (e.target.closest('[data-export-pdf]')) exportPdf(item);
    if (e.target.closest('[data-delete-inquiry]') && item && confirm('Delete this inquiry? This cannot be undone.')) {
      await store.remove(item.id); items = items.filter((x) => x.id !== item.id); activeId = null; renderCounts(); renderList(); renderDetail(null);
    }
  });
  searchEl?.addEventListener('input', renderList);
  statusEl?.addEventListener('change', renderList);
  document.querySelector('[data-export-csv]')?.addEventListener('click', () => {
    const headers = ['id','date','status',...fields.map(([l])=>l)];
    const rows = items.map((item) => [item.id,item.createdAt,item.status,...fields.map(([,p])=>listText(get(item,p,'')))]);
    const csv = [headers,...rows].map((row)=>row.map((v)=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='jncos-inquiries.csv'; a.click(); URL.revokeObjectURL(url);
  });
  init();
})();
