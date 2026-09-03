import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from './config';
import { optimizeImage, deleteStorageFileByUrl } from './projects';

const TEAM_COLLECTION = 'teamMembers';

/**
 * Upload a single team member photo to Firebase Storage with progress tracking
 */
export async function uploadTeamPhoto(file, onProgress) {
  if (!file) return '';

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    throw new Error(`Unsupported image format. Please upload JPEG, PNG, or WebP.`);
  }

  // Validate size limit (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error(`Image size exceeds 10MB limit.`);
  }

  // Optimize image dimensions and quality before upload
  const optimizedFile = await optimizeImage(file, 1200, 1200, 0.88);

  // Helper to convert file to Base64 data URL fallback
  const fileToBase64 = (f) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve('');
    reader.readAsDataURL(f);
  });

  if (!storage) {
    return await fileToBase64(optimizedFile);
  }

  const timeStamp = Date.now();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `team/${timeStamp}_${cleanFileName}`;
  const storageRef = ref(storage, storagePath);

  const uploadTask = uploadBytesResumable(storageRef, optimizedFile);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) {
          onProgress(progress);
        }
      },
      async (error) => {
        console.warn('Firebase Storage upload notice (using embedded image fallback):', error.message);
        const fallbackUrl = await fileToBase64(optimizedFile);
        if (fallbackUrl) {
          resolve(fallbackUrl);
        } else {
          reject(new Error(`Failed to upload photo: ${error.message}`));
        }
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (e) {
          const fallbackUrl = await fileToBase64(optimizedFile);
          resolve(fallbackUrl);
        }
      }
    );
  });
}

/**
 * Fetch all published team members for the public website
 */
export async function getPublishedTeamMembers() {
  if (!db) return [];
  try {
    const teamRef = collection(db, TEAM_COLLECTION);
    const q = query(teamRef, where('status', '==', 'published'));
    const snapshot = await getDocs(q);

    const members = [];
    snapshot.forEach((docSnap) => {
      members.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Sort by displayOrder ascending
    members.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));

    return members;
  } catch (error) {
    console.warn('Error fetching published team members from Firestore:', error.message);
    return [];
  }
}

/**
 * Fetch all team members for admin dashboard management
 */
export async function getAllTeamMembers() {
  if (!db) return [];
  try {
    const teamRef = collection(db, TEAM_COLLECTION);
    const snapshot = await getDocs(teamRef);

    const members = [];
    snapshot.forEach((docSnap) => {
      members.push({ id: docSnap.id, ...docSnap.data() });
    });

    members.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));

    return members;
  } catch (error) {
    console.warn('Notice: Unable to fetch all team members from Firestore:', error.message);
    return [];
  }
}

/**
 * Get team member by document ID
 */
export async function getTeamMemberById(id) {
  if (!db || !id) return null;
  try {
    const docRef = doc(db, TEAM_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error(`Error fetching team member by ID (${id}):`, error);
    return null;
  }
}

/**
 * Create a new team member document in Firestore
 */
export async function createTeamMember(memberData) {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  const payload = {
    name: memberData.name || '',
    role: memberData.role || '',
    bio: memberData.bio || '',
    yearsOfExperience: memberData.yearsOfExperience || '',
    photoUrl: memberData.photoUrl || '',
    linkedin: memberData.linkedin || '',
    email: memberData.email || '',
    phone: memberData.phone || '',
    displayOrder: Number(memberData.displayOrder) || 1,
    status: memberData.status || 'published',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, TEAM_COLLECTION), payload);
  return docRef.id;
}

/**
 * Update an existing team member document
 */
export async function updateTeamMember(id, memberData) {
  if (!db || !id) {
    throw new Error('Firestore is not initialized or invalid ID.');
  }

  const payload = {
    name: memberData.name || '',
    role: memberData.role || '',
    bio: memberData.bio || '',
    yearsOfExperience: memberData.yearsOfExperience || '',
    photoUrl: memberData.photoUrl || '',
    linkedin: memberData.linkedin || '',
    email: memberData.email || '',
    phone: memberData.phone || '',
    displayOrder: Number(memberData.displayOrder) || 1,
    status: memberData.status || 'published',
    updatedAt: serverTimestamp()
  };

  const docRef = doc(db, TEAM_COLLECTION, id);
  await updateDoc(docRef, payload);
}

/**
 * Delete a team member document and cleanup associated photo in Storage
 */
export async function deleteTeamMember(id, photoUrl = '') {
  if (!db || !id) {
    throw new Error('Firestore is not initialized or invalid ID.');
  }

  if (photoUrl) {
    await deleteStorageFileByUrl(photoUrl);
  }

  const docRef = doc(db, TEAM_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Seed initial key personnel into Firestore if collection is empty
 */
export async function seedDefaultTeamMembers(keyPersonnelList) {
  if (!db || !Array.isArray(keyPersonnelList)) return;

  const existing = await getAllTeamMembers();
  if (existing.length > 0) return;

  let order = 1;
  for (const person of keyPersonnelList) {
    await createTeamMember({
      name: person.name,
      role: person.role,
      bio: person.description || person.bio || '',
      yearsOfExperience: person.yearsOfExperience || '10+',
      photoUrl: person.photo || '',
      linkedin: person.linkedin || '',
      email: person.email || '',
      phone: person.phone || '',
      displayOrder: order++,
      status: 'published'
    });
  }
}
