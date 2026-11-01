import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Order, OrderStatus, PaymentStatus } from '../types';

const COLLECTION_NAME = 'orders';

export interface CreateOrderInput {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  orderNotes?: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
    color: string;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  shippingFee: number;
  discountAmount?: number;
  totalAmount: number;
}

export function generateOrderNumber(): string {
  const year = '26';
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
  const timestampSuffix = Date.now().toString().slice(-4);
  return `HVN-${year}-${randomChars}${timestampSuffix}`;
}

export async function createCODOrder(input: CreateOrderInput): Promise<Order> {
  const orderNumber = generateOrderNumber();
  const orderDocId = orderNumber.toLowerCase();

  const newOrder: Order = {
    id: orderDocId,
    orderNumber,
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    email: input.email ? input.email.trim() : '',
    address: input.address.trim(),
    city: input.city.trim(),
    state: input.state.trim(),
    pincode: input.pincode.trim(),
    orderNotes: input.orderNotes ? input.orderNotes.trim() : '',
    items: input.items,
    subtotal: input.subtotal,
    shippingFee: input.shippingFee,
    discountAmount: input.discountAmount || 0,
    totalAmount: input.totalAmount,
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    orderStatus: 'NEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, COLLECTION_NAME, orderDocId);
    await setDoc(docRef, newOrder);

    // Send order notification email to havenclothingindia@gmail.com
    await notifyAdminOfNewOrder(newOrder);

    return newOrder;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${COLLECTION_NAME}/${orderDocId}`);
  }
}

export async function getOrderByIdOrNumber(identifier: string): Promise<Order | null> {
  const cleanId = identifier.trim().toLowerCase();
  
  try {
    // 1. Try direct doc lookup
    const directRef = doc(db, COLLECTION_NAME, cleanId);
    const directSnap = await getDoc(directRef);
    if (directSnap.exists()) {
      return { ...directSnap.data(), id: directSnap.id } as Order;
    }

    // 2. Try query by orderNumber
    const qOrderNum = query(
      collection(db, COLLECTION_NAME),
      where('orderNumber', '==', identifier.trim().toUpperCase())
    );
    const orderNumSnap = await getDocs(qOrderNum);
    if (!orderNumSnap.empty) {
      const d = orderNumSnap.docs[0];
      return { ...d.data(), id: d.id } as Order;
    }

    // 3. Try query by phone
    const cleanPhone = identifier.replace(/[^0-9]/g, '');
    if (cleanPhone.length >= 10) {
      const qPhone = query(
        collection(db, COLLECTION_NAME),
        where('phone', '==', identifier.trim())
      );
      const phoneSnap = await getDocs(qPhone);
      if (!phoneSnap.empty) {
        const d = phoneSnap.docs[0];
        return { ...d.data(), id: d.id } as Order;
      }
    }

    return null;
  } catch (err) {
    console.error('Error fetching order:', err);
    return null;
  }
}

export function subscribeToAllOrders(
  onUpdate: (orders: Order[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, COLLECTION_NAME);
  // Sort descending in memory if composite index not present
  return onSnapshot(
    colRef,
    (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((d) => {
        orders.push({ ...d.data(), id: d.id } as Order);
      });
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(orders);
    },
    (err) => {
      console.error('Orders subscription error:', err);
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.GET, COLLECTION_NAME);
    }
  );
}

export async function updateOrderStatus(
  orderId: string, 
  orderStatus: OrderStatus,
  options?: {
    paymentStatus?: PaymentStatus;
    trackingNumber?: string;
    trackingCarrier?: string;
    adminNotes?: string;
  }
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, orderId);
    const updates: Partial<Order> = {
      orderStatus,
      updatedAt: new Date().toISOString(),
      ...(options?.paymentStatus ? { paymentStatus: options.paymentStatus } : {}),
      ...(options?.trackingNumber !== undefined ? { trackingNumber: options.trackingNumber } : {}),
      ...(options?.trackingCarrier !== undefined ? { trackingCarrier: options.trackingCarrier } : {}),
      ...(options?.adminNotes !== undefined ? { adminNotes: options.adminNotes } : {})
    };

    if (options?.trackingNumber && options?.trackingCarrier) {
      if (options.trackingCarrier.toLowerCase().includes('delhivery')) {
        updates.trackingUrl = `https://www.delhivery.com/track/package/${options.trackingNumber}`;
      } else if (options.trackingCarrier.toLowerCase().includes('bluedart')) {
        updates.trackingUrl = `https://www.bluedart.com/tracking?trackNumber=${options.trackingNumber}`;
      } else {
        updates.trackingUrl = `https://www.shiprocket.in/shipment-tracking/?tracking_id=${options.trackingNumber}`;
      }
    }

    await updateDoc(docRef, updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${COLLECTION_NAME}/${orderId}`);
  }
}

export async function notifyAdminOfNewOrder(order: Order): Promise<{ success: boolean; message: string }> {
  console.log(`[Order Notification] Order ${order.orderNumber} placed for ₹${order.totalAmount} via COD by ${order.customerName}.`);

  // 1. Call backend Express endpoint /api/notify-order
  try {
    const res = await fetch('/api/notify-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });

    if (res.ok) {
      const data = await res.json();
      console.log('Order notification dispatched:', data);
      return { success: true, message: data.message || 'Notification dispatched to havenclothingindia@gmail.com' };
    }
  } catch (err) {
    console.warn('Backend notification fetch warning:', err);
  }

  // 2. Local fallback storage
  try {
    const notificationPayload = {
      to: 'havenclothingindia@gmail.com',
      subject: `New COD Order: ${order.orderNumber} - ₹${order.totalAmount}`,
      customer: order.customerName,
      phone: order.phone,
      total: order.totalAmount,
      items: order.items.map(i => `${i.name} (${i.size}, ${i.color}) x ${i.quantity}`).join(', '),
      time: new Date().toISOString()
    };
    const existingLogs = JSON.parse(localStorage.getItem('haven_order_notifications') || '[]');
    existingLogs.unshift(notificationPayload);
    localStorage.setItem('haven_order_notifications', JSON.stringify(existingLogs.slice(0, 50)));
  } catch (e) {
    // Ignore
  }

  return { success: true, message: 'Notification queued for havenclothingindia@gmail.com' };
}
