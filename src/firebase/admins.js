import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  setDoc,
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

export const PRIMARY_ADMIN_EMAIL = 'sheutomalli@gmail.com';
const ADMINS_COLLECTION = 'admins';

/**
 * Normalizes email strings to lowercase trimmed format
 */
export function normalizeEmail(email) {
  if (!email) return '';
  return email.trim().toLowerCase();
}

/**
 * Fetch all authorized administrator email documents from Firestore.
 * Auto-initializes primary administrator email if collection is fresh.
 */
export async function getAuthorizedAdmins() {
  if (!db) {
    return [{ id: PRIMARY_ADMIN_EMAIL, email: PRIMARY_ADMIN_EMAIL, status: 'active', addedBy: 'System', createdAt: new Date() }];
  }

  try {
    const adminsRef = collection(db, ADMINS_COLLECTION);
    const snapshot = await getDocs(adminsRef);
    const adminList = [];

    snapshot.forEach((docSnap) => {
      adminList.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Auto-seed primary admin if collection is completely empty
    if (adminList.length === 0) {
      const primaryDoc = {
        email: PRIMARY_ADMIN_EMAIL,
        status: 'active',
        addedBy: 'System Primary Admin',
        createdAt: new Date().toISOString()
      };
      try {
        const docRef = doc(db, ADMINS_COLLECTION, PRIMARY_ADMIN_EMAIL);
        await setDoc(docRef, primaryDoc);
        adminList.push({ id: PRIMARY_ADMIN_EMAIL, ...primaryDoc });
      } catch (e) {
        adminList.push({ id: 'primary-default', ...primaryDoc });
      }
    }

    return adminList;
  } catch (error) {
    // If user is unauthenticated or rules restrict access, fall back cleanly
    return [{ id: 'primary-default', email: PRIMARY_ADMIN_EMAIL, status: 'active', addedBy: 'System Default', createdAt: new Date() }];
  }
}

/**
 * Add a new administrator email to the Firestore allowlist
 */
export async function addAdminEmail(email, addedBy = 'System Admin') {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Please enter a valid administrator email address.');
  }

  // Check if email already exists in allowlist
  const existingAdmins = await getAuthorizedAdmins();
  const exists = existingAdmins.some((a) => normalizeEmail(a.email) === cleanEmail);
  if (exists) {
    throw new Error(`Administrator email "${cleanEmail}" is already authorized.`);
  }

  const payload = {
    email: cleanEmail,
    status: 'active',
    addedBy: addedBy || 'System Admin',
    createdAt: serverTimestamp()
  };

  const docRef = doc(db, ADMINS_COLLECTION, cleanEmail);
  await setDoc(docRef, payload);
  return { id: cleanEmail, ...payload };
}

/**
 * Revoke administrator access for a specified email ID.
 * Enforces minimum 1 active administrator rule.
 */
export async function removeAdminEmail(id, emailToRemove) {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  const currentAdmins = await getAuthorizedAdmins();
  if (currentAdmins.length <= 1) {
    throw new Error('You must have at least one active administrator.');
  }

  const docRef = doc(db, ADMINS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Verify whether a Firebase User is authorized as an Administrator.
 * Checks Custom Claims first, then Firestore allowlist & primary email fallback.
 */
export async function checkIsAdminStatus(user) {
  if (!user) return false;

  // Local demo session bypass check
  if (user.isLocalDemo) {
    return true;
  }

  const userEmail = normalizeEmail(user.email);

  // 1. Check Firebase Auth Token Custom Claims
  try {
    if (typeof user.getIdTokenResult === 'function') {
      const tokenResult = await user.getIdTokenResult();
      if (tokenResult?.claims?.admin === true || tokenResult?.claims?.isAdmin === true) {
        return true;
      }
    }
  } catch (err) {
    console.warn('Custom claim evaluation notice:', err.message);
  }

  // 2. Fallback check primary admin email
  if (userEmail === normalizeEmail(PRIMARY_ADMIN_EMAIL)) {
    return true;
  }

  // 3. Check Firestore allowlist collection
  try {
    const allowlist = await getAuthorizedAdmins();
    const isAuthorized = allowlist.some((a) => normalizeEmail(a.email) === userEmail);
    return isAuthorized;
  } catch (err) {
    console.warn('Allowlist validation check failed:', err.message);
    return false;
  }
}
