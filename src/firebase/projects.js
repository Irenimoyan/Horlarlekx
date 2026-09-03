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
  orderBy, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './config';

const COLLECTION_NAME = 'projects';

/**
 * Generate a URL-friendly slug from title
 */
export function generateSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Compress an image file in the browser before upload to optimize web speed
 */
export async function optimizeImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.85) {
  // If file is SVG or small GIF/video, return original
  if (file.type === 'image/svg+xml' || file.type === 'image/gif' || !file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP if supported, else JPEG
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file); // Fallback to original if blob creation fails
              return;
            }
            const optimizedFile = new File([blob], file.name, {
              type: outputType,
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          },
          outputType,
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

/**
 * Upload multiple project images to Firebase Storage with progress tracking
 */
export async function uploadProjectImages(files, onProgress) {
  if (!files || files.length === 0) return [];

  const uploadedUrls = [];
  const totalFiles = files.length;

  const fileToBase64 = (f) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve('');
    reader.readAsDataURL(f);
  });

  for (let i = 0; i < totalFiles; i++) {
    const rawFile = files[i];

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(rawFile.type.toLowerCase())) {
      throw new Error(`File "${rawFile.name}" has an unsupported format. Please upload JPEG, PNG, or WebP.`);
    }

    // Validate file size max 15MB
    if (rawFile.size > 15 * 1024 * 1024) {
      throw new Error(`File "${rawFile.name}" exceeds the 15MB size limit.`);
    }

    // Optimize image
    const file = await optimizeImage(rawFile);

    if (!storage) {
      const b64 = await fileToBase64(file);
      if (b64) uploadedUrls.push(b64);
      continue;
    }

    const timeStamp = Date.now();
    const cleanFileName = rawFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `projects/${timeStamp}_${cleanFileName}`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, file);

    await new Promise((resolve) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress({
              currentIndex: i + 1,
              totalFiles,
              fileProgress: Math.round(fileProgress),
              message: `Uploading ${i + 1} of ${totalFiles}... (${Math.round(fileProgress)}%)`
            });
          }
        },
        async (error) => {
          console.warn(`Storage upload notice for ${rawFile.name} (using embedded image fallback):`, error.message);
          const b64 = await fileToBase64(file);
          if (b64) uploadedUrls.push(b64);
          resolve();
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            uploadedUrls.push(downloadUrl);
          } catch (e) {
            const b64 = await fileToBase64(file);
            if (b64) uploadedUrls.push(b64);
          }
          resolve();
        }
      );
    });
  }

  return uploadedUrls;
}

/**
 * Delete a file from Firebase Storage given its URL
 */
export async function deleteStorageFileByUrl(url) {
  if (!storage || !url || !url.includes('firebasestorage.googleapis.com')) return;
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.warn('Storage deletion notice:', error.message);
  }
}

/**
 * Fetch all published projects for public display
 */
export async function getPublishedProjects() {
  if (!db) return [];
  try {
    const projectsRef = collection(db, COLLECTION_NAME);
    const q = query(projectsRef, where('status', '==', 'published'));
    const snapshot = await getDocs(q);

    const projects = [];
    snapshot.forEach((docSnap) => {
      projects.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Client side sort if needed
    projects.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });

    return projects;
  } catch (error) {
    console.warn('Error fetching published projects from Firestore:', error.message);
    return [];
  }
}

/**
 * Fetch all projects for admin management (includes drafts)
 */
export async function getAllProjects() {
  if (!db) return [];
  try {
    const projectsRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(projectsRef);

    const projects = [];
    snapshot.forEach((docSnap) => {
      projects.push({ id: docSnap.id, ...docSnap.data() });
    });

    projects.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });

    return projects;
  } catch (error) {
    console.warn('Notice: Unable to fetch all projects from Firestore:', error.message);
    return [];
  }
}

/**
 * Get project by slug
 */
