import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const COLLECTION_NAME = 'products';

// Identifiers of mock sample items to be cleaned up as requested
const OLD_MOCK_IDS = [
  'haven-heavyweight-oversized-tee',
  'signature-waffle-knit-thermal-tee',
  'haven-minimalist-heavy-fleece-sweatshirt',
  'aura-boxy-oversized-drop-shoulder-tee',
  'atelier-waffle-long-sleeve-knit',
  'monolith-relaxed-oversized-sweatshirt',
  'essential-relaxed-crew-tee',
  'mockneck-architectural-sweatshirt'
];

export async function cleanupOldMockProducts(): Promise<void> {
  try {
    for (const mockId of OLD_MOCK_IDS) {
      await deleteDoc(doc(db, COLLECTION_NAME, mockId)).catch(() => {});
    }
  } catch (e) {
    // silently catch if permissions not granted or already removed
  }
}

export async function getProductsFromDB(): Promise<Product[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snap = await getDocs(colRef);
    
    if (snap.empty) {
      return [];
    }

    const products: Product[] = [];
    snap.forEach((d) => {
      // Exclude previous mock products
      if (!OLD_MOCK_IDS.includes(d.id)) {
        products.push({ ...d.data(), id: d.id } as Product);
      }
    });
    return products;
  } catch (error) {
    console.warn('Could not fetch from Firestore:', error);
    return [];
  }
}

export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, COLLECTION_NAME);

  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const list: Product[] = [];
      snapshot.forEach((d) => {
        // Exclude previous mock products
        if (!OLD_MOCK_IDS.includes(d.id)) {
          list.push({ ...d.data(), id: d.id } as Product);
        }
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Products subscription note:', err);
      if (onError) onError(err);
      onUpdate([]);
    }
  );
}

export async function addProductToDB(product: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
  const id = product.id || `haven-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newProduct: Product = {
    ...product,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, COLLECTION_NAME, id), newProduct);
    return newProduct;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function updateProductInDB(id: string, updates: Partial<Product>): Promise<void> {
  try {
    const ref = doc(db, COLLECTION_NAME, id);
    await setDoc(
      ref,
      {
        ...updates,
        id,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function deleteProductFromDB(id: string): Promise<void> {
  try {
    const ref = doc(db, COLLECTION_NAME, id);
    await deleteDoc(ref);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}

export async function clearAllStoreProducts(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, COLLECTION_NAME));
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, COLLECTION_NAME);
  }
}

export async function resetCatalogToDefault(): Promise<void> {
  await cleanupOldMockProducts();
}

export async function seedCatalogIfEmpty(): Promise<void> {
  // Mock products intentionally removed per user request
}
