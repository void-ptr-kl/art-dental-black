const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function setup() {
    console.log("Creating Ethereal test account...");
    let testAccount = await nodemailer.createTestAccount();

    const envPath = path.join(__dirname, '.env.local');
    const envContent = `\n# Ethereal Email Credentials for Testing\nSMTP_HOST=smtp.ethereal.email\nSMTP_PORT=587\nSMTP_USER=${testAccount.user}\nSMTP_PASS=${testAccount.pass}\n`;

    fs.appendFileSync(envPath, envContent);
    console.log("Successfully appended Ethereal credentials to .env.local");
    console.log("Credentials:", testAccount.user, testAccount.pass);
}

setup().catch(console.error);
