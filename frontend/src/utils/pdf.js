export const openPdfBlob = (blob, fileName = 'document.pdf') => {
  if (typeof window === 'undefined') {
    return;
  }

  const pdfBlob = blob instanceof Blob ? blob : new Blob([blob], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(pdfBlob);
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

  if (!newWindow) {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.click();
  }

  window.setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 60000);
};