export async function getProjectBySlug(slug) {
  if (!db || !slug) return null;
  try {
    const projectsRef = collection(db, COLLECTION_NAME);
    // Query with status == 'published' to satisfy Firestore security rules for public reads
    const q = query(projectsRef, where('slug', '==', slug), where('status', '==', 'published'));
    let snapshot = await getDocs(q);

    // Fallback check for admin previewing draft project by slug
    if (snapshot.empty) {
      try {
        const qAll = query(projectsRef, where('slug', '==', slug));
        snapshot = await getDocs(qAll);
      } catch (err) {
        // Suppress permission error if visitor checks unpublished slug
        return null;
      }
    }

    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.warn(`Notice getting project by slug (${slug}):`, error.message);
    return null;
  }
}

/**
 * Get project by Document ID
 */
export async function getProjectById(id) {
  if (!db || !id) return null;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error(`Error getting project by ID (${id}):`, error);
    return null;
  }
}

/**
 * Create a new project document in Firestore
 */
/**
 * Create a new project document in Firestore (prevents duplicates by checking existing slug)
 */
export async function createProject(projectData) {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  const slug = generateSlug(projectData.title);

  const payload = {
    title: projectData.title || '',
    slug: slug,
    location: projectData.location || '',
    year: projectData.year || new Date().getFullYear().toString(),
    category: projectData.category || 'ACP/ALUCOBOND',
    projectType: projectData.projectType || 'Facade Cladding',
    client: projectData.client || '',
    shortDescription: projectData.shortDescription || '',
    overview: projectData.overview || projectData.description || '',
    description: projectData.description || projectData.overview || '',
    challenge: projectData.challenge || '',
    solution: projectData.solution || '',
    servicesProvided: Array.isArray(projectData.servicesProvided) ? projectData.servicesProvided : [],
    duration: projectData.duration || '',
    status: projectData.status || 'draft',
    featured: Boolean(projectData.featured),
    images: Array.isArray(projectData.images) ? projectData.images : [],
    featuredImage: projectData.featuredImage || (projectData.images?.[0] || ''),
    videos: Array.isArray(projectData.videos) ? projectData.videos : (projectData.videoUrl ? [projectData.videoUrl] : []),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  // Duplicate Check: Check if a document with this slug already exists in Firestore
  try {
    const existingDoc = await getProjectBySlug(slug);
    if (existingDoc && existingDoc.id) {
      // Update existing document instead of creating a duplicate
      await updateProject(existingDoc.id, payload);
      return existingDoc.id;
    }
  } catch (e) {
    // Ignore error if slug check fails and proceed to addDoc
  }

  const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
  return docRef.id;
}

/**
 * Update existing project document
 */
export async function updateProject(id, projectData) {
  if (!db || !id) {
    throw new Error('Firestore is not initialized or invalid ID.');
  }

  const slug = generateSlug(projectData.title);

  const payload = {
    title: projectData.title,
    slug: slug,
    location: projectData.location || '',
    year: projectData.year || '',
    category: projectData.category || 'ACP/ALUCOBOND',
    projectType: projectData.projectType || '',
    client: projectData.client || '',
    shortDescription: projectData.shortDescription || '',
    overview: projectData.overview || projectData.description || '',
    description: projectData.description || projectData.overview || '',
    challenge: projectData.challenge || '',
    solution: projectData.solution || '',
    servicesProvided: Array.isArray(projectData.servicesProvided) ? projectData.servicesProvided : [],
    duration: projectData.duration || '',
    status: projectData.status || 'draft',
    featured: Boolean(projectData.featured),
    images: Array.isArray(projectData.images) ? projectData.images : [],
    featuredImage: projectData.featuredImage || (projectData.images?.[0] || ''),
    videos: Array.isArray(projectData.videos) ? projectData.videos : [],
    updatedAt: serverTimestamp()
  };

  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, payload);
}

/**
 * Delete project document and optional storage images
 */
