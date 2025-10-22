// Main application script
document.addEventListener('DOMContentLoaded', function() {
// Tab functionality
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
tab.addEventListener('click', () => {
const tabId = tab.getAttribute('data-tab');

// Remove active class from all tabs and contents
tabs.forEach(t => t.classList.remove('active'));
tabContents.forEach(c => c.classList.remove('active'));

// Add active class to current tab and content
tab.classList.add('active');
document.getElementById(`${tabId}-tab`).classList.add('active');
});
});

// Initialize with a sample QR code
QRCode.toCanvas(document.getElementById('qrcode'), 'https://example.com', {
width: 200,
height: 200,
color: {
dark: '#000000',
light: '#ffffff'
},
margin: 1
}, function(error) {
if (!error) {
document.querySelector('.qr-info').textContent = 'Scan this sample QR code';
document.getElementById('download-qr-btn').disabled = false;
}
});

// Initialize with a sample barcode
JsBarcode("#barcode", "123456789012", {
format: "CODE128",
width: 2,
height: 50,
displayValue: true
});

// Close modals when clicking outside
document.addEventListener('click', (e) => {
if (e.target.classList.contains('modal')) {
e.target.classList.remove('active');
}
});

// Plan selection buttons
document.getElementById('free-plan-btn').addEventListener('click', () => {
authManager.showAuthModal('signup');
});

document.getElementById('pro-plan-btn').addEventListener('click', () => {
authManager.showUpgradeModal();
});

document.getElementById('team-plan-btn').addEventListener('click', () => {
alert('Please contact sales@codegenpro.com for team pricing');
});

document.getElementById('get-started-btn').addEventListener('click', () => {
authManager.showAuthModal('signup');
});

document.getElementById('upgrade-hero-btn').addEventListener('click', () => {
authManager.showUpgradeModal();
});

// Upgrade modal plan buttons
document.getElementById('monthly-plan-btn').addEventListener('click', () => {
alert('Monthly subscription selected. Payment integration would go here.');
});

document.getElementById('yearly-plan-btn').addEventListener('click', () => {
alert('Yearly subscription selected. Payment integration would go here.');
});
});
