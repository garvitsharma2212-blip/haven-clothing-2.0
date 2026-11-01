import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Settings, 
  Plus, 
  Search, 
  CheckCircle, 
  Truck, 
  X, 
  Edit3, 
  Trash2, 
  Download, 
  LogOut, 
  Eye, 
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Shield,
  Layers,
  Tag,
  DollarSign,
  Mail,
  Upload
} from 'lucide-react';
import { Product, Order, OrderStatus, ProductSize, ColorVariant, ProductCategory } from '../../types';
import { useAuth, ADMIN_EMAIL } from '../../context/AuthContext';
import { 
  addProductToDB, 
  updateProductInDB, 
  deleteProductFromDB, 
  resetCatalogToDefault,
  seedCatalogIfEmpty 
} from '../../services/productService';
import { updateOrderStatus } from '../../services/orderService';

interface AdminDashboardPageProps {
  products: Product[];
  orders: Order[];
  onBackToStore: () => void;
  onRefreshProducts: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  products,
  orders,
  onBackToStore,
  onRefreshProducts
}) => {
  const { user, adminName, isFounder, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'analytics' | 'settings'>('orders');

  useEffect(() => {
    seedCatalogIfEmpty();
  }, []);

  // Orders Tab State
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [newTrackingNumber, setNewTrackingNumber] = useState('');
  const [newTrackingCarrier, setNewTrackingCarrier] = useState('Delhivery Express');

  // Product Tab State
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State for Add / Edit Product
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('oversized-t-shirts');
  const [prodDescription, setProdDescription] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(1999);
  const [prodDiscountedPrice, setProdDiscountedPrice] = useState<number>(1399);
  const [prodStock, setProdStock] = useState<number>(30);
  const [prodSizes, setProdSizes] = useState<ProductSize[]>(['S', 'M', 'L', 'XL', 'XXL']);
  const [prodImages, setProdImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85'
  ]);
  const [prodColors, setProdColors] = useState<ColorVariant[]>([
    { name: 'Charcoal', hex: '#2A2826' },
    { name: 'Chalk White', hex: '#FAF7EE' }
  ]);
  const [prodIsFeatured, setProdIsFeatured] = useState(true);
  const [prodIsBestseller, setProdIsBestseller] = useState(false);
  const [prodIsActive, setProdIsActive] = useState(true);

  // Settings State
  const [storeAnnouncement, setStoreAnnouncement] = useState(
    'Free Shipping on Orders Above ₹999 | COD Available'
  );
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(999);
  const [supportEmailState, setSupportEmailState] = useState('havenclothingindia@gmail.com');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Sync editingProduct into form
  useEffect(() => {
    if (editingProduct) {
      setProdName(editingProduct.name);
      setProdCategory(editingProduct.category);
      setProdDescription(editingProduct.description);
      setProdPrice(editingProduct.price);
      setProdDiscountedPrice(editingProduct.discountedPrice || 0);
      setProdStock(editingProduct.stock);
      setProdSizes(editingProduct.sizes || ['S', 'M', 'L', 'XL', 'XXL']);
      setProdImages(editingProduct.images.length > 0 ? editingProduct.images : ['']);
      setProdColors(editingProduct.colors.length > 0 ? editingProduct.colors : [{ name: 'Default', hex: '#1A1918' }]);
      setProdIsFeatured(editingProduct.isFeatured);
      setProdIsBestseller(editingProduct.isBestseller);
      setProdIsActive(editingProduct.isActive);
    } else {
      // Defaults for new product
      setProdName('');
      setProdCategory('oversized-t-shirts');
      setProdDescription('');
      setProdPrice(1999);
      setProdDiscountedPrice(1399);
      setProdStock(40);
      setProdSizes(['S', 'M', 'L', 'XL', 'XXL']);
      setProdImages(['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85']);
      setProdColors([
        { name: 'Washed Charcoal', hex: '#2C2B2A' },
        { name: 'Chalk White', hex: '#FAF7EE' }
      ]);
      setProdIsFeatured(false);
      setProdIsBestseller(false);
      setProdIsActive(true);
    }
  }, [editingProduct, isProductModalOpen]);

  // Order Metrics Calculations
  const totalOrders = orders.length;
  const newOrdersCount = orders.filter((o) => o.orderStatus === 'NEW').length;
  const confirmedOrdersCount = orders.filter((o) => o.orderStatus === 'CONFIRMED').length;
  const shippedOrdersCount = orders.filter((o) => o.orderStatus === 'SHIPPED').length;
  const deliveredOrdersCount = orders.filter((o) => o.orderStatus === 'DELIVERED').length;
  const cancelledOrdersCount = orders.filter((o) => o.orderStatus === 'CANCELLED').length;
  const totalSalesValue = orders
    .filter((o) => o.orderStatus !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (selectedOrderStatus !== 'ALL' && o.orderStatus !== selectedOrderStatus) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchNum = o.orderNumber?.toLowerCase().includes(q);
      const matchPhone = o.phone?.includes(q);
      const matchName = o.customerName?.toLowerCase().includes(q);
      const matchCity = o.city?.toLowerCase().includes(q);
      return matchNum || matchPhone || matchName || matchCity;
    }
    return true;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    if (productSearchQuery.trim()) {
      const q = productSearchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  // Handlers for Order Operations
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      if (inspectingOrder && inspectingOrder.id === orderId) {
        setInspectingOrder({ ...inspectingOrder, orderStatus: newStatus });
      }
    } catch (e) {
      alert('Failed to update order status');
    }
  };

  const handleSaveTracking = async () => {
    if (!trackingModalOrder || !newTrackingNumber.trim()) return;
    try {
      await updateOrderStatus(trackingModalOrder.id, 'SHIPPED', {
        trackingNumber: newTrackingNumber.trim(),
        trackingCarrier: newTrackingCarrier
      });
      setTrackingModalOrder(null);
      setNewTrackingNumber('');
    } catch (e) {
      alert('Failed to save tracking info');
    }
  };

  const handleResendEmail = async (order: Order) => {
    try {
      const res = await fetch('/api/notify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const data = await res.json();
      alert(`Email Status: ${data.message || 'Notification sent to havenclothingindia@gmail.com'}`);
    } catch (e) {
      alert('Failed to send notification request');
    }
  };

  // Handlers for Product Operations
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      alert('Product name is required');
      return;
    }

    const payload = {
      name: prodName.trim(),
      slug: prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: prodCategory,
      categoryName: prodCategory === 'oversized-t-shirts' ? 'Oversized T-Shirts' : prodCategory === 'waffle-t-shirts' ? 'Waffle T-Shirts' : 'Sweatshirts',
      description: prodDescription.trim(),
      price: Number(prodPrice),
      discountedPrice: prodDiscountedPrice ? Number(prodDiscountedPrice) : undefined,
      stock: Number(prodStock),
      sizes: prodSizes,
      colors: prodColors.filter(c => c.name.trim() !== ''),
      images: prodImages.filter(img => img.trim() !== ''),
      isFeatured: prodIsFeatured,
      isBestseller: prodIsBestseller,
      isActive: prodIsActive
    };

    try {
      if (editingProduct) {
        await updateProductInDB(editingProduct.id, payload);
      } else {
        await addProductToDB(payload);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      onRefreshProducts();
    } catch (e) {
      alert('Failed to save product to database');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}" from HAVEN catalog?`)) {
      try {
        await deleteProductFromDB(id);
        onRefreshProducts();
      } catch (e) {
        alert('Failed to delete product');
      }
    }
  };

  const handleToggleProductActive = async (p: Product) => {
    try {
      await updateProductInDB(p.id, { isActive: !p.isActive });
      onRefreshProducts();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  // CSV Export for Logistics
  const handleExportCSV = () => {
    const headers = ['OrderNumber', 'CustomerName', 'Phone', 'Email', 'Address', 'City', 'State', 'Pincode', 'ItemsCount', 'TotalAmount', 'PaymentMethod', 'OrderStatus', 'TrackingNumber', 'Date'];
    const rows = filteredOrders.map(o => [
      o.orderNumber,
      `"${o.customerName.replace(/"/g, '""')}"`,
      o.phone,
      o.email || '',
      `"${o.address.replace(/"/g, '""')}"`,
      o.city,
      o.state,
      o.pincode,
      o.items.reduce((acc, i) => acc + i.quantity, 0),
      o.totalAmount,
      o.paymentMethod,
      o.orderStatus,
      o.trackingNumber || '',
      new Date(o.createdAt).toISOString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HAVEN_ORDERS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1A1918] pb-24">
      
      {/* Top Admin Navigation Header */}
      <div className="bg-[#1A1918] text-[#FAF9F5] border-b border-[#2B2927]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FAF9F5]/10 text-[#C5A880]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl tracking-wider uppercase font-semibold">HAVEN Operations</span>
                <span className="text-[10px] bg-[#C5A880] text-[#1A1918] font-bold px-2 py-0.5 uppercase tracking-widest">
                  Founders Portal
                </span>
              </div>
              <p className="text-xs text-[#A8A196]">
                Garvit Sharma &amp; Ankit Meena • <span className="font-mono">{ADMIN_EMAIL}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="px-4 py-2 bg-transparent border border-[#FAF9F5]/30 hover:border-[#FAF9F5] text-xs uppercase tracking-wider text-[#FAF9F5] transition-colors"
            >
              View Live Store
            </button>
            <button
              onClick={logout}
              className="p-2 text-[#C53030] hover:text-[#FAF9F5] hover:bg-[#C53030]/20 transition-colors flex items-center gap-1.5 text-xs uppercase tracking-wider"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-4 border-t border-[#292725] overflow-x-auto">
          {[
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'analytics', label: 'Store Metrics', icon: TrendingUp },
            { id: 'settings', label: 'Store Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 sm:px-4 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                  isTabActive
                    ? 'border-[#C5A880] text-[#FAF9F5] bg-[#22201D]'
                    : 'border-transparent text-[#999286] hover:text-[#FAF9F5]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#C5A880]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: ORDERS DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: 'Total Sales', val: `₹${totalSalesValue.toLocaleString('en-IN')}`, color: 'border-[#1A1918] bg-[#1A1918] text-[#FAF9F5]' },
                { label: 'Total Orders', val: totalOrders, color: 'bg-[#F2ECE1] text-[#1A1918]' },
                { label: 'New / Pending', val: newOrdersCount, color: 'bg-[#FEF9E7] text-[#9A7D2C]' },
                { label: 'Confirmed', val: confirmedOrdersCount, color: 'bg-[#EBF5FB] text-[#2471A3]' },
                { label: 'Shipped', val: shippedOrdersCount, color: 'bg-[#E8F8F5] text-[#117A65]' },
                { label: 'Delivered', val: deliveredOrdersCount, color: 'bg-[#EBF2EC] text-[#3B6E47]' },
                { label: 'Cancelled', val: cancelledOrdersCount, color: 'bg-[#FAF0F0] text-[#C53030]' },
              ].map((m, idx) => (
                <div key={idx} className={`p-4 border border-[#E3DDCF] ${m.color} space-y-1`}>
                  <p className="text-[10px] uppercase tracking-wider font-semibold opacity-80">{m.label}</p>
                  <p className="font-serif text-xl sm:text-2xl font-bold truncate">{m.val}</p>
                </div>
              ))}
            </div>

            {/* Filter & Action Controls */}
            <div className="bg-[#FAF9F5] border border-[#E3DDD1] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="flex-1 flex items-center bg-white border border-[#DDD5C6] px-3 py-2 max-w-md">
                <Search className="w-4 h-4 text-[#8C8477] mr-2" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Phone, Customer Name..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full text-xs bg-transparent focus:outline-none"
                />
                {orderSearchQuery && (
                  <button onClick={() => setOrderSearchQuery('')} className="text-[#8C8477] hover:text-[#1A1918]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Chips Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
                {(['ALL', 'NEW', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedOrderStatus(status)}
                    className={`px-3 py-1.5 uppercase tracking-wider text-[11px] font-semibold transition-colors border ${
                      selectedOrderStatus === status
                        ? 'bg-[#1A1918] text-[#FAF9F5] border-[#1A1918]'
                        : 'bg-white text-[#635D53] border-[#DDD5C6] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Export to CSV */}
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-white border border-[#DDD5C6] hover:bg-[#F2ECE1] text-xs uppercase tracking-wider font-semibold text-[#1A1918] flex items-center gap-1.5"
                title="Export orders for logistics dispatch"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Orders Table */}
            <div className="bg-[#FAF9F5] border border-[#E3DDD1] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F2ECE1] border-b border-[#DDD5C6] text-[11px] uppercase tracking-wider text-[#696256]">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">City / State</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">COD Status</th>
                      <th className="py-3 px-4">Order Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE4D8]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-[#8C8477]">
                          No orders matching query or filters.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-[#F5F1E8] transition-colors">
                          <td className="py-3.5 px-4 font-mono font-semibold text-[#1A1918]">
                            {o.orderNumber}
                            <div className="text-[10px] text-[#8C8477] font-sans">
                              {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-[#1A1918]">{o.customerName}</p>
                            <p className="text-[11px] text-[#7A7367]">{o.phone}</p>
                          </td>

                          <td className="py-3.5 px-4 text-[#595349]">
                            {o.city}, {o.state}
                            <div className="text-[10px] text-[#8C8477]">{o.pincode}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-medium text-[#1A1918]">{o.items.length} items</span>
                            <p className="text-[10px] text-[#8C8477] truncate max-w-[150px]">
                              {o.items.map(i => `${i.name} (${i.size})`).join(', ')}
                            </p>
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-[#1A1918]">
                            ₹{o.totalAmount.toLocaleString('en-IN')}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                              o.paymentStatus === 'PAID' ? 'bg-[#EBF2EC] text-[#3B6E47]' : 'bg-[#FEF9E7] text-[#9A7D2C]'
                            }`}>
                              COD: {o.paymentStatus}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                              o.orderStatus === 'NEW' ? 'bg-[#FEF9E7] text-[#9A7D2C]' :
                              o.orderStatus === 'CONFIRMED' ? 'bg-[#EBF5FB] text-[#2471A3]' :
                              o.orderStatus === 'SHIPPED' ? 'bg-[#E8F8F5] text-[#117A65]' :
                              o.orderStatus === 'DELIVERED' ? 'bg-[#EBF2EC] text-[#3B6E47]' :
                              'bg-[#FAF0F0] text-[#C53030]'
                            }`}>
                              {o.orderStatus}
                            </span>
                            {o.trackingNumber && (
                              <div className="text-[10px] text-[#595349] font-mono mt-0.5">
                                AWB: {o.trackingNumber}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right space-x-2">
                            {o.orderStatus === 'NEW' && (
                              <button
                                onClick={() => handleUpdateStatus(o.id, 'CONFIRMED')}
                                className="px-2.5 py-1 bg-[#1A1918] text-[#FAF9F5] text-[10px] uppercase font-semibold hover:bg-[#33312E]"
                                title="Confirm COD order"
                              >
                                Confirm
                              </button>
                            )}

                            <button
                              onClick={() => setTrackingModalOrder(o)}
                              className="px-2.5 py-1 bg-white border border-[#DDD5C6] text-[10px] uppercase font-semibold text-[#1A1918] hover:bg-[#F2ECE1]"
                              title="Add tracking"
                            >
                              Dispatch
                            </button>

                            <button
                              onClick={() => handleResendEmail(o)}
                              className="p-1 text-[#C5A880] hover:text-[#1A1918]"
                              title="Send order alert email to havenclothingindia@gmail.com"
                            >
                              <Mail className="w-4 h-4 inline" />
                            </button>

                            <button
                              onClick={() => setInspectingOrder(o)}
                              className="p-1 text-[#696256] hover:text-[#1A1918]"
                              title="View full order"
                            >
                              <Eye className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PRODUCT MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Header & Add Trigger */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E3DDD1] gap-4">
              <div>
                <h2 className="text-2xl font-serif text-[#1A1918]">Apparel Catalog Management</h2>
                <p className="text-xs text-[#7A7367]">
                  All catalog modifications instantly synchronize with the customer-facing storefront in Firestore.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={async () => {
                    if (window.confirm('Clean up and purge any leftover mock products from Firestore?')) {
                      await resetCatalogToDefault();
                      onRefreshProducts();
                    }
                  }}
                  className="px-4 py-2.5 bg-white border border-[#DDD5C6] text-xs uppercase font-semibold text-[#575046] hover:bg-[#F2ECE1] flex items-center gap-1.5"
                  title="Remove legacy mock items from database"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Purge Mock Data</span>
                </button>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#1A1918] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#33312E] flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#C5A880]" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Product Search */}
            <div className="bg-white border border-[#DDD5C6] px-3 py-2 max-w-md flex items-center">
              <Search className="w-4 h-4 text-[#8C8477] mr-2" />
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                className="w-full text-xs bg-transparent focus:outline-none"
              />
            </div>

            {/* Products Table */}
            <div className="bg-[#FAF9F5] border border-[#E3DDD1] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F2ECE1] border-b border-[#DDD5C6] text-[11px] uppercase tracking-wider text-[#696256]">
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price / Discount</th>
                      <th className="py-3 px-4">Sizes</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Tags</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE4D8]">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F5F1E8] transition-colors">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-14 object-cover bg-[#EAE5DC] shrink-0"
                          />
                          <div>
                            <p className="font-serif font-medium text-sm text-[#1A1918]">{p.name}</p>
                            <p className="text-[10px] text-[#8C8477] font-mono">{p.slug}</p>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 capitalize text-[#575046]">
                          {p.category.replace('-', ' ')}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#1A1918]">
                            ₹{(p.discountedPrice || p.price).toLocaleString('en-IN')}
                          </span>
                          {p.discountedPrice && (
                            <span className="text-[10px] text-[#999285] line-through ml-1.5">
                              ₹{p.price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex gap-1 flex-wrap">
                            {p.sizes.map((s) => (
                              <span key={s} className="px-1.5 py-0.5 bg-[#EAE5DB] text-[10px] font-semibold">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`font-semibold ${p.stock <= 10 ? 'text-[#C53030]' : 'text-[#1A1918]'}`}>
                            {p.stock} units
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleProductActive(p)}
                            className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                              p.isActive ? 'bg-[#EBF2EC] text-[#3B6E47]' : 'bg-[#FAF0F0] text-[#C53030]'
                            }`}
                          >
                            {p.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex gap-1">
                            {p.isFeatured && (
                              <span className="px-1.5 py-0.5 bg-[#1A1918] text-[#FAF9F5] text-[9px] uppercase font-bold">
                                Featured
                              </span>
                            )}
                            {p.isBestseller && (
                              <span className="px-1.5 py-0.5 bg-[#C5A880] text-[#1A1918] text-[9px] uppercase font-bold">
                                Best
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsProductModalOpen(true);
                            }}
                            className="p-1.5 text-[#595349] hover:text-[#1A1918]"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-[#A8584F] hover:text-[#C53030]"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#FAF9F5] border border-[#E3DDD1] p-6 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#8C8375] font-semibold">Total Revenue (COD)</span>
                <h3 className="font-serif text-3xl text-[#1A1918]">₹{totalSalesValue.toLocaleString('en-IN')}</h3>
                <p className="text-xs text-[#3B6E47]">Across {totalOrders} placed orders</p>
              </div>

              <div className="bg-[#FAF9F5] border border-[#E3DDD1] p-6 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#8C8375] font-semibold">Average Order Value (AOV)</span>
                <h3 className="font-serif text-3xl text-[#1A1918]">
                  ₹{totalOrders > 0 ? Math.round(totalSalesValue / totalOrders).toLocaleString('en-IN') : 0}
                </h3>
                <p className="text-xs text-[#7A7367]">Per COD transaction</p>
              </div>

              <div className="bg-[#FAF9F5] border border-[#E3DDD1] p-6 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#8C8375] font-semibold">Active SKU Catalog</span>
                <h3 className="font-serif text-3xl text-[#1A1918]">{products.filter(p => p.isActive).length} Products</h3>
                <p className="text-xs text-[#7A7367]">Across 3 signature apparel lines</p>
              </div>
            </div>

            {/* Top Items Table */}
            <div className="bg-[#FAF9F5] border border-[#E3DDD1] p-6 space-y-4">
              <h3 className="font-serif text-xl text-[#1A1918]">Inventory &amp; Stock Health</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#DDD5C6] text-[#7A7367] uppercase tracking-wider text-[11px]">
                      <th className="py-2.5">Silhouette</th>
                      <th className="py-2.5">Category</th>
                      <th className="py-2.5">Remaining Stock</th>
                      <th className="py-2.5">Retail Price</th>
                      <th className="py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE4D8]">
                    {products.map(p => (
                      <tr key={p.id}>
                        <td className="py-3 font-medium text-[#1A1918]">{p.name}</td>
                        <td className="py-3 capitalize text-[#575046]">{p.category.replace('-', ' ')}</td>
                        <td className="py-3 font-semibold">{p.stock} units</td>
                        <td className="py-3">₹{(p.discountedPrice || p.price).toLocaleString('en-IN')}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold ${p.stock <= 10 ? 'bg-[#FAF0F0] text-[#C53030]' : 'bg-[#EBF2EC] text-[#3B6E47]'}`}>
                            {p.stock <= 10 ? 'Low Stock' : 'Healthy'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: STORE SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-[#FAF9F5] border border-[#E3DDD1] p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-serif text-[#1A1918]">Store Configuration &amp; Policies</h2>
              <p className="text-xs text-[#7A7367] mt-1">Configure customer announcements, shipping thresholds, and official support email.</p>
            </div>

            {settingsSaved && (
              <div className="p-3 bg-[#EBF2EC] border border-[#D5E5D8] text-xs text-[#3B6E47] flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Store policies updated successfully.</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-wider text-[#544E45]">Official Customer Support Email</label>
                <input
                  type="email"
                  value={supportEmailState}
                  onChange={(e) => setSupportEmailState(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C6] font-mono text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-wider text-[#544E45]">Announcement Banner Text</label>
                <input
                  type="text"
                  value={storeAnnouncement}
                  onChange={(e) => setStoreAnnouncement(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C6] text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[#544E45]">Free Shipping Threshold (₹)</label>
                  <input
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#DDD5C6] text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[#544E45]">Standard Shipping Fee (₹)</label>
                  <input
                    type="number"
                    defaultValue={149}
                    className="w-full p-2.5 bg-white border border-[#DDD5C6] text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAE4D8]">
                <button
                  type="button"
                  onClick={() => {
                    setSettingsSaved(true);
                    setTimeout(() => setSettingsSaved(false), 3000);
                  }}
                  className="px-6 py-3 bg-[#1A1918] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold hover:bg-[#33312E]"
                >
                  Save Store Configurations
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF9F5] border border-[#E3DDD1] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE4D8]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8C8375] font-semibold">Catalog Editor</span>
                <h3 className="font-serif text-2xl text-[#1A1918]">
                  {editingProduct ? 'Edit Product' : 'Add New Fashion Silhouette'}
                </h3>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-[#8C8477] hover:text-[#1A1918]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 pt-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-wider text-[#544E45]">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavyweight Signature Oversized Tee"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C6] text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[#544E45]">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-[#DDD5C6] text-xs focus:outline-none"
                  >
                    <option value="oversized-t-shirts">Oversized T-Shirts</option>
                    <option value="waffle-t-shirts">Waffle T-Shirts</option>
                    <option value="sweatshirts">Sweatshirts</option>
                    <option value="essentials">Essentials</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[#544E45]">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#DDD5C6] text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[#544E45]">Original Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#DDD5C6] text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[#544E45]">Discounted Price (₹)</label>
                  <input
                    type="number"
                    value={prodDiscountedPrice}
                    onChange={(e) => setProdDiscountedPrice(Number(e.target.value))}
                    placeholder="Leave empty if no discount"
                    className="w-full p-2.5 bg-white border border-[#DDD5C6] text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-wider text-[#544E45]">Product Description *</label>
                <textarea
                  required
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Fabric composition, silhouette, drop details..."
                  className="w-full p-2.5 bg-white border border-[#DDD5C6] text-xs focus:outline-none"
                />
              </div>

              {/* Sizes Selection */}
              <div className="space-y-1.5">
                <label className="font-semibold uppercase tracking-wider text-[#544E45]">Available Sizes</label>
                <div className="flex gap-2">
                  {(['S', 'M', 'L', 'XL', 'XXL'] as ProductSize[]).map((s) => {
                    const checked = prodSizes.includes(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => {
                          if (checked) {
                            setProdSizes(prodSizes.filter(x => x !== s));
                          } else {
                            setProdSizes([...prodSizes, s]);
                          }
                        }}
                        className={`w-9 h-9 border text-xs font-semibold uppercase ${
                          checked ? 'bg-[#1A1918] text-[#FAF9F5] border-[#1A1918]' : 'bg-white border-[#DDD5C6] text-[#7A7367]'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Multiple Image URLs & File Upload */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="font-semibold uppercase tracking-wider text-[#544E45]">Product Images (Multiple Angles)</label>
                  <button
                    type="button"
                    onClick={() => setProdImages([...prodImages, ''])}
                    className="text-[#8C6D45] text-xs uppercase hover:underline font-semibold"
                  >
                    + Add Another Image Slot
                  </button>
                </div>
                {prodImages.map((img, idx) => (
                  <div key={idx} className="p-2.5 bg-[#F6F3EC] border border-[#DDD5C6] space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Image URL (or use Upload button on the right)"
                        value={img}
                        onChange={(e) => {
                          const copy = [...prodImages];
                          copy[idx] = e.target.value;
                          setProdImages(copy);
                        }}
                        className="flex-1 p-2 bg-white border border-[#DDD5C6] text-xs focus:outline-none font-mono"
                      />
                      
                      <label className="cursor-pointer px-3 py-2 bg-[#1A1918] hover:bg-[#33312E] text-[#FAF9F5] text-xs flex items-center gap-1.5 shrink-0">
                        <Upload className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (reader.result) {
                                  const copy = [...prodImages];
                                  copy[idx] = reader.result as string;
                                  setProdImages(copy);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {prodImages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setProdImages(prodImages.filter((_, i) => i !== idx))}
                          className="p-2 text-red-500 hover:text-red-700 bg-white border border-[#DDD5C6]"
                          title="Remove image slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {img && (
                      <div className="flex items-center gap-3">
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="w-12 h-14 object-cover border border-[#DDD5C6] bg-white"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/200x250/262320/FAF9F5?text=Preview';
                          }}
                        />
                        <span className="text-[11px] text-[#7A7367]">Preview for Angle #{idx + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Badges and Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsFeatured}
                    onChange={(e) => setProdIsFeatured(e.target.checked)}
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsBestseller}
                    onChange={(e) => setProdIsBestseller(e.target.checked)}
                  />
                  <span>Mark as Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsActive}
                    onChange={(e) => setProdIsActive(e.target.checked)}
                  />
                  <span>Active (Live on Website)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#EAE4D8] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 border border-[#DDD5C6] text-xs uppercase tracking-wider font-semibold hover:bg-[#F2ECE1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1A1918] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold hover:bg-[#33312E]"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DISPATCH / ADD COURIER TRACKING */}
      {/* ========================================================================= */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF9F5] border border-[#E3DDD1] w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#EAE4D8]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8C8375] font-semibold">Logistics Dispatch</span>
                <h3 className="font-serif text-xl text-[#1A1918]">Add Tracking Info</h3>
              </div>
              <button onClick={() => setTrackingModalOrder(null)} className="text-[#8C8477]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1">
              <p><strong>Order:</strong> {trackingModalOrder.orderNumber}</p>
              <p><strong>Customer:</strong> {trackingModalOrder.customerName} (+91 {trackingModalOrder.phone})</p>
              <p><strong>Destination:</strong> {trackingModalOrder.city}, {trackingModalOrder.state} ({trackingModalOrder.pincode})</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-wider text-[#544E45]">Courier Partner</label>
                <select
                  value={newTrackingCarrier}
                  onChange={(e) => setNewTrackingCarrier(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C6] focus:outline-none"
                >
                  <option value="Delhivery Express">Delhivery Express</option>
                  <option value="Blue Dart Express">Blue Dart Express</option>
                  <option value="DTDC Surface">DTDC Courier</option>
                  <option value="Shiprocket">Shiprocket Prime</option>
                  <option value="India Post Speed Post">India Post Speed Post</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-wider text-[#544E45]">AWB / Tracking Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DEL123456789IN"
                  value={newTrackingNumber}
                  onChange={(e) => setNewTrackingNumber(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DDD5C6] font-mono text-sm focus:outline-none"
                />
              </div>

              <button
                onClick={handleSaveTracking}
                disabled={!newTrackingNumber.trim()}
                className="w-full py-3 bg-[#1A1918] hover:bg-[#33312E] disabled:bg-[#8C857B] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold"
              >
                Mark as Shipped &amp; Attach AWB
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INSPECT ORDER DETAILS */}
      {/* ========================================================================= */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF9F5] border border-[#E3DDD1] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-start pb-4 border-b border-[#EAE4D8]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8C8375] font-semibold">Order Inspector</span>
                <h3 className="font-serif text-2xl text-[#1A1918]">{inspectingOrder.orderNumber}</h3>
                <p className="text-xs text-[#7A7367]">
                  Placed {new Date(inspectingOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button onClick={() => setInspectingOrder(null)} className="text-[#8C8477]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Change Control */}
            <div className="bg-[#F2ECE1] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[#696256] uppercase font-semibold block">Change Order Status:</span>
                <span className="font-bold text-[#1A1918]">Current: {inspectingOrder.orderStatus}</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={inspectingOrder.orderStatus}
                  onChange={(e) => handleUpdateStatus(inspectingOrder.id, e.target.value as OrderStatus)}
                  className="bg-white border border-[#DDD5C6] px-3 py-1.5 font-semibold text-xs uppercase"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            {/* Recipient info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white p-4 border border-[#EAE4D8]">
              <div>
                <h4 className="font-semibold uppercase tracking-wider text-[#1A1918] mb-1">Customer Details</h4>
                <p className="text-sm font-medium">{inspectingOrder.customerName}</p>
                <p className="text-[#666055] mt-0.5">Phone: +91 {inspectingOrder.phone}</p>
                {inspectingOrder.email && <p className="text-[#666055]">Email: {inspectingOrder.email}</p>}
                {inspectingOrder.orderNotes && (
                  <p className="mt-2 text-[#967746] bg-[#FEF9E7] p-2 border border-[#EAE0C5]">
                    Note: "{inspectingOrder.orderNotes}"
                  </p>
                )}
              </div>
              <div>
                <h4 className="font-semibold uppercase tracking-wider text-[#1A1918] mb-1">Shipping Destination</h4>
                <p className="text-[#666055] leading-relaxed">{inspectingOrder.address}</p>
                <p className="font-medium mt-1">{inspectingOrder.city}, {inspectingOrder.state} - {inspectingOrder.pincode}</p>
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-3">
              <h4 className="font-serif text-lg text-[#1A1918]">Order Items</h4>
              <div className="divide-y divide-[#EAE4D8] border-y border-[#EAE4D8]">
                {inspectingOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-12 object-cover bg-[#EAE5DC]" />
                      <div>
                        <p className="font-medium text-[#1A1918]">{item.name}</p>
                        <p className="text-[#7A7367]">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="font-semibold text-[#1A1918]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-sm font-bold pt-2">
                <span>Total Cash to Collect (COD):</span>
                <span>₹{inspectingOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setInspectingOrder(null)}
                className="px-5 py-2 bg-[#1A1918] text-[#FAF9F5] text-xs uppercase tracking-wider"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