export async function deleteProject(id, images = []) {
  if (!db || !id) {
    throw new Error('Firestore is not initialized or invalid ID.');
  }

  // Attempt deleting images from Storage
  if (Array.isArray(images) && images.length > 0) {
    for (const imgUrl of images) {
      await deleteStorageFileByUrl(imgUrl);
    }
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * Scans Firestore for duplicate project documents by slug/title, keeps the primary one, and deletes any replicated copies.
 */
export async function deduplicateFirestoreProjects() {
  if (!db) return { deletedCount: 0, message: 'Firestore is not initialized.' };

  try {
    const allProjects = await getAllProjects();
    if (!allProjects || allProjects.length === 0) {
      return { deletedCount: 0, message: 'No project documents in database.' };
    }

    const slugGroups = new Map();

    // Group project documents by slug or normalized title
    for (const proj of allProjects) {
      const key = proj.slug || generateSlug(proj.title);
      if (!key) continue;

      if (!slugGroups.has(key)) {
        slugGroups.set(key, []);
      }
      slugGroups.get(key).push(proj);
    }

    let deletedCount = 0;

    // Delete duplicates for any slug with > 1 document
    for (const [slug, docs] of slugGroups.entries()) {
      if (docs.length > 1) {
        // Sort: keep the document with the most details / highest timestamp first
        docs.sort((a, b) => {
          const timeA = a.updatedAt?.seconds || a.createdAt?.seconds || 0;
          const timeB = b.updatedAt?.seconds || b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

        // Keep docs[0], delete docs[1...n]
        const duplicates = docs.slice(1);
        for (const dup of duplicates) {
          try {
            const docRef = doc(db, COLLECTION_NAME, dup.id);
            await deleteDoc(docRef);
            deletedCount++;
          } catch (err) {
            console.warn(`Failed deleting duplicate doc ${dup.id}:`, err.message);
          }
        }
      }
    }

    return {
      deletedCount,
      message: deletedCount > 0
        ? `Cleaned up and deleted ${deletedCount} replicated project document(s) from Firebase database.`
        : 'Zero duplicate projects found. Database is completely clean.'
    };
  } catch (error) {
    console.error('Error during Firestore deduplication:', error);
    return { deletedCount: 0, message: error.message };
  }
}

/**
 * Helper to collect project entries from browser localStorage
 */
export function getLocalStorageProjects() {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  const storageKeys = ['horlarlekx_projects', 'projects', 'saved_projects', 'draft_projects', 'horlar_projects'];
  const localItems = [];

  for (const key of storageKeys) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          localItems.push(...parsed);
        } else if (parsed && typeof parsed === 'object' && parsed.title) {
          localItems.push(parsed);
        }
      }
    } catch (err) {
      console.warn(`LocalStorage parse notice for key ${key}:`, err.message);
    }
  }

  return localItems;
}

/**
 * 1-Click Migration Helper: Seed Firestore with localStorage and default portfolio projects
 */
export async function seedDefaultProjects(staticProjects = [], force = false) {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  // Clean up any pre-existing duplicates in Firestore first
  await deduplicateFirestoreProjects();

  const localProjects = getLocalStorageProjects();
  const combinedProjects = [...(staticProjects || []), ...localProjects];

  // Deduplicate by slug or title
  const projectMap = new Map();
  for (const item of combinedProjects) {
    if (!item || !item.title) continue;
    const key = item.slug || generateSlug(item.title);
    if (!projectMap.has(key)) {
      projectMap.set(key, item);
    }
  }

  const uniqueProjects = Array.from(projectMap.values());
  const existingDocs = await getAllProjects();

  const existingSlugs = new Set(
    existingDocs.map((docItem) => docItem.slug || generateSlug(docItem.title))
  );

  const projectsToInsert = force
    ? uniqueProjects.filter((p) => !existingSlugs.has(p.slug || generateSlug(p.title)))
    : uniqueProjects.filter((p) => !existingSlugs.has(p.slug || generateSlug(p.title)));

  if (projectsToInsert.length === 0) {
    return {
      count: 0,
      message: `All ${uniqueProjects.length} unique project records are present in Firebase. No duplicates found.`
    };
  }

  let count = 0;
  for (const proj of projectsToInsert) {
    try {
      await createProject({
        ...proj,
        status: proj.status || 'published',
        featured: Boolean(proj.featured)
      });
      count++;
    } catch (err) {
      console.warn(`Error seeding project "${proj.title}":`, err.message);
    }
  }

  return { 
    count, 
    message: `Successfully synchronized ${count} project(s) into Firebase database with zero duplicates!` 
  };
}
