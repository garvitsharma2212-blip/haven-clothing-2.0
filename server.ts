import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory & cached notification store for orders
const orderNotifications: any[] = [];

// =========================================================================
// API: /api/notify-order (Dispatches COD Order details to havenclothingindia@gmail.com)
// =========================================================================
app.post('/api/notify-order', async (req, res) => {
  try {
    const order = req.body;
    if (!order || !order.orderNumber) {
      return res.status(400).json({ success: false, message: 'Invalid order payload' });
    }

    const targetEmail = process.env.ADMIN_NOTIFY_EMAIL || 'havenclothingindia@gmail.com';

    // Format item rows
    const itemsListText = (order.items || [])
      .map((item: any) => `• ${item.name} | Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity} | ₹${(item.price * item.quantity).toLocaleString('en-IN')}`)
      .join('\n');

    const itemsHtml = (order.items || [])
      .map((item: any) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #EAE5DB;">
            <strong style="color: #1A1918; font-size: 14px;">${item.name}</strong><br/>
            <span style="font-size: 12px; color: #706A5F;">Size: <strong>${item.size}</strong> &bull; Color: <strong>${item.color}</strong> &bull; Quantity: <strong>${item.quantity}</strong></span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #EAE5DB; text-align: right; font-weight: 600; color: #1A1918;">
            ₹${(item.price * item.quantity).toLocaleString('en-IN')}
          </td>
        </tr>
      `)
      .join('');

    // Luxury HTML Email Template
    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #FAF9F5; color: #1A1918; padding: 25px; border: 1px solid #E3DDD1; line-height: 1.5;">
        <div style="text-align: center; border-bottom: 2px solid #1A1918; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="letter-spacing: 5px; margin: 0; font-size: 28px; text-transform: uppercase; font-family: Georgia, serif; font-weight: 600;">HAVEN CLOTHING</h1>
          <p style="font-size: 11px; letter-spacing: 2px; color: #8C8375; margin: 6px 0 0 0; text-transform: uppercase;">New Cash On Delivery (COD) Order Notification</p>
        </div>

        <div style="background-color: #1A1918; color: #FAF9F5; padding: 18px 20px; border-radius: 4px; margin-bottom: 25px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td>
                <span style="font-size: 11px; text-transform: uppercase; color: #C5A880; letter-spacing: 1.5px; font-weight: 600;">Order ID</span><br/>
                <strong style="font-size: 20px; font-family: monospace; letter-spacing: 1px;">${order.orderNumber}</strong>
              </td>
              <td style="text-align: right;">
                <span style="font-size: 11px; text-transform: uppercase; color: #C5A880; letter-spacing: 1.5px; font-weight: 600;">COD Cash to Collect</span><br/>
                <strong style="font-size: 22px; color: #4ADE80;">₹${(order.totalAmount || 0).toLocaleString('en-IN')}</strong>
              </td>
            </tr>
          </table>
        </div>

        <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #6E665A; border-bottom: 1px solid #DDD5C6; padding-bottom: 8px; margin-bottom: 14px;">Customer & Doorstep Delivery Information</h3>
        <table style="width: 100%; font-size: 13px; margin-bottom: 25px; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #736C61; width: 140px;">Customer Name:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #1A1918;">${order.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #736C61;">Mobile Number:</td>
            <td style="padding: 6px 0;"><strong style="color: #1A1918; font-size: 15px;">+91 ${order.phone}</strong> <span style="font-size: 11px; color: #8C8375;">(Call for COD Confirmation)</span></td>
          </tr>
          ${order.email ? `
          <tr>
            <td style="padding: 6px 0; color: #736C61;">Customer Email:</td>
            <td style="padding: 6px 0;"><a href="mailto:${order.email}" style="color: #8C6D45;">${order.email}</a></td>
          </tr>` : ''}
          <tr>
            <td style="padding: 6px 0; color: #736C61;">Full Address:</td>
            <td style="padding: 6px 0; font-weight: 500;">${order.address}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #736C61;">City, State & PIN:</td>
            <td style="padding: 6px 0;"><strong>${order.city}, ${order.state} - ${order.pincode}</strong></td>
          </tr>
          ${order.orderNotes ? `
          <tr>
            <td style="padding: 6px 0; color: #736C61;">Customer Notes:</td>
            <td style="padding: 6px 0; color: #B45309; font-style: italic; background-color: #FEF9E7; padding: 6px 10px; border-left: 3px solid #D97706;">"${order.orderNotes}"</td>
          </tr>` : ''}
        </table>

        <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #6E665A; border-bottom: 1px solid #DDD5C6; padding-bottom: 8px; margin-bottom: 14px;">Ordered Apparel Pieces</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; background-color: #FFFFFF; border: 1px solid #EAE5DB;">
          <thead>
            <tr style="background-color: #F3EFE7; text-align: left; font-size: 11px; text-transform: uppercase; color: #6B6457;">
              <th style="padding: 10px 12px;">Silhouette Details</th>
              <th style="padding: 10px 12px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="background-color: #F4EFEB; padding: 16px 20px; border: 1px solid #DDD5C6; font-size: 13px; margin-bottom: 25px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #6B6457;">Subtotal:</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 500;">₹${(order.subtotal || 0).toLocaleString('en-IN')}</td>
            </tr>
            ${order.discountAmount ? `
            <tr>
              <td style="padding: 4px 0; color: #16A34A;">Welcome Discount:</td>
              <td style="padding: 4px 0; text-align: right; color: #16A34A; font-weight: 600;">-₹${order.discountAmount.toLocaleString('en-IN')}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 4px 0; color: #6B6457;">Shipping Fee:</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 500;">${order.shippingFee === 0 ? '<strong style="color: #16A34A;">FREE</strong>' : `₹${order.shippingFee}`}</td>
            </tr>
            <tr style="border-top: 1px solid #DDD5C6;">
              <td style="padding: 10px 0 0 0; font-size: 15px; font-weight: bold; color: #1A1918;">Cash to Collect (COD):</td>
              <td style="padding: 10px 0 0 0; text-align: right; font-size: 18px; font-weight: bold; color: #1A1918;">₹${(order.totalAmount || 0).toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #EBF2EC; border: 1px solid #D5E5D8; padding: 12px 15px; margin-bottom: 25px; text-align: center; font-size: 12px; color: #2B5336;">
          <strong>Action Required:</strong> Please verify customer's phone (+91 ${order.phone}) and pack items for courier dispatch within 24 hours.
        </div>

        <div style="font-size: 11px; color: #8C8375; text-align: center; border-top: 1px solid #E3DDD1; padding-top: 15px;">
          <strong>HAVEN CLOTHING</strong> &bull; Founded by Garvit Sharma &amp; Ankit Meena<br/>
          Atelier: Jaipur &amp; New Delhi, India &bull; Support: <a href="mailto:havenclothingindia@gmail.com" style="color: #8C6D45;">havenclothingindia@gmail.com</a>
        </div>
      </div>
    `;

    // Record notification in server log
    const notificationRecord = {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      phone: order.phone,
      totalAmount: order.totalAmount,
      itemsSummary: itemsListText,
      targetEmail,
      timestamp: new Date().toISOString()
    };
    orderNotifications.unshift(notificationRecord);

    let emailSent = false;
    let dispatchStatus = '';

    // If SMTP credentials configured in .env (e.g. Gmail App Password)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: Number(process.env.SMTP_PORT) || 465,
          secure: (process.env.SMTP_PORT === '465' || !process.env.SMTP_PORT),
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        await transporter.sendMail({
          from: `"HAVEN CLOTHING" <${process.env.SMTP_USER}>`,
          to: targetEmail,
          subject: `🚨 NEW COD ORDER: ${order.orderNumber} - ₹${order.totalAmount} (${order.customerName})`,
          text: `NEW COD ORDER RECEIVED:\nOrder ID: ${order.orderNumber}\nCustomer: ${order.customerName}\nPhone: +91 ${order.phone}\nAddress: ${order.address}, ${order.city}, ${order.state} - ${order.pincode}\nTotal Amount to Collect: ₹${order.totalAmount}\n\nItems:\n${itemsListText}`,
          html: emailHtml
        });

        emailSent = true;
        dispatchStatus = `Email notification delivered to ${targetEmail} via SMTP.`;
        console.log(`[Email Dispatched] Order ${order.orderNumber} sent to ${targetEmail}`);
      } catch (smtpErr: any) {
        console.warn('[SMTP Notice]', smtpErr.message);
        dispatchStatus = `SMTP notice: ${smtpErr.message}. Notification safely stored in dashboard log.`;
      }
    } else {
      console.log(`[Order Alert] New COD Order ${order.orderNumber} for ₹${order.totalAmount}. Destination: ${targetEmail}`);
      dispatchStatus = `Notification successfully logged and prepared for ${targetEmail}. (Add SMTP_USER and SMTP_PASS to .env to connect your live Gmail account).`;
    }

    return res.json({
      success: true,
      emailSent,
      targetEmail,
      message: dispatchStatus,
      orderNumber: order.orderNumber,
      notification: notificationRecord
    });
  } catch (error: any) {
    console.error('Error handling order notification:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// API: /api/order-notifications (Get notification records for admin dashboard)
app.get('/api/order-notifications', (req, res) => {
  return res.json({ success: true, notifications: orderNotifications });
});

// =========================================================================
// Vite Middleware / Static Serve
// =========================================================================
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  const vite = await createViteServer({
    server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
    appType: 'spa'
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`HAVEN CLOTHING server running on port ${PORT}`);
});
