const fs = require('fs');
const path = require('path');

async function testUpload() {
    const filePath = path.join(__dirname, 'test_scan.stl');
    const fileStats = fs.statSync(filePath);

    const formData = new FormData();
    formData.append('name', 'Test Praxis');
    formData.append('email', 'test@praxis.com');
    formData.append('message', 'Dieser Scan kommt aus dem Terminal');

    const fileBlob = new Blob([fs.readFileSync(filePath)], { type: 'application/octet-stream' });
    formData.append('file', fileBlob, 'test_scan.stl');

    try {
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);
    } catch (err) {
        console.error('Error fetching:', err);
    }
}

testUpload();
