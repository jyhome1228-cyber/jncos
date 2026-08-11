(() => {
  const PRINT_ID = 'jncos-admin-print-root';

  const esc = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const ensurePrintStyle = () => {
    if (document.querySelector('style[data-admin-pdf-print]')) return;
    const style = document.createElement('style');
    style.setAttribute('data-admin-pdf-print', '');
    style.textContent = `
      #${PRINT_ID}{display:none}
      @media print{
        @page{size:A4;margin:15mm 16mm 14mm}
        html,body{background:#fff!important}
        body.admin-body > *:not(#${PRINT_ID}){display:none!important}
        #${PRINT_ID}{
          display:block!important;
          width:100%!important;
          margin:0!important;
          padding:0!important;
          background:#fff!important;
          color:#2f211c!important;
          font-family:Pretendard,Arial,"Noto Sans KR",sans-serif!important;
          font-size:10px!important;
          line-height:1.55!important;
        }
        #${PRINT_ID} *{box-sizing:border-box!important}
        #${PRINT_ID} .pdf-top{
          display:flex!important;
          justify-content:space-between!important;
          align-items:flex-start!important;
          gap:24px!important;
          padding:0 0 13px!important;
          margin:0 0 23px!important;
          border-bottom:.6px solid #cdbfb5!important;
        }
        #${PRINT_ID} .pdf-brand strong{
          display:block!important;
          margin:0 0 5px!important;
          color:#2f211c!important;
          font-size:21px!important;
          line-height:1!important;
          font-weight:800!important;
          letter-spacing:-.035em!important;
        }
        #${PRINT_ID} .pdf-brand span,
        #${PRINT_ID} .pdf-meta-label,
        #${PRINT_ID} .pdf-section-title,
        #${PRINT_ID} .pdf-label{
          color:#927463!important;
          font-size:7.4px!important;
          font-weight:750!important;
          letter-spacing:.13em!important;
          text-transform:uppercase!important;
        }
        #${PRINT_ID} .pdf-top-meta{text-align:right!important}
        #${PRINT_ID} .pdf-top-meta p{margin:0 0 7px!important;color:#75645a!important;font-size:8px!important}
        #${PRINT_ID} .pdf-top-meta p:last-child{margin-bottom:0!important}
        #${PRINT_ID} .pdf-request-head{margin:0 0 25px!important;page-break-inside:avoid!important}
        #${PRINT_ID} .pdf-badge{
          display:inline-flex!important;
          align-items:center!important;
          min-height:22px!important;
          padding:0 8px!important;
          margin:0 0 11px!important;
          border:.6px solid #cdbfb5!important;
          color:#6e584c!important;
          background:#fff!important;
          font-size:7.3px!important;
          font-weight:750!important;
          letter-spacing:.11em!important;
          text-transform:uppercase!important;
        }
        #${PRINT_ID} .pdf-request-head h1{
          margin:0 0 6px!important;
          color:#2f211c!important;
          font-size:25px!important;
          line-height:1.08!important;
          font-weight:800!important;
          letter-spacing:-.045em!important;
        }
        #${PRINT_ID} .pdf-request-head p{margin:0!important;color:#85746b!important;font-size:8.5px!important}
        #${PRINT_ID} .pdf-summary{
          display:grid!important;
          grid-template-columns:repeat(4,minmax(0,1fr))!important;
          margin:0 0 24px!important;
          border-top:.6px solid #d7cbc3!important;
          border-left:.6px solid #d7cbc3!important;
          page-break-inside:avoid!important;
        }
        #${PRINT_ID} .pdf-summary-item{
          min-height:58px!important;
          padding:10px 11px!important;
          border-right:.6px solid #d7cbc3!important;
          border-bottom:.6px solid #d7cbc3!important;
        }
        #${PRINT_ID} .pdf-summary-item strong{display:block!important;margin-top:6px!important;color:#2f211c!important;font-size:9.5px!important;font-weight:650!important;line-height:1.35!important;overflow-wrap:anywhere!important}
        #${PRINT_ID} .pdf-section{margin:0 0 22px!important}
        #${PRINT_ID} .pdf-section-head{display:flex!important;align-items:center!important;gap:12px!important;margin:0 0 9px!important}
        #${PRINT_ID} .pdf-section-head::after{content:""!important;display:block!important;flex:1!important;height:.6px!important;background:#d7cbc3!important}
        #${PRINT_ID} .pdf-grid{
          display:grid!important;
          grid-template-columns:repeat(2,minmax(0,1fr))!important;
          border-top:.6px solid #d7cbc3!important;
          border-left:.6px solid #d7cbc3!important;
        }
        #${PRINT_ID} .pdf-field{
          min-height:62px!important;
          padding:10px 11px!important;
          border-right:.6px solid #d7cbc3!important;
          border-bottom:.6px solid #d7cbc3!important;
          page-break-inside:avoid!important;
        }
        #${PRINT_ID} .pdf-field.full{grid-column:1/-1!important}
        #${PRINT_ID} .pdf-value{display:block!important;margin-top:6px!important;color:#2f211c!important;font-size:9.5px!important;font-weight:520!important;line-height:1.52!important;white-space:pre-wrap!important;overflow-wrap:anywhere!important}
        #${PRINT_ID} .pdf-message{
          padding:12px 13px!important;
          border:.6px solid #d7cbc3!important;
          background:#fbf9f7!important;
          color:#2f211c!important;
          font-size:9.5px!important;
          line-height:1.55!important;
          white-space:pre-wrap!important;
          -webkit-print-color-adjust:exact!important;
          print-color-adjust:exact!important;
          page-break-inside:avoid!important;
        }
        #${PRINT_ID} .pdf-foot{
          margin-top:25px!important;
          padding-top:8px!important;
          border-top:.6px solid #d7cbc3!important;
          color:#9b8b82!important;
          font-size:7.2px!important;
        }
        #${PRINT_ID} .pdf-section,
        #${PRINT_ID} .pdf-grid,
        #${PRINT_ID} .pdf-summary{break-inside:auto!important}
      }
    `;
    document.head.appendChild(style);
  };

  const removePrintRoot = () => document.getElementById(PRINT_ID)?.remove();

  const text = (root, selector, fallback = '—') => root.querySelector(selector)?.textContent?.trim() || fallback;

  const collectSections = (detail) => {
    const sections = [];
    detail.querySelectorAll('.detail-section').forEach((section) => {
      const title = text(section, '.detail-section-title', 'Details');
      const isCustomerMessage = title.toLowerCase() === 'customer message';
      if (isCustomerMessage) return;

      const fields = [];
      section.querySelectorAll('.detail-field').forEach((field) => {
        fields.push({
          label: text(field, 'span', 'Field'),
          value: text(field, 'strong', '—'),
          full: field.classList.contains('full')
        });
      });
      if (fields.length) sections.push({ title, fields });
    });
    return sections;
  };

  const buildPrintRoot = () => {
    const detail = document.querySelector('[data-admin-detail]');
    if (!detail || !detail.querySelector('.detail-head')) return null;

    removePrintRoot();

    const source = text(detail, '.detail-source', 'Request');
    const company = text(detail, '.detail-title-group h2', 'JN COS TECH Request');
    const meta = text(detail, '.detail-title-group p', '—');
    const status = detail.querySelector('[data-detail-status]')?.value || 'New';
    const email = detail.querySelector('.detail-contact-actions a[href^="mailto:"]')?.textContent?.replace(/^Email\s*/i, '').trim() || '—';
    const phone = detail.querySelector('.detail-contact-actions a[href^="tel:"]')?.textContent?.replace(/^Call\s*\/\s*WhatsApp\s*/i, '').trim() || '—';
    const message = detail.querySelector('.detail-message')?.textContent?.trim() || '';
    const sections = collectSections(detail);
    const now = new Date().toLocaleString('en-IN', { timeZone:'Asia/Kolkata', dateStyle:'medium', timeStyle:'short' });

    const root = document.createElement('section');
    root.id = PRINT_ID;

    const summary = [
      ['Type', source],
      ['Status', status],
      ['Email', email],
      ['Phone / WhatsApp', phone]
    ];

    root.innerHTML = `
      <div class="pdf-top">
        <div class="pdf-brand"><strong>JN COS TECH</strong><span>Project Request Summary</span></div>
        <div class="pdf-top-meta"><p><span class="pdf-meta-label">Exported</span><br>${esc(now)}</p><p><span class="pdf-meta-label">Document</span><br>${esc(meta.split('·')[0]?.trim() || '—')}</p></div>
      </div>
      <header class="pdf-request-head">
        <span class="pdf-badge">${esc(source)}</span>
        <h1>${esc(company)}</h1>
        <p>${esc(meta)}</p>
      </header>
      <div class="pdf-summary">
        ${summary.map(([label,value]) => `<div class="pdf-summary-item"><span class="pdf-label">${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('')}
      </div>
      ${message ? `<section class="pdf-section"><div class="pdf-section-head"><span class="pdf-section-title">Customer Message</span></div><div class="pdf-message">${esc(message)}</div></section>` : ''}
      ${sections.map(section => `
        <section class="pdf-section">
          <div class="pdf-section-head"><span class="pdf-section-title">${esc(section.title)}</span></div>
          <div class="pdf-grid">
            ${section.fields.map(field => `<div class="pdf-field${field.full ? ' full' : ''}"><span class="pdf-label">${esc(field.label)}</span><span class="pdf-value">${esc(field.value)}</span></div>`).join('')}
          </div>
        </section>`).join('')}
      <footer class="pdf-foot">JN COS TECH Pvt. Ltd. · Generated from Admin Dashboard · ${esc(now)}</footer>`;

    document.body.appendChild(root);
    return { root, company };
  };

  const printCurrentRequest = () => {
    const built = buildPrintRoot();
    if (!built) {
      alert('Select a request before exporting a PDF.');
      return;
    }

    const oldTitle = document.title;
    document.title = `${built.company} · JN COS TECH Request`;

    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      document.title = oldTitle;
      setTimeout(removePrintRoot, 80);
      window.removeEventListener('afterprint', restore);
    };

    window.addEventListener('afterprint', restore);
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
    setTimeout(restore, 8000);
  };

  ensurePrintStyle();

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-export-pdf]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    printCurrentRequest();
  }, true);
})();
