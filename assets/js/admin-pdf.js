(() => {
  const buildPrintable = (detail) => {
    const clone = detail.cloneNode(true);
    clone.querySelectorAll('button, select, .detail-contact-actions').forEach((el) => el.remove());
    clone.querySelectorAll('[hidden]').forEach((el) => el.removeAttribute('hidden'));
    return clone.innerHTML;
  };

  const openPrintPdf = () => {
    const detail = document.querySelector('[data-admin-detail]');
    if (!detail || !detail.querySelector('.detail-head')) {
      alert('Select a request before exporting a PDF.');
      return;
    }

    const popup = window.open('', '_blank', 'noopener,noreferrer,width=980,height=900');
    if (!popup) {
      alert('The PDF window was blocked by your browser. Please allow pop-ups for this site and try again.');
      return;
    }

    const company = detail.querySelector('.detail-head h2')?.textContent?.trim() || 'JN COS TECH Request';
    const body = buildPrintable(detail);
    popup.document.open();
    popup.document.write(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${company.replace(/[<>]/g,'')} · JN COS TECH Request</title>
<style>
@page{size:A4;margin:16mm}
*{box-sizing:border-box}
body{margin:0;font-family:Arial,"Noto Sans KR",sans-serif;color:#2f1b13;background:#fff;font-size:11px;line-height:1.55}
.pdf-head{padding:18px 20px;background:#2f1b13;color:#fff;margin-bottom:22px}
.pdf-head strong{display:block;font-size:22px;line-height:1.1;margin-bottom:6px}.pdf-head span{font-size:9px;letter-spacing:.12em;color:#d8c7be}
.admin-detail-pane{padding:0!important;overflow:visible!important}.detail-head{display:block!important;padding:0 0 18px;border-bottom:1px solid #d9c8bb}.detail-title-group h2{margin:6px 0 6px;font-size:24px;line-height:1.15}.detail-title-group p{margin:0;color:#7f7068}.source-pill{display:inline-block;padding:4px 7px;border:1px solid #d9c8bb;font-size:8px;font-weight:700;text-transform:uppercase}.detail-status{display:none!important}.detail-section{padding-top:18px}.detail-section-title{margin:0 0 10px;color:#8f6a53;font-size:9px;letter-spacing:.14em;text-transform:uppercase}.detail-grid{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #d9c8bb}.detail-field{padding:10px 12px 11px 0;border-bottom:1px solid #d9c8bb;page-break-inside:avoid}.detail-field:nth-child(even){padding-left:12px;border-left:1px solid #d9c8bb}.detail-field.full{grid-column:1/-1;padding-left:0!important;border-left:0!important}.detail-field span{display:block;margin-bottom:4px;color:#95877f;font-size:7.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase}.detail-field strong{display:block;font-size:10.5px;font-weight:500;white-space:pre-wrap;overflow-wrap:anywhere}.detail-message{padding:12px;border:1px solid #d9c8bb;background:#f8f4f1;white-space:pre-wrap}.pdf-foot{margin-top:20px;padding-top:10px;border-top:1px solid #d9c8bb;color:#8b7d75;font-size:8px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>
</head>
<body>
<div class="pdf-head"><strong>JN COS TECH</strong><span>PROJECT REQUEST SUMMARY</span></div>
<main class="admin-detail-pane">${body}</main>
<div class="pdf-foot">Generated from JN COS TECH Admin Dashboard · ${new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}</div>
<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),180));<\/script>
</body></html>`);
    popup.document.close();
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-export-pdf]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openPrintPdf();
  }, true);
})();
