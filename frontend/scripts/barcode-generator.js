class BarcodeGenerator {
    constructor() {
        this.currentBarcode = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Update slider values
        document.getElementById('barcode-width').addEventListener('input', (e) => {
            document.getElementById('width-value').textContent = e.target.value;
        });

        document.getElementById('barcode-height').addEventListener('input', (e) => {
            document.getElementById('height-value').textContent = e.target.value;
        });

        // Generate barcode
        document.getElementById('generate-barcode-btn').addEventListener('click', () => {
            this.generateBarcode();
        });

        // Download barcode
        document.getElementById('download-barcode-btn').addEventListener('click', () => {
            this.downloadBarcode();
        });

        // Save barcode
        document.getElementById('save-barcode-btn').addEventListener('click', () => {
            this.saveBarcode();
        });
    }

    generateBarcode() {
        const content = document.getElementById('barcode-content').value.trim();
        const type = document.getElementById('barcode-type').value;
        const width = parseFloat(document.getElementById('barcode-width').value);
        const height = parseInt(document.getElementById('barcode-height').value);
        const showText = document.getElementById('barcode-text').value === 'true';

        if (!content) {
            alert('Please enter content for the barcode');
            return;
        }

        try {
            JsBarcode("#barcode", content, {
                format: type,
                width: width,
                height: height,
                displayValue: showText,
                background: "transparent",
                lineColor: "#000000"
            });

            document.querySelector('.barcode-info').textContent = 'Your barcode is ready';
            document.getElementById('download-barcode-btn').disabled = false;
            this.currentBarcode = content;
        } catch (error) {
            console.error(error);
            document.querySelector('.barcode-info').textContent = 'Error generating barcode. Please check your data.';
        }
    }

    downloadBarcode() {
        const svg = document.getElementById('barcode');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const link = document.createElement('a');
            link.download = 'barcode.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }

    async saveBarcode() {
        const svg = document.getElementById('barcode');
        if (!svg.innerHTML.includes('rect')) {
            alert('Please generate a barcode first');
            return;
        }

        const name = prompt('Enter a name for this barcode:', 'My Barcode');
        if (!name) return;

        const creationData = {
            type: 'barcode',
            name: name,
            content: this.currentBarcode,
            svgContent: svg.innerHTML,
            settings: {
                type: document.getElementById('barcode-type').value,
                width: document.getElementById('barcode-width').value,
                height: document.getElementById('barcode-height').value,
                showText: document.getElementById('barcode-text').value === 'true'
            }
        };

        await authManager.saveCreation(creationData);
    }
}

// Initialize barcode generator
const barcodeGenerator = new BarcodeGenerator();
