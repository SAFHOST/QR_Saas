class QRGenerator {
   constructor() {
       this.currentQRCode = null;
       this.setupEventListeners();
   }

   setupEventListeners() {
       // QR type change
       document.getElementById('qr-type').addEventListener('change', (e) => {
           this.updateQRInputLabel(e.target.value);
       });

       // Generate QR code
       document.getElementById('generate-qr-btn').addEventListener('click', () => {
           this.generateQRCode();
       });

       // Download QR code
       document.getElementById('download-qr-btn').addEventListener('click', () => {
           this.downloadQRCode();
       });

       // Save QR code
       document.getElementById('save-qr-btn').addEventListener('click', () => {
           this.saveQRCode();
       });
   }

   updateQRInputLabel(type) {
       const label = document.getElementById('content-label');
       const input = document.getElementById('qr-content');

       switch(type) {
           case 'url':
               label.textContent = 'Website URL';
               input.placeholder = 'https://example.com';
               break;
           case 'text':
               label.textContent = 'Text Content';
               input.placeholder = 'Enter your text here';
               break;
           case 'email':
               label.textContent = 'Email Address';
               input.placeholder = 'example@email.com';
               break;
           case 'phone':
               label.textContent = 'Phone Number';
               input.placeholder = '+1 (123) 456-7890';
               break;
           case 'wifi':
               label.textContent = 'WiFi Details';
               input.placeholder = 'WIFI:S:NetworkName;T:WPA;P:Password;;';
               break;
           case 'vcard':
               label.textContent = 'Contact Information';
               input.placeholder = 'BEGIN:VCARD...';
               break;
       }
   }

   generateQRCode() {
       const content = document.getElementById('qr-content').value.trim();
       const size = parseInt(document.getElementById('qr-size').value);

       if (!content) {
           alert('Please enter content for the QR code');
           return;
       }

       // Clear previous QR code
       const container = document.getElementById('qrcode');
       container.innerHTML = '';

       // Generate new QR code
       QRCode.toCanvas(container, content, {
           width: size,
           height: size,
           color: {
               dark: '#000000',
               light: '#ffffff'
           },
           margin: 1
       }, (error) => {
           if (error) {
               console.error(error);
               document.querySelector('.qr-info').textContent = 'Error generating QR code';
           } else {
               document.querySelector('.qr-info').textContent = 'Scan this QR code with your device';
               document.getElementById('download-qr-btn').disabled = false;
               this.currentQRCode = content;
           }
       });
   }

   downloadQRCode() {
       const canvas = document.getElementById('qrcode').querySelector('canvas');
       if (!canvas) {
           alert('Please generate a QR code first');
           return;
       }

       const link = document.createElement('a');
       link.download = 'qrcode.png';
       link.href = canvas.toDataURL('image/png');
       link.click();
   }

   async saveQRCode() {
       const canvas = document.getElementById('qrcode').querySelector('canvas');
       if (!canvas) {
           alert('Please generate a QR code first');
           return;
       }

       const name = prompt('Enter a name for this QR code:', 'My QR Code');
       if (!name) return;

       const creationData = {
           type: 'qr',
           name: name,
           content: this.currentQRCode,
           previewUrl: canvas.toDataURL('image/png'),
           settings: {
               size: document.getElementById('qr-size').value,
               contentType: document.getElementById('qr-type').value
           }
       };

       await authManager.saveCreation(creationData);
   }
}

// Initialize QR generator
const qrGenerator = new QRGenerator();
