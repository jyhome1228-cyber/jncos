(() => {
  const inquiryStore = window.JNCOSInquiryStore;
  const contactStore = window.JNCOSContactStore;
  const visitorStore = window.JNCOSVisitorStore;
  if (!inquiryStore || !contactStore || !visitorStore) return;

  const listEl = document.querySelector('[data-admin-list]');
  const emptyEl = document.querySelector('[data-admin-empty]');
  const detailEl = document.querySelector('[data-admin-detail]');
  const searchEl = document.querySelector('[data-admin-search]');
  const statusEl = document.querySelector('[data-admin-filter-status]');
  const typeEl = document.querySelector('[data-admin-filter-type]');
  const chartEl = document.querySelector('[data-traffic-chart]');
  let items = [];
  let activeKey = null;

  const escapeHtml = (str = '') => String(str).replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const listText = (value) => Array.isArray(value) ? (value.length ? value.join(', ') : '—') : (value === true ? 'Yes' : value === false ? 'No' : (value || '—'));
  const get = (obj, path, fallback = '—') => path.split('.').reduce((acc, key) => acc?.[key], obj) ?? fallback;
  const createdAt = (item) => item.createdAt || item.createdAtISO || item.updatedAtISO || new Date().toISOString();
  const formatDate = (iso) => {
    const date = new Date(iso); if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-IN', { dateStyle:'medium', timeStyle:'short', timeZone:'Asia/Kolkata' }).format(date);
  };
  const requestKey = (item) => `${item.type || 'inquiry'}:${item.id}`;
  const storeFor = (item) => item?.type === 'contact' ? contactStore : inquiryStore;
  const labelFor = (item) => item?.type === 'contact' ? 'Contact' : 'Inquiry';
  const companyFor = (item) => get(item,'contact.companyName','') || get(item,'contact.contactName','') || 'Unknown requester';
  const emailFor = (item) => get(item,'contact.email','');
  const phoneFor = (item) => get(item,'contact.phone','');
  const subtitleFor = (item) => item.type === 'contact' ? (item.message || 'General contact request') : get(item,'project.serviceType','Project inquiry');

  const inquirySections = [
    ['Contact Information', [
      ['Company / Brand','contact.companyName'],['Contact Person','contact.contactName'],['Position','contact.position'],['Company Type','contact.companyType'],['Email','contact.email'],['Phone / WhatsApp','contact.phone'],['Country / Region','contact.country'],['Website / Social','contact.website'],['Preferred Contact Method','contact.contactMethod'],['Preferred Contact Time','contact.contactTime']
    ]],
    ['Project Scope', [
      ['Service Type','project.serviceType'],['Product Categories','project.productCategories'],['Project Stage','project.projectStage'],['Target Markets','project.targetMarkets'],['Launch Timing','project.launchTiming'],['Initial Quantity','project.initialQuantity']
    ]],
    ['Formulation', [
      ['Skin / Product Concerns','formulation.skinConcerns'],['Textures / Finish','formulation.textures'],['Hero Ingredients / Avoid List','formulation.heroIngredients'],['Claims / Positioning','formulation.claims'],['Fragrance','formulation.fragrance'],['Reference Products','formulation.referenceProducts']
    ]],
    ['Packaging & Market Requirements', [
      ['Packaging Support','packaging.packagingSupport'],['Primary Packaging','packaging.primaryPackaging'],['Secondary Packaging','packaging.secondaryPackaging'],['Design Support','packaging.designSupport'],['Certifications / Market Requirements','packaging.certifications']
    ]],
    ['Additional Requirements', [
      ['Key Requirements','notes.keyRequirements'],['Additional Notes','notes.additionalNotes'],['How They Found Us','notes.source'],['Privacy Consent','notes.consent']
    ]]
  ];
  const contactSections = [
    ['Contact Information', [
      ['Company / Brand','contact.companyName'],['Contact Person','contact.contactName'],['Email','contact.email'],['Phone / WhatsApp','contact.phone'],['Country / Region','contact.country']
    ]],
    ['Message', [['Source','source'],['Submitted Page','page'],['Message','message']]]
  ];
  const sectionsFor = (item) => item.type === 'contact' ? contactSections : inquirySections;

  const setStat = (key, value) => { const el = document.querySelector(`[data-stat="${key}"]`); if (el) el.textContent = Number(value || 0).toLocaleString('en-IN'); };

  const filtered = () => {
    const q = (searchEl?.value || '').toLowerCase().trim();
    const status = statusEl?.value || 'All';
    const type = typeEl?.value || 'All';
    return items.filter((item) => {
      const haystack = [companyFor(item),get(item,'contact.contactName',''),emailFor(item),phoneFor(item),subtitleFor(item),item.message || ''].join(' ').toLowerCase();
      return (!q || haystack.includes(q)) && (status === 'All' || item.status === status) && (type === 'All' || item.type === type);
    });
  };

  const renderStats = async () => {
    const traffic = await visitorStore.stats();
    const inquiries = items.filter((x) => x.type === 'inquiry');
    const contacts = items.filter((x) => x.type === 'contact');
    setStat('todayVisitors',traffic.todayVisitors); setStat('weekVisitors',traffic.weekVisitors); setStat('totalVisitors',traffic.totalVisitors); setStat('totalSessions',traffic.totalSessions); setStat('pageViews',traffic.pageViews);
    setStat('newInquiries',inquiries.filter((x)=>x.status==='New').length); setStat('newContacts',contacts.filter((x)=>x.status==='New').length); setStat('totalRequests',items.length);
    renderTraffic(traffic.daily || []);
  };

  const renderTraffic = (daily) => {
    if (!chartEl) return;
    const max = Math.max(1,...daily.map((d)=>Number(d.visitors)||0));
    chartEl.innerHTML = daily.map((d) => {
      const height = Math.max(3, Math.round(((Number(d.visitors)||0) / max) * 100));
      const short = d.date?.slice(5).replace('-','/') || '';
      return `<div class="traffic-bar-item" title="${escapeHtml(d.date)} · ${d.visitors} visitors · ${d.pageViews} page views"><div class="traffic-bar-track"><b>${d.visitors}</b><div class="traffic-bar" style="height:${height}%"></div></div><small>${escapeHtml(short)}</small></div>`;
    }).join('');
  };

  const renderList = () => {
    const rows = filtered();
    if (emptyEl) emptyEl.hidden = rows.length > 0;
    listEl.innerHTML = rows.map((item) => {
      const key = requestKey(item);
      const subtitle = subtitleFor(item);
      return `<button class="admin-request-row ${key===activeKey?'is-active':''}" data-open-request="${escapeHtml(key)}" type="button"><span class="admin-row-main"><strong>${escapeHtml(companyFor(item))}</strong><small>${escapeHtml(String(subtitle).slice(0,88))}</small></span><span class="admin-row-meta"><em class="source-pill source-${item.type}">${labelFor(item)}</em><em class="status-pill status-${String(item.status||'New').toLowerCase()}">${escapeHtml(item.status||'New')}</em><small>${escapeHtml(formatDate(createdAt(item)))}</small></span></button>`;
    }).join('');
  };

  const renderFieldGrid = (fields) => `<div class="detail-grid">${fields.map(([label,path]) => {
    const full = /notes|requirements|reference|message|ingredients/i.test(`${label} ${path}`) ? ' full' : '';
    return `<div class="detail-field${full}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(listText(get(currentItem(),path)))}</strong></div>`;
  }).join('')}</div>`;

  const currentItem = () => items.find((item) => requestKey(item) === activeKey) || null;

  const renderDetail = (item) => {
    if (!item) {
      detailEl.innerHTML = '<div class="admin-detail-placeholder"><span class="admin-eyebrow">REQUEST DETAIL</span><h2>Select a request</h2><p>Choose an Inquiry or Contact request from the left to review the full customer brief, update status, and export a PDF.</p></div>';
      return;
    }
    const email = emailFor(item); const phone = phoneFor(item);
    const sections = sectionsFor(item);
    detailEl.innerHTML = `
      <div class="detail-head"><div class="detail-title-group"><em class="source-pill source-${item.type} detail-source">${labelFor(item)}</em><h2>${escapeHtml(companyFor(item))}</h2><p>${escapeHtml(item.id.slice(0,8).toUpperCase())} · ${escapeHtml(formatDate(createdAt(item)))}</p></div><div class="detail-actions"><button type="button" class="admin-btn" data-export-pdf>Export PDF</button><button type="button" class="admin-btn danger" data-delete-request>Delete</button></div></div>
      <div class="detail-status"><label>Status</label><select data-detail-status>${['New','Reviewing','Replied','Closed'].map((s)=>`<option ${item.status===s?'selected':''}>${s}</option>`).join('')}</select></div>
      <div class="detail-contact-actions">${email?`<a href="mailto:${escapeHtml(email)}">Email ${escapeHtml(email)}</a>`:''}${phone?`<a href="tel:${escapeHtml(phone.replace(/\s+/g,''))}">Call / WhatsApp ${escapeHtml(phone)}</a>`:''}</div>
      ${item.type==='contact' && item.message ? `<div class="detail-section"><h3 class="detail-section-title">Customer Message</h3><div class="detail-message">${escapeHtml(item.message)}</div></div>` : ''}
      ${sections.map(([title,fields]) => `<section class="detail-section"><h3 class="detail-section-title">${escapeHtml(title)}</h3>${renderFieldGrid(fields)}</section>`).join('')}
    `;
  };

  const select = (key) => { activeKey = key; renderList(); renderDetail(currentItem()); };

  const pdfSafeName = (value) => String(value || 'jncos-request').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'') || 'jncos-request';
  const exportPdf = (item) => {
    if (!item || !window.jspdf?.jsPDF) return alert('PDF library is not available.');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({unit:'mm',format:'a4'});
    const left=18, right=192, width=174; let y=18;
    const pageBreak = (need=12) => { if (y+need>278) { doc.addPage(); y=18; } };
    const textBlock = (label,value) => {
      const text = listText(value); const lines = doc.splitTextToSize(text,width);
      pageBreak(10 + lines.length*4.6);
      doc.setFont('helvetica','bold'); doc.setFontSize(7.6); doc.setTextColor(143,106,83); doc.text(String(label).toUpperCase(),left,y); y+=5;
      doc.setFont('helvetica','normal'); doc.setFontSize(9.5); doc.setTextColor(47,27,19); doc.text(lines,left,y); y += Math.max(8,lines.length*4.6+3);
    };
    const sectionTitle = (title) => { pageBreak(15); y+=3; doc.setDrawColor(218,204,194); doc.line(left,y,right,y); y+=7; doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(47,27,19); doc.text(title,left,y); y+=7; };
    doc.setFillColor(47,27,19); doc.rect(0,0,210,34,'F');
    doc.setTextColor(255); doc.setFont('helvetica','bold'); doc.setFontSize(19); doc.text(`JN COS TECH — ${labelFor(item)} Request`,left,17);
    doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(218,196,184); doc.text(`${item.id.slice(0,8).toUpperCase()} · ${formatDate(createdAt(item))} · ${item.status}`,left,25); y=43;
    textBlock('Company / Brand',companyFor(item));
    sectionsFor(item).forEach(([title,fields]) => { sectionTitle(title); fields.forEach(([label,path]) => textBlock(label,get(item,path))); });
    pageBreak(18); y+=5; doc.setDrawColor(218,204,194); doc.line(left,y,right,y); y+=7; doc.setFontSize(7.5); doc.setTextColor(125); doc.text(`Generated ${formatDate(new Date().toISOString())} · JN COS TECH Pvt. Ltd.`,left,y);
    doc.save(`${pdfSafeName(companyFor(item))}-${item.type}-${item.id.slice(0,8)}.pdf`);
  };

  const exportCsv = () => {
    const headers=['type','id','date','status','company','name','email','phone','country','service','message'];
    const rows=items.map((item)=>[item.type,item.id,createdAt(item),item.status,companyFor(item),get(item,'contact.contactName',''),emailFor(item),phoneFor(item),get(item,'contact.country',''),get(item,'project.serviceType',''),item.message||get(item,'notes.additionalNotes','')]);
    const csv=[headers,...rows].map((row)=>row.map((v)=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='jncos-requests.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const renderMode = () => {
    const cloud = Boolean(window.JNCOSCloudStore?.configured);
    const mode = document.querySelector('[data-admin-mode]'); const source = document.querySelector('[data-data-source]'); const title = document.querySelector('[data-admin-storage-title]'); const note = document.querySelector('[data-admin-storage-note]');
    if (mode) { mode.textContent = cloud ? 'Firestore + local backup' : 'Local backup · Firebase config needed'; mode.classList.toggle('is-cloud',cloud); }
    if (source) source.textContent = cloud ? 'Firestore + local backup' : 'Local browser backup';
    if (title) title.textContent = cloud ? 'Cloud sync active' : 'Local backup mode';
    if (note) note.innerHTML = cloud ? 'Inquiry, Contact and visitor sessions are synchronized to Firestore and retained locally as a browser backup.' : 'Requests are backed up in this browser. Add the Firebase Web App configuration in <code>assets/js/firebase-config.js</code> to sync Inquiry, Contact and visitor data across devices.';
  };

  const load = async (preserveSelection=true) => {
    const [inquiries,contacts] = await Promise.all([inquiryStore.list(),contactStore.list()]);
    items=[...inquiries.map((x)=>({...x,type:'inquiry'})),...contacts.map((x)=>({...x,type:'contact'}))].sort((a,b)=>new Date(createdAt(b))-new Date(createdAt(a)));
    if (!preserveSelection || !items.some((x)=>requestKey(x)===activeKey)) activeKey=items[0]?requestKey(items[0]):null;
    renderMode(); renderList(); renderDetail(currentItem()); await renderStats();
  };

  listEl.addEventListener('click',(e)=>{const btn=e.target.closest('[data-open-request]');if(btn)select(btn.dataset.openRequest);});
  detailEl.addEventListener('change',async(e)=>{if(!e.target.matches('[data-detail-status]'))return;const item=currentItem();if(!item)return;await storeFor(item).setStatus(item.id,e.target.value);item.status=e.target.value;renderList();await renderStats();});
  detailEl.addEventListener('click',async(e)=>{const item=currentItem();if(e.target.closest('[data-export-pdf]'))exportPdf(item);if(e.target.closest('[data-delete-request]')&&item&&confirm('Delete this request? This cannot be undone.')){await storeFor(item).remove(item.id);items=items.filter((x)=>requestKey(x)!==requestKey(item));activeKey=items[0]?requestKey(items[0]):null;renderList();renderDetail(currentItem());await renderStats();}});
  searchEl?.addEventListener('input',renderList); statusEl?.addEventListener('change',renderList); typeEl?.addEventListener('change',renderList);
  document.querySelector('[data-export-csv]')?.addEventListener('click',exportCsv); document.querySelector('[data-refresh]')?.addEventListener('click',()=>load(true));
  load(false);
})();
