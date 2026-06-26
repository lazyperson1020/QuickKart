interface InvoiceItem {
  name: string;
  weight?: string;
  quantity: number;
  price: number;
  originalPrice?: number;
}

interface InvoiceData {
  orderId: string;
  dateString: string;
  paymentMethod: string;
  addressLabel?: string;
  fullAddress?: string;
  items: InvoiceItem[];
  itemTotal: number;
  deliveryFee: number;
  tipAmount?: number;
  totalAmount: number;
  couponCode?: string;
  discountAmount?: number;
}

export function buildInvoiceHtml(order: InvoiceData): string {
  const itemRows = order.items
    .map((item, i) => {
      // Clean up pricing math for line items using only existing fields
      const unitPrice = item.price;
      const totalLinePrice = item.price * item.quantity;
      const strikePrice = item.originalPrice && item.originalPrice > item.price
        ? `<span style="text-decoration:line-through;color:#999;font-size:11px;margin-right:4px;">&#8377;${(item.originalPrice).toFixed(2)}</span>`
        : '';

      return `
      <tr style="border-bottom: 1px dashed #e0e0e0;">
        <td style="padding: 12px 8px; text-align: center; color: #666; font-size: 12px; vertical-align: top;">${i + 1}</td>
        <td style="padding: 12px 8px; vertical-align: top;">
          <div style="font-weight: 600; color: #111; font-size: 13px;">${item.name}</div>
          <div style="font-size: 11px; color: #666; margin-top: 2px;">${item.weight ?? ''}</div>
        </td>
        <td style="padding: 12px 8px; text-align: center; color: #333; font-size: 13px; vertical-align: top;">${item.quantity}</td>
        <td style="padding: 12px 8px; text-align: right; color: #333; font-size: 13px; vertical-align: top;">
          ${strikePrice}&#8377;${unitPrice.toFixed(2)}
        </td>
        <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #111; font-size: 13px; vertical-align: top;">
          &#8377;${totalLinePrice.toFixed(2)}
        </td>
      </tr>`;
    })
    .join('');

  // Delivery Fee Row Styling
  const deliveryRow =
    order.deliveryFee > 0
      ? `<tr>
          <td style="padding: 6px 0; color: #555; font-size: 13px;">Delivery Fee</td>
          <td style="padding: 6px 0; text-align: right; color: #333; font-size: 13px;">&#8377;${order.deliveryFee.toFixed(2)}</td>
        </tr>`
      : `<tr>
          <td style="padding: 6px 0; color: #10b981; font-size: 13px; font-weight: 600;">Delivery Fee</td>
          <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #10b981; font-size: 13px;">FREE</td>
        </tr>`;

  // Optional Tip Row
  const tipRow =
    order.tipAmount && order.tipAmount > 0
      ? `<tr>
          <td style="padding: 6px 0; color: #555; font-size: 13px;">Delivery Tip</td>
          <td style="padding: 6px 0; text-align: right; color: #333; font-size: 13px;">&#8377;${order.tipAmount.toFixed(2)}</td>
        </tr>`
      : '';

  // Optional Coupon Row
  const couponRow =
    order.couponCode && order.discountAmount
      ? `<tr>
          <td style="padding: 6px 0; color: #10b981; font-size: 13px;">Coupon Discount (${order.couponCode})</td>
          <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #10b981; font-size: 13px;">-&#8377;${order.discountAmount.toFixed(2)}</td>
        </tr>`
      : '';

  const paymentLabel =
    order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>QuickKart Invoice</title>
</head>
<body style="margin: 0; padding: 20px; background: #f9f9f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  
  <div style="max-width: 650px; margin: 0 auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">

    <div style="background: #fff; padding: 24px 24px 16px; border-bottom: 1px solid #f1f5f9;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td>
            <div style="font-size: 26px; font-weight: 900; color: #FF3269; letter-spacing: -0.5px;">QuickKart</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px; text-transform: uppercase; letter-spacing: 1px;">Fast Grocery Delivery</div>
          </td>
          <td style="text-align: right; vertical-align: top;">
            <div style="background: #f1f5f9; color: #334155; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 6px; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px;">
              Tax Invoice / Bill of Supply [cite: 5]
            </div>
          </td>
        </tr>
      </table>
    </div>

    <div style="padding: 20px 24px; background: #fafafa; border-bottom: 1px solid #f1f5f9;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 50%; vertical-align: top; padding-right: 20px;">
            <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Invoice Details [cite: 8]</p>
            <p style="margin: 0 0 4px; font-size: 13px; color: #334155;"><span style="color: #64748b;">Order ID:</span> <span style="font-weight: 700; color: #0f172a;">#${order.orderId.toUpperCase()}</span></p>
            <p style="margin: 0 0 4px; font-size: 13px; color: #334155;"><span style="color: #64748b;">Date:</span> <span style="color: #0f172a;">${order.dateString}</span></p>
            <p style="margin: 0; font-size: 13px; color: #334155;"><span style="color: #64748b;">Payment:</span> <span style="color: #0f172a;">${paymentLabel}</span></p>
          </td>
          <td style="width: 50%; vertical-align: top; padding-left: 20px; border-left: 1px solid #e2e8f0;">
            <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Deliver To [cite: 8, 13]</p>
            <p style="margin: 0 0 4px; font-size: 13px; font-weight: 700; color: #0f172a;">${order.addressLabel ?? 'Home'}</p>
            <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">${order.fullAddress ?? ''}</p>
          </td>
        </tr>
      </table>
    </div>

    <div style="padding: 24px 24px 12px;">
      <p style="margin: 0 0 14px; font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Items Ordered</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #0f172a;">
            <th style="padding: 8px 8px; text-align: center; font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; width: 40px;">#</th>
            <th style="padding: 8px 8px; text-align: left; font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;">Item Description [cite: 15]</th>
            <th style="padding: 8px 8px; text-align: center; font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; width: 50px;">Qty [cite: 15]</th>
            <th style="padding: 8px 8px; text-align: right; font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; width: 90px;">Rate</th>
            <th style="padding: 8px 8px; text-align: right; font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; width: 100px;">Amount [cite: 15]</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>
    </div>

    <div style="padding: 12px 24px 28px; display: flex; justify-content: flex-end;">
      <table style="width: 280px; border-collapse: collapse; margin-left: auto;">
        <tr>
          <td colspan="2" style="padding: 0 0 8px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0;">
            Bill Summary
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0 4px; color: #555; font-size: 13px;">Item Total [cite: 16]</td>
          <td style="padding: 8px 0 4px; text-align: right; color: #333; font-size: 13px;">&#8377;${order.itemTotal.toFixed(2)}</td>
        </tr>
        ${deliveryRow}
        ${tipRow}
        ${couponRow}
        <tr style="border-top: 1px solid #0f172a;">
          <td style="padding: 12px 0 0; font-weight: 800; font-size: 15px; color: #0f172a;">To Pay</td>
          <td style="padding: 12px 0 0; text-align: right; font-weight: 800; font-size: 16px; color: #FF3269;">&#8377;${order.totalAmount.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #f1f5f9;">
      <p style="margin: 0 0 4px; font-size: 13px; font-weight: 600; color: #334155;">Thank you for shopping with QuickKart!</p>
      <p style="margin: 0; font-size: 11px; color: #94a3b8;">This is a computer-generated invoice and does not require a physical signature.</p>
    </div>

  </div>
</body>
</html>`;
}