(() => {
  const PRINT_ROOT_ID = 'jncos-admin-print-root';

  const ensurePrintStyles = () => {
    if (document.querySelector('style[data-admin-print-fix]')) return;
    const style = document.createElement('style');
    style.setAttribute('data-admin-print-fix', '');
    style.textContent = `
      #${PRINT_ROOT_ID}{display:none}
      @media print{
        @page{size:A4;margin:14mm}
        body.admin-body > *:not(#${PRINT_ROOT_ID}){display:none!important}
        #${PRINT_ROOT_ID}{display:block!important;position:static!important;width:auto!important;margin:0!important;padding:0!important;background:#fff!important;color:#2f1b13!important;font-family:Pretendard,Arial,sans-serif!important}
        #${PRINT_ROOT_ID} *{box-sizing:border-box!important}
        #${PRINT_ROOT_ID} .print-header{padding:0 0 16px;border-bottom:2px solid #2f1b13;margin-bottom:20px}
        #${PRINT_ROOT_ID} .print-header small{display:block;margin-bottom:6px;font-size:9px;letter-spacing:.14em;color:#8f6a53;font-weight:800}
        #${PRINT_ROOT_ID} .print-header h1{margin:0 0 7px;font-size:24px;line-height:1.1;color:#2f1b13}
        #${PRINT_ROOT_ID} .print-header p{margin:0;font-size:10px;color:#756860}
        #${PRINT_ROOT_ID} .detail-actions,#${PRINT_ROOT_ID} .detail-status,#${PRINT_ROOT_ID} .detail-contact-actions{display:none!important}
        #${PRINT_ROOT_ID} .detail-head{display:block!important;padding:0 0 14px!important;border-bottom:1px solid #d9c8bb!important}
        #${PRINT_ROOT_ID} .detail-head h2{font-size:20px!important;margin:0 0 5px!important}
        #${PRINT_ROOT_ID} .detail-source{display:inline-flex!important;margin-bottom:8px!important;border:1px solid #d9c8bb!important;padding:3px 7px!important;font-size:8px!important}
        #${PRINT_ROOT_ID} .detail-section{padding-top:18px!important;break-inside:avoid-page}
        #${PRINT_ROOT_ID} .detail-section-title{margin:0 0 8px!important;font-size:9px!important;letter-spacing:.12em!important;color:#8f6a53!important;text-transform:uppercase!important}
        #${PRINT_ROOT_ID} .detail-grid{display:grid!important;grid-template-columns:1fr 1fr!important;border-top:1px solid #d9c8bb!important}
        #${PRINT_ROOT_ID} .detail-field{padding:10px 12px 10px 0!important;border-bottom:1px solid #d9c8bb!important;min-width:0!important;break-inside:avoid!important}
        #${PRINT_ROOT_ID} .detail-field:nth-child(even){padding-left:12px!important;border-left:1px solid #d9c8bb!important}
        #${PRINT_ROOT_ID} .detail-field.full{grid-column:1/-1!important;padding-left:0!important;border-left:0!important}
        #${PRINT_ROOT_ID} .detail-field span{display:block!important;margin-bottom:4px!important;font-size:7.5px!important;letter-spacing:.08em!important;color:#95877f!important;text-transform:uppercase!important}
        #${PRINT_ROOT_ID} .detail-field strong{display:block!important;font-size:9.5px!important;line-height:1.5!important;font-weight:600!important;white-space:pre-wrap!important;overflow-wrap:anywhere!important}
        #${PRINT_ROOT_ID} .detail-message{padding:12px!important;border:1px solid #d9c8bb!important;background:#f8f4f1!important;font-size:9.5px!important;line-height:1.6!important;white-space:pre-wrap!important}
        #${PRINT_ROOT_ID} .print-footer{margin-top:18px;padding-top:8px;border-top:1px solid #d9c8bb;font-size:7.5px;color:#8b7d75}
      }
    `;
    document.head.appendChild(style);
  };

  const cleanup = () => document.getElementById(PRINT_ROOT_ID)?.remove();

  const buildPrintRoot = () => {
    const detail = document.querySelector('[data-admin-detail]');
    if (!detail || !detail.textContent.trim()) return null;

    cleanup();
    const root = document.createElement('section');
    root.id = PRINT_ROOT_ID;

    const title = detail.querySelector('.detail-head h2')?.textContent?.trim() || 'Customer Request';
    const meta = detail.querySelector('.detail-head p')?.textContent?.trim() || '';
    const source = detail.querySelector('.detail-source')?.textContent?.trim() || 'Request';

    const header = document.createElement('div');
    header.className = 'print-header';
    header.innerHTML = `<small>JN COS TECH · ${source.toUpperCase()}</small><h1>${title}</h1><p>${meta}</p>`;
    root.appendChild(header);

    const clone = detail.cloneNode(true);
    clone.querySelectorAll('[data-export-pdf],[data-delete-request],.detail-actions,.detail-status,.detail-contact-actions').forEach(el => el.remove());
    root.appendChild(clone);

    const footer = document.createElement('div');
    footer.className = 'print-footer';
    footer.textContent = `JN COS TECH Pvt. Ltd. · Generated ${new Date().toLocaleString('en-IN', { timeZone:'Asia/Kolkata' })}`;
    root.appendChild(footer);

    document.body.appendChild(root);
    return root;
  };

  ensurePrintStyles();

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-export-pdf]');
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const root = buildPrintRoot();
    if (!root) {
      alert('Please select a request before exporting.');
      return;
    }

    const oldTitle = document.title;
    const detailTitle = root.querySelector('.print-header h1')?.textContent?.trim() || 'JN COS TECH Request';
    document.title = `${detailTitle} - JN COS TECH`;

    const restore = () => {
      document.title = oldTitle;
      setTimeout(cleanup, 50);
      window.removeEventListener('afterprint', restore);
    };

    window.addEventListener('afterprint', restore);
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
    setTimeout(() => {
      if (document.getElementById(PRINT_ROOT_ID)) restore();
    }, 3000);
  }, true);
})();
