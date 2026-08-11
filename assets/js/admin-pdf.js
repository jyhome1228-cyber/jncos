(() => {
  const PRINT_ID = 'jncos-admin-print-root';

  const ensurePrintStyle = () => {
    if (document.querySelector('style[data-admin-pdf-print]')) return;
    const style = document.createElement('style');
    style.setAttribute('data-admin-pdf-print', '');
    style.textContent = `
      #${PRINT_ID}{display:none}
      @media print{
        @page{size:A4;margin:15mm}
        body.admin-body > *:not(#${PRINT_ID}){display:none!important}
        #${PRINT_ID}{display:block!important;position:static!important;width:auto!important;margin:0!important;padding:0!important;background:#fff!important;color:#2f1b13!important;font-family:Pretendard,Arial,"Noto Sans KR",sans-serif!important}
        #${PRINT_ID} *{box-sizing:border-box!important}
        #${PRINT_ID} .pdf-head{padding:16px 18px;background:#2f1b13!important;color:#fff!important;margin-bottom:20px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
        #${PRINT_ID} .pdf-head strong{display:block;font-size:22px;line-height:1.1;margin-bottom:5px}
        #${PRINT_ID} .pdf-head span{font-size:9px;letter-spacing:.12em;color:#d8c7be!important}
        #${PRINT_ID} .detail-actions,#${PRINT_ID} .detail-status,#${PRINT_ID} .detail-contact-actions{display:none!important}
        #${PRINT_ID} .detail-head{display:block!important;padding:0 0 16px!important;border-bottom:1px solid #d9c8bb!important}
        #${PRINT_ID} .detail-title-group h2{margin:6px 0!important;font-size:23px!important;line-height:1.15!important;color:#2f1b13!important}
        #${PRINT_ID} .detail-title-group p{margin:0!important;color:#7f7068!important;font-size:9px!important}
        #${PRINT_ID} .source-pill{display:inline-block!important;padding:4px 7px!important;border:1px solid #d9c8bb!important;font-size:8px!important;font-weight:700!important;text-transform:uppercase!important}
        #${PRINT_ID} .detail-section{padding-top:18px!important;break-inside:avoid-page}
        #${PRINT_ID} .detail-section-title{margin:0 0 9px!important;color:#8f6a53!important;font-size:9px!important;letter-spacing:.14em!important;text-transform:uppercase!important}
        #${PRINT_ID} .detail-grid{display:grid!important;grid-template-columns:1fr 1fr!important;border-top:1px solid #d9c8bb!important}
        #${PRINT_ID} .detail-field{padding:10px 12px 11px 0!important;border-bottom:1px solid #d9c8bb!important;page-break-inside:avoid!important;min-width:0!important}
        #${PRINT_ID} .detail-field:nth-child(even){padding-left:12px!important;border-left:1px solid #d9c8bb!important}
        #${PRINT_ID} .detail-field.full{grid-column:1/-1!important;padding-left:0!important;border-left:0!important}
        #${PRINT_ID} .detail-field span{display:block!important;margin-bottom:4px!important;color:#95877f!important;font-size:7.5px!important;font-weight:700!important;letter-spacing:.07em!important;text-transform:uppercase!important}
        #${PRINT_ID} .detail-field strong{display:block!important;font-size:10px!important;font-weight:500!important;line-height:1.55!important;white-space:pre-wrap!important;overflow-wrap:anywhere!important;color:#2f1b13!important}
        #${PRINT_ID} .detail-message{padding:12px!important;border:1px solid #d9c8bb!important;background:#f8f4f1!important;font-size:10px!important;line-height:1.6!important;white-space:pre-wrap!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
        #${PRINT_ID} .pdf-foot{margin-top:20px;padding-top:9px;border-top:1px solid #d9c8bb;color:#8b7d75;font-size:8px}
      }
    `;
    document.head.appendChild(style);
  };

  const removePrintRoot = () => document.getElementById(PRINT_ID)?.remove();

  const buildPrintRoot = () => {
    const detail = document.querySelector('[data-admin-detail]');
    if (!detail || !detail.querySelector('.detail-head')) return null;

    removePrintRoot();

    const root = document.createElement('section');
    root.id = PRINT_ID;

    const head = document.createElement('div');
    head.className = 'pdf-head';
    head.innerHTML = '<strong>JN COS TECH</strong><span>PROJECT REQUEST SUMMARY</span>';
    root.appendChild(head);

    const clone = detail.cloneNode(true);
    clone.querySelectorAll('button,select,.detail-actions,.detail-status,.detail-contact-actions').forEach(el => el.remove());
    clone.querySelectorAll('[hidden]').forEach(el => el.removeAttribute('hidden'));
    root.appendChild(clone);

    const foot = document.createElement('div');
    foot.className = 'pdf-foot';
    foot.textContent = `Generated from JN COS TECH Admin Dashboard · ${new Date().toLocaleString('en-IN', { timeZone:'Asia/Kolkata' })}`;
    root.appendChild(foot);

    document.body.appendChild(root);
    return root;
  };

  const printCurrentRequest = () => {
    const root = buildPrintRoot();
    if (!root) {
      alert('Select a request before exporting a PDF.');
      return;
    }

    const oldTitle = document.title;
    const company = root.querySelector('.detail-title-group h2')?.textContent?.trim() || 'JN COS TECH Request';
    document.title = `${company} · JN COS TECH Request`;

    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      document.title = oldTitle;
      setTimeout(removePrintRoot, 40);
      window.removeEventListener('afterprint', restore);
    };

    window.addEventListener('afterprint', restore);
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
    setTimeout(restore, 5000);
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
