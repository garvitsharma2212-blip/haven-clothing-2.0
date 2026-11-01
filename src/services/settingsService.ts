import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { StoreSettings } from '../types';

export const DEFAULT_HERO_IMAGE = '/assets/aistudio/WhatsApp_Image_2026-11-01_at_11.04.16_AM_4d6ba964.jpeg';

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'HAVEN CLOTHING',
  tagline: 'Wear Your Comfort. Define Your Style.',
  supportEmail: 'havenclothingindia@gmail.com',
  phone: '+91 98290 12345',
  freeShippingThreshold: 999,
  shippingFee: 99,
  announcement: 'Free Shipping on Orders Above ₹999 | COD Available',
  hero: {
    imageUrl: DEFAULT_HERO_IMAGE,
    badgeText: 'WEAR THE VIBE',
    title: 'HAVEN',
    subtitle: 'CLOTHING',
    description: 'Premium Streetwear for your Everyday.',
    buttonText: 'Shop Now',
    buttonLink: 'shop'
  }
};

const SETTINGS_DOC_PATH = 'settings/store';

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const ref = doc(db, 'settings', 'store');
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { ...DEFAULT_SETTINGS, ...snap.data() } as StoreSettings;
    } else {
      await setDoc(ref, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
  } catch (err) {
    console.warn('Could not fetch settings from Firestore, using default:', err);
    return DEFAULT_SETTINGS;
  }
}

export function subscribeToStoreSettings(
  onUpdate: (settings: StoreSettings) => void
): () => void {
  const ref = doc(db, 'settings', 'store');
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onUpdate({ ...DEFAULT_SETTINGS, ...snap.data() } as StoreSettings);
      } else {
        onUpdate(DEFAULT_SETTINGS);
      }
    },
    (err) => {
      console.warn('Settings subscription fallback:', err);
      onUpdate(DEFAULT_SETTINGS);
    }
  );
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<void> {
  try {
    const ref = doc(db, 'settings', 'store');
    await setDoc(ref, settings, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, SETTINGS_DOC_PATH);
  }
}
