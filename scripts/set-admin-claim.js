/**
 * Firebase Admin Custom Claim Assignment Script
 * 
 * Instructions to run:
 * 1. Download your Firebase Admin SDK service account JSON key from Firebase Console -> Project Settings -> Service Accounts.
 * 2. Save it as `service-account.json` in the root folder.
 * 3. Run: node scripts/set-admin-claim.js <target-user-uid-or-email>
 * 
 * Example:
 * node scripts/set-admin-claim.js sheutomalli@gmail.com
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '../service-account.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('\x1b[31mError: service-account.json file not found in project root.\x1b[0m');
  console.log('Please download your Service Account JSON key from Firebase Console and save it at root as `service-account.json`.');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const targetIdentifier = process.argv[2];

if (!targetIdentifier) {
  console.error('\x1b[31mError: Please provide a user email address or UID.\x1b[0m');
  console.log('Usage: node scripts/set-admin-claim.js <email-or-uid>');
  process.exit(1);
}

async function setAdminCustomClaim(identifier) {
  try {
    let user;
    if (identifier.includes('@')) {
      user = await admin.auth().getUserByEmail(identifier);
    } else {
      user = await admin.auth().getUser(identifier);
    }

    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`\x1b[32mSuccess! Set custom claim { admin: true } for user: ${user.email} (UID: ${user.uid})\x1b[0m`);
    console.log('The user must sign out and sign in again for the token claim to refresh.');
  } catch (error) {
    console.error('\x1b[31mFailed to set admin custom claim:\x1b[0m', error.message);
  } finally {
    process.exit(0);
  }
}

setAdminCustomClaim(targetIdentifier);
