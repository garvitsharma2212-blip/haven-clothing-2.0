# HAVEN CLOTHING - Firestore Security Specification

## 1. Data Invariants
1. Products catalog is publicly readable by shoppers, but only authenticated Admins (e.g. havenclothingindia@gmail.com or registered adminUsers) can create, update, or delete products.
2. Orders can be placed by any shopper via Cash on Delivery with strict structural validation:
   - `paymentMethod` must strictly be `"COD"`
   - `paymentStatus` must strictly start as `"PENDING"`
   - `orderStatus` must strictly start as `"NEW"`
   - Required fields (`orderNumber`, `customerName`, `phone`, `address`, `city`, `state`, `pincode`, `items`, `totalAmount`) must be non-empty and within bounded character limits.
3. Only Admins can modify an existing order's status (e.g., to `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`) or attach tracking details.
4. Settings and Categories are publicly readable and writable only by Admins.
5. Admin status is guarded by verifying email authentication (`havenclothingindia@gmail.com`) or membership in `/adminUsers/{uid}`.

## 2. The Dirty Dozen Payloads (Audit Vectors)
1. **Unauthenticated Product Injection**: A guest attempts `setDoc` on `/products/fake1`.
2. **Order Status Tamper on Create**: A customer tries placing an order with `orderStatus: "DELIVERED"` to fake completed delivery.
3. **Payment Method Forgery**: A customer sends `paymentStatus: "PAID"` without administrative review.
4. **Huge Payload Overflow**: A malicious client sends an order with a 50,000-character address.
5. **Ghost Field Poisoning**: Inserting unknown arbitrary privileged keys into a product or category document.
6. **Order Tamper by Non-Admin**: A guest tries updating an order to cancel it or alter the shipping address after placement.
7. **Admin Privilege Escalation**: A regular user tries writing their UID into `/adminUsers/` without authorization.
8. **Negative Total Amount**: Creating an order with `totalAmount: -500`.
9. **Malformed Order Number**: Injecting raw script tags or invalid patterns in the order ID.
10. **Product Price Deflation Attack**: Guest attempting to update product price from ₹1,499 to ₹1.
11. **Settings Tamper Attack**: Unauthenticated user trying to disable shipping fees or modify store support email.
12. **Blanket Query Scraping**: Malicious client attempting to scrape private customer addresses without admin privileges.
