(() => {
  if (!window.JNCOS_ADMIN_READY || !window.JNCOSCloudStore?.configured) return;

  const listEl = document.querySelector('[data-admin-list]');
  const emptyEl = document.querySelector('[data-admin-empty]');
  const detailEl = document.querySelector('[data-admin-detail]');
  const searchEl = document.querySelector('[data-admin-search]');
  const statusEl = document.querySelector('[data-admin-filter-status]');
  const typeEl = document.querySelector('[data-admin-filter-type]');
  const chartEl = document.querySelector('[data-traffic-chart]');
  const modeEl = document.querySelector('[data-admin-mode]');
  const sourceEl = document.querySelector('[data-data-source]');
  let items = [];
  let visits = [];
  let activeKey = null;
  let client = null;

  const esc = (v='') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const get = (obj,path,fallback='—') => path.split('.').reduce((a,k)=>a?.[k],obj) ?? fallback;
  const listText = (v) => Array.isArray(v) ? (v.length ? v.join(', ') : '—') : (v===true?'Yes':v===false?'No':(v||'—'));
  const createdAt = (item) => item.createdAt || item.createdAtISO || item.updatedAtISO || new Date().toISOString();
  const fmt = (iso) => { const d=new Date(iso); return Number.isNaN(d.getTime())?'—':new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kolkata'}).format(d); };
  const keyOf = (item) => `${item.type}:${item.id}`;
  const companyOf = (item) => get(item,'contact.companyName','') || get(item,'contact.contactName','') || 'Unknown requester';
  const emailOf = (item) => get(item,'contact.email','');
  const phoneOf = (item) => get(item,'contact.phone','');
  const sourceLabel = (item) => item.type === 'contact' ? 'Contact' : 'Inquiry';
  const subtitleOf = (item) => item.type === 'contact' ? (item.message || 'General contact request') : get(item,'project.serviceType','Project inquiry');
  const current = () => items.find(x => keyOf(x) === activeKey) || null;

  const inquirySections = [
    ['Contact Information', [['Company / Brand','contact.companyName'],['Contact Person','contact.contactName'],['Position','contact.position'],['Company Type','contact.companyType'],['Email','contact.email'],['Phone / WhatsApp','contact.phone'],['Country / Region','contact.country'],['Website / Social','contact.website'],['Preferred Contact Method','contact.contactMethod'],['Preferred Contact Time','contact.contactTime']]],
    ['Project Scope', [['Service Type','project.serviceType'],['Product Categories','project.productCategories'],['Project Stage','project.projectStage'],['Target Markets','project.targetMarkets'],['Launch Timing','project.launchTiming'],['Initial Quantity','project.initialQuantity']]],
    ['Formulation', [['Skin / Product Concerns','formulation.skinConcerns'],['Textures / Finish','formulation.textures'],['Hero Ingredients / Avoid List','formulation.heroIngredients'],['Claims / Positioning','formulation.claims'],['Fragrance','formulation.fragrance'],['Reference Products','formulation.referenceProducts']]],
    ['Packaging & Market Requirements', [['Packaging Support','packaging.packagingSupport'],['Primary Packaging','packaging.primaryPackaging'],['Secondary Packaging','packaging.secondaryPackaging'],['Design Support','packaging.designSupport'],['Certifications / Market Requirements','packaging.certifications']]],
    ['Additional Requirements', [['Key Requirements','notes.keyRequirements'],['Additional Notes','notes.additionalNotes'],['How They Found Us','notes.source'],['Privacy Consent','notes.consent']]]
  ];
  const contactSections = [
    ['Contact Information', [['Company / Brand','contact.companyName'],['Contact Person','contact.contactName'],['Email','contact.email'],['Phone / WhatsApp','contact.phone'],['Country / Region','contact.country']]],
    ['Message', [['Source','source'],['Submitted Page','page'],['Message','message']]]
  ];
  const sectionsFor = (item) => item.type === 'contact' ? contactSections : inquirySections;

  const setStat = (key,value) => { const el=document.querySelector(`[data-stat="${key}"]`); if(el) el.textContent=Number(value||0).toLocaleString('en-IN'); };
  const normalize = (value) => {
    if (value == null) return value;
    if (Array.isArray(value)) return value.map(normalize);
    if (typeof value === 'object') {
      if (typeof value.toDate === 'function') return value.toDate().toISOString();
      const out={}; Object.entries(value).forEach(([k,v])=>out[k]=normalize(v)); return out;
    }
    return value;
  };

  const readCollection = async (name,max=1500) => {
    const { db, fs } = client;
    const q = fs.query(fs.collection(db,name), fs.limit(max));
    const snap = await fs.getDocs(q);
    return snap.docs.map(doc => normalize({ id:doc.id, ...doc.data() }));
  };

  const filtered = () => {
    const q=(searchEl?.value||'').toLowerCase().trim();
    const status=statusEl?.value||'All';
    const type=typeEl?.value||'All';
    return items.filter(item => {
      const hay=[companyOf(item),get(item,'contact.contactName',''),emailOf(item),phoneOf(item),subtitleOf(item),item.message||''].join(' ').toLowerCase();
      return (!q||hay.includes(q)) && (status==='All'||item.status===status) && (type==='All'||item.type===type);
    });
  };

  const renderList = () => {
    const rows=filtered();
    if(emptyEl) emptyEl.hidden=rows.length>0;
    listEl.innerHTML=rows.map(item=>{
      const key=keyOf(item);
      return `<button class="admin-request-row ${key===activeKey?'is-active':''}" data-open-request="${esc(key)}" type="button"><span class="admin-row-main"><strong>${esc(companyOf(item))}</strong><small>${esc(String(subtitleOf(item)).slice(0,88))}</small></span><span class="admin-row-meta"><em class="source-pill source-${item.type}">${sourceLabel(item)}</em><em class="status-pill status-${String(item.status||'New').toLowerCase()}">${esc(item.status||'New')}</em><small>${esc(fmt(createdAt(item)))}</small></span></button>`;
    }).join('');
  };

  const renderFieldGrid = (item,fields) => `<div class="detail-grid">${fields.map(([label,path])=>{
    const full=/notes|requirements|reference|message|ingredients/i.test(`${label} ${path}`)?' full':'';
    return `<div class="detail-field${full}"><span>${esc(label)}</span><strong>${esc(listText(get(item,path)))}</strong></div>`;
  }).join('')}</div>`;

  const renderDetail = (item) => {
    if(!item){ detailEl.innerHTML='<div class="admin-detail-placeholder"><span class="admin-eyebrow">REQUEST DETAIL</span><h2>Select a request</h2><p>Choose an Inquiry or Contact request from the left to review the full customer brief, update status, and export a PDF.</p></div>'; return; }
    const email=emailOf(item), phone=phoneOf(item);
    detailEl.innerHTML=`<div class="detail-head"><div class="detail-title-group"><em class="source-pill source-${item.type} detail-source">${sourceLabel(item)}</em><h2>${esc(companyOf(item))}</h2><p>${esc(item.id.slice(0,8).toUpperCase())} · ${esc(fmt(createdAt(item)))}</p></div><div class="detail-actions"><button type="button" class="admin-btn" data-export-pdf>Export PDF</button><button type="button" class="admin-btn danger" data-delete-request>Delete</button></div></div><div class="detail-status"><label>Status</label><select data-detail-status>${['New','Reviewing','Replied','Closed'].map(s=>`<option ${item.status===s?'selected':''}>${s}</option>`).join('')}</select></div><div class="detail-contact-actions">${email?`<a href="mailto:${esc(email)}">Email ${esc(email)}</a>`:''}${phone?`<a href="tel:${esc(phone.replace(/\s+/g,''))}">Call / WhatsApp ${esc(phone)}</a>`:''}</div>${item.type==='contact'&&item.message?`<div class="detail-section"><h3 class="detail-section-title">Customer Message</h3><div class="detail-message">${esc(item.message)}</div></div>`:''}${sectionsFor(item).map(([title,fields])=>`<section class="detail-section"><h3 class="detail-section-title">${esc(title)}</h3>${renderFieldGrid(item,fields)}</section>`).join('')}`;
  };

  const indiaDate = (date=new Date()) => {
    const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
    const g=t=>p.find(x=>x.type===t)?.value||''; return `${g('year')}-${g('month')}-${g('day')}`;
  };

  const renderTraffic = () => {
    const today=indiaDate(); const now=new Date(); const days=[];
    for(let i=6;i>=0;i--) days.push(indiaDate(new Date(now.getTime()-i*86400000)));
    const unique=rows=>new Set(rows.map(v=>v.visitorId||v.id)).size;
    const todayRows=visits.filter(v=>v.date===today);
    const weekRows=visits.filter(v=>days.includes(v.date));
    setStat('todayVisitors',unique(todayRows)); setStat('weekVisitors',unique(weekRows)); setStat('totalVisitors',unique(visits));
    setStat('totalSessions',visits.length); setStat('pageViews',visits.reduce((s,v)=>s+(Number(v.pageViews)||0),0));
    setStat('newInquiries',items.filter(x=>x.type==='inquiry'&&(x.status||'New')==='New').length);
    setStat('newContacts',items.filter(x=>x.type==='contact'&&(x.status||'New')==='New').length);
    setStat('totalRequests',items.length);
    const daily=days.map(date=>({date,visitors:unique(visits.filter(v=>v.date===date)),pageViews:visits.filter(v=>v.date===date).reduce((s,v)=>s+(Number(v.pageViews)||0),0)}));
    const max=Math.max(1,...daily.map(d=>d.visitors));
    chartEl.innerHTML=daily.map(d=>`<div class="traffic-bar-item" title="${esc(d.date)} · ${d.visitors} visitors · ${d.pageViews} page views"><div class="traffic-bar-track"><b>${d.visitors}</b><div class="traffic-bar" style="height:${Math.max(3,Math.round((d.visitors/max)*100))}%"></div></div><small>${esc(d.date.slice(5).replace('-','/'))}</small></div>`).join('');
  };

  const exportPdf = (item) => {
    if(!item||!window.jspdf?.jsPDF) return alert('PDF library is not available.');
    const {jsPDF}=window.jspdf; const doc=new jsPDF({unit:'mm',format:'a4'}); let y=18; const left=18,width=174;
    const pageBreak=(need=12)=>{if(y+need>278){doc.addPage();y=18;}};
    const block=(label,val)=>{const lines=doc.splitTextToSize(listText(val),width);pageBreak(10+lines.length*4.6);doc.setFont('helvetica','bold');doc.setFontSize(7.5);doc.setTextColor(143,106,83);doc.text(String(label).toUpperCase(),left,y);y+=5;doc.setFont('helvetica','normal');doc.setFontSize(9.5);doc.setTextColor(47,27,19);doc.text(lines,left,y);y+=Math.max(8,lines.length*4.6+3);};
    doc.setFillColor(47,27,19);doc.rect(0,0,210,34,'F');doc.setTextColor(255);doc.setFont('helvetica','bold');doc.setFontSize(18);doc.text(`JN COS TECH — ${sourceLabel(item)} Request`,left,17);doc.setFontSize(8);doc.text(`${item.id.slice(0,8).toUpperCase()} · ${fmt(createdAt(item))}`,left,25);y=43;block('Company / Brand',companyOf(item));sectionsFor(item).forEach(([title,fields])=>{pageBreak(15);doc.setDrawColor(218,204,194);doc.line(left,y,192,y);y+=7;doc.setTextColor(47,27,19);doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text(title,left,y);y+=7;fields.forEach(([label,path])=>block(label,get(item,path)));});doc.save(`${companyOf(item).replace(/[^a-z0-9]+/gi,'-')||'jncos'}-${item.type}-${item.id.slice(0,8)}.pdf`);
  };

  const exportCsv = () => {
    const rows=[['type','id','date','status','company','name','email','phone','country','service','message'],...items.map(item=>[item.type,item.id,createdAt(item),item.status||'New',companyOf(item),get(item,'contact.contactName',''),emailOf(item),phoneOf(item),get(item,'contact.country',''),get(item,'project.serviceType',''),item.message||get(item,'notes.additionalNotes','')])];
    const csv=rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n'); const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}); const url=URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download='jncos-requests.csv';a.click();URL.revokeObjectURL(url);
  };

  const load = async () => {
    if(modeEl){modeEl.textContent='Loading Firestore…';modeEl.classList.remove('is-cloud');}
    try{
      client=await window.JNCOSCloudStore.getClient();
      if(!client) throw Object.assign(new Error('Firebase client unavailable'),{code:'firebase/not-initialized'});
      const [inq,con,vis]=await Promise.all([readCollection('inquiries',1000),readCollection('contacts',1000),readCollection('visits',1500)]);
      items=[...inq.map(x=>({...x,type:'inquiry',status:x.status||'New'})),...con.map(x=>({...x,type:'contact',status:x.status||'New'}))].sort((a,b)=>new Date(createdAt(b))-new Date(createdAt(a)));
      visits=vis;
      activeKey=items[0]?keyOf(items[0]):null;
      if(modeEl){modeEl.textContent=`Firestore connected · ${items.length} requests`;modeEl.classList.add('is-cloud');}
      if(sourceEl) sourceEl.textContent='Firestore';
      renderList(); renderDetail(current()); renderTraffic();
    }catch(error){
      console.error('[JNCOS Admin Firestore]',error);
      if(modeEl){modeEl.textContent=`Firestore read failed${error?.code?` · ${error.code}`:''}`;modeEl.classList.remove('is-cloud');}
      if(sourceEl) sourceEl.textContent='Firestore read error';
      detailEl.innerHTML=`<div class="admin-detail-placeholder"><span class="admin-eyebrow">FIRESTORE ERROR</span><h2>Unable to load requests</h2><p>${esc(error?.message||'Unknown Firestore error')}</p></div>`;
    }
  };

  listEl.addEventListener('click',e=>{const b=e.target.closest('[data-open-request]');if(!b)return;activeKey=b.dataset.openRequest;renderList();renderDetail(current());});
  searchEl?.addEventListener('input',renderList);statusEl?.addEventListener('change',renderList);typeEl?.addEventListener('change',renderList);
  detailEl.addEventListener('change',async e=>{if(!e.target.matches('[data-detail-status]'))return;const item=current();if(!item)return;const {db,fs}=client;await fs.setDoc(fs.doc(db,item.type==='contact'?'contacts':'inquiries',item.id),{status:e.target.value,updatedAtISO:new Date().toISOString()},{merge:true});item.status=e.target.value;renderList();renderTraffic();});
  detailEl.addEventListener('click',async e=>{const item=current();if(e.target.closest('[data-export-pdf]'))exportPdf(item);if(e.target.closest('[data-delete-request]')&&item&&confirm('Delete this request?')){const {db,fs}=client;await fs.deleteDoc(fs.doc(db,item.type==='contact'?'contacts':'inquiries',item.id));items=items.filter(x=>keyOf(x)!==keyOf(item));activeKey=items[0]?keyOf(items[0]):null;renderList();renderDetail(current());renderTraffic();}});
  document.querySelector('[data-export-csv]')?.addEventListener('click',exportCsv);
  document.querySelector('[data-refresh]')?.addEventListener('click',load);

  load();
})();
