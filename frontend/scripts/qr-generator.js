document.addEventListener('DOMContentLoaded', () => {
  const qrContainer = document.getElementById('qr');
  const barcodeSvg = document.getElementById('barcode');
  const input = document.getElementById('inputData');

  document.getElementById('generateQR').addEventListener('click', () => {
    qrContainer.innerHTML = '';
    const canvas = document.createElement('canvas');
    qrContainer.appendChild(canvas);
    const data = input.value.trim();
    if (!data) return alert('Please enter text or URL');
    QRCode.toCanvas(canvas, data, { errorCorrectionLevel: 'M' }, (err) => {
      if (err) console.error(err);
      else console.log('QR generated successfully');
    });
  });

  document.getElementById('generateBarcode').addEventListener('click', () => {
    const data = input.value.trim();
    if (!data) return alert('Please enter text or number');
    JsBarcode(barcodeSvg, data, {
      format: 'CODE128',
      lineColor: '#000',
      width: 2,
      height: 80,
      displayValue: true
    });
  });
});
