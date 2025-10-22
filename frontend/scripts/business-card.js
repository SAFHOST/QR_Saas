class BusinessCardGenerator {
constructor() {
this.setupEventListeners();
this.updateCardPreview(); // Initialize with default values
}

setupEventListeners() {
// Update card preview in real-time
const inputs = document.querySelectorAll('#business-card-tab input');
inputs.forEach(input => {
input.addEventListener('input', () => {
this.updateCardPreview();
});
});

// Generate card
document.getElementById('generate-card-btn').addEventListener('click', () => {
this.updateCardPreview();
});

// Download card
document.getElementById('download-card-btn').addEventListener('click', () => {
this.downloadCard();
});

// Save card
document.getElementById('save-card-btn').addEventListener('click', () => {
this.saveCard();
});

// Download vCard
document.getElementById('download-vcard-btn').addEventListener('click', () => {
this.downloadVCard();
});
}

updateCardPreview() {
document.getElementById('preview-name').textContent =
document.getElementById('card-name').value || 'John Doe';
document.getElementById('preview-title').textContent =
document.getElementById('card-title').value || 'Marketing Manager';
document.getElementById('preview-company').textContent =
document.getElementById('card-company').value || 'Your Company';
document.getElementById('preview-email').textContent = '✉️ ' +
(document.getElementById('card-email').value || 'john@example.com');
document.getElementById('preview-phone').textContent = '📞 ' +
(document.getElementById('card-phone').value || '+1 (123) 456-7890');
document.getElementById('preview-website').textContent = '🌐 ' +
(document.getElementById('card-website').value || 'https://example.com');
}

downloadCard() {
const cardElement = document.getElementById('business-card');

html2canvas(cardElement).then(canvas => {
const link = document.createElement('a');
link.download = 'business-card.png';
link.href = canvas.toDataURL('image/png');
link.click();
});
}

async saveCard() {
const name = prompt('Enter a name for this business card:', 'My Business Card');
if (!name) return;

const cardData = {
name: document.getElementById('card-name').value || 'John Doe',
title: document.getElementById('card-title').value || 'Marketing Manager',
company: document.getElementById('card-company').value || 'Your Company',
email: document.getElementById('card-email').value || 'john@example.com',
phone: document.getElementById('card-phone').value || '+1 (123) 456-7890',
website: document.getElementById('card-website').value || 'https://example.com'
};

// Create preview
const cardElement = document.getElementById('business-card');
const canvas = await html2canvas(cardElement);
const previewUrl = canvas.toDataURL('image/png');

const creationData = {
type: 'business-card',
name: name,
content: cardData,
previewUrl: previewUrl,
htmlContent: cardElement.innerHTML,
settings: cardData
};

await authManager.saveCreation(creationData);
}

downloadVCard() {
if (!authManager.currentUser) {
alert('Please log in to download vCard');
authManager.showAuthModal('signup');
return;
}

const cardData = {
name: document.getElementById('card-name').value || 'John Doe',
title: document.getElementById('card-title').value || 'Marketing Manager',
company: document.getElementById('card-company').value || 'Your Company',
email: document.getElementById('card-email').value || 'john@example.com',
phone: document.getElementById('card-phone').value || '+1 (123) 456-7890',
website: document.getElementById('card-website').value || 'https://example.com'
};

const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${cardData.name}
ORG:${cardData.company}
TITLE:${cardData.title}
TEL:${cardData.phone}
EMAIL:${cardData.email}
URL:${cardData.website}
END:VCARD`;

const blob = new Blob([vCardData], { type: 'text/vcard' });
const link = document.createElement('a');
link.download = 'contact.vcf';
link.href = URL.createObjectURL(blob);
link.click();
}
}

// Initialize business card generator
const businessCardGenerator = new BusinessCardGenerator();
