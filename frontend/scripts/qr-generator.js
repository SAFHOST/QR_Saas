// scripts/qr-generator.js
// If you have a config.js, keep this import and make sure the HTML uses type="module".
// Otherwise, comment it out or define API_BASE inline.
// import { API_BASE } from "./config.js";

async function testConnection() {
  try {
    if (typeof API_BASE !== "undefined") {
      const res = await fetch(`${API_BASE}/health`);
      const data = await res.json();
      console.log("Backend connection:", data);
    }
  } catch (err) {
    console.error("Connection failed:", err);
  }
}
testConnection();

class QRGenerator {
  constructor() {
    this.currentQRCode = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('qr-type').addEventListener('change', (e) => {
      this.updateQRInputLabel(e.target.value);
    });

    document.getElementById('generate-qr-btn').addEventListener('click', () => {
      this.generateQRCode();
    });

    document.getElementById('download-qr-btn').addEventListener('click', () => {
      this.downloadQRCode();
    });

    const saveBtn = document.getElementById('save-qr-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveQRCode());
    }
  }

  updateQRInputLabel(type) {
    const label = document.getElementById('content-label');
    const input = document.getElementById('qr-content');
    switch (type) {
      case 'url':   label.textContent = 'Website URL'; input.placeholder = 'https://example.com'; break;
      case 'text':  label.textContent = 'Text Content'; input.placeholder = 'Enter your text here'; break;
      case 'email': label.textContent = 'Email Address'; input.placeholder = 'example@email.com'; break;
      case 'phone': label.textContent = 'Phone Number'; input.placeholder = '+1 (123) 456-7890'; break;
      case 'wifi':  label.textContent = 'WiFi Details'; input.placeholder = 'WIFI:S:NetworkName;T:WPA;P:Password;;'; break;
      case 'vcard': label.textContent = 'Contact Information'; input.placeholder = 'BEGIN:VCARD...'; break;
    }
  }

  generateQRCode() {
    const content = document.getElementById('qr-content').value.trim();
    const size = parseInt(document.getElementById('qr-size').value, 10) || 300;
    if (!content) {
      alert('Please enter content for the QR code');
      return;
    }

    const container = document.getElementById('qrcode');
    container.innerHTML = '';

    // ✅ Render into a real <canvas>
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    QRCode.toCanvas(canvas, content, {
      width: size,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' }
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
    if (!canvas) { alert('Please generate a QR code first'); return; }

    if (typeof authManager === 'undefined') {
      alert('Saving requires authManager. Please wire your auth module.');
      return;
    }

    const name = prompt('Enter a name for this QR code:', 'My QR Code');
    if (!name) return;

    const creationData = {
      type: 'qr',
      name,
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

// Initialize
new QRGenerator();
