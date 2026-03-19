const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// The same key from .env.local
const ENCRYPTION_KEY = '3e8a4b6c9b3a72d1f85e4c2b9da1374b6a9c8f2e7d3b5a1c9e4b6d8f2a3c7e9f';
const ALGORITHM = 'aes-256-ctr';

function decryptFile() {
    const encPath = path.join(__dirname, 'uploads', '1772557372868_7e303d89aa6e7be5_test_scan.stl.enc');
    const buffer = fs.readFileSync(encPath);

    // Extract IV (first 16 bytes)
    const iv = buffer.subarray(0, 16);
    const encryptedData = buffer.subarray(16);

    const keyBuffer = Buffer.from(ENCRYPTION_KEY.length === 64 ? ENCRYPTION_KEY : Buffer.from(ENCRYPTION_KEY).toString('hex').slice(0, 64), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);

    const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

    console.log("Decrypted contents:");
    console.log(decryptedData.toString());
}

decryptFile();
