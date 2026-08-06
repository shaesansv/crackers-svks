import { jsPDF } from 'jspdf';

export const generateOrderReceiptPDF = (orderData: any) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [15, 76, 129];
  const secondaryColor = [212, 175, 55];
  const textColor = [51, 51, 51];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(orderData.siteName || 'Sarguru Crackers', 15, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(orderData.siteAddress || 'Sivakasi, Tamil Nadu', 15, 26);
  doc.text(`Phone: ${orderData.sitePhone || ''} | Email: ${orderData.siteEmail || ''}`, 15, 31);

  doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(15, 36, 195, 36);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('TAX INVOICE', 15, 45);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(`Order Number: ${orderData.orderNumber}`, 15, 52);
  doc.text(`Order Date: ${orderData.date}`, 15, 57);

  const rightColumnX = 120;
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', rightColumnX, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${orderData.customerName}`, rightColumnX, 50);
  doc.text(`Phone: ${orderData.customerPhone || ''}`, rightColumnX, 55);
  doc.text(`Email: ${orderData.customerEmail || ''}`, rightColumnX, 60);
  doc.text(`Address: ${orderData.deliveryAddress || ''}`, rightColumnX, 65, { maxWidth: 75 });

  const tableTopY = 80;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(15, tableTopY, 180, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('S.No', 17, tableTopY + 5.5);
  doc.text('Item Description', 28, tableTopY + 5.5);
  doc.text('Price (INR)', 105, tableTopY + 5.5);
  doc.text('Qty', 135, tableTopY + 5.5);
  doc.text('Net Rate (INR)', 150, tableTopY + 5.5);
  doc.text('Total (INR)', 175, tableTopY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  let currentY = tableTopY + 8;

  orderData.items.forEach((item: any, index: number) => {
    if (index % 2 === 1) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, currentY, 180, 7, 'F');
    }

    doc.text(String(index + 1), 17, currentY + 5);
    
    const itemName = item.productName || 'Cracker Item';
    const truncatedName = itemName.length > 32 ? itemName.substring(0, 32) + '...' : itemName;
    doc.text(truncatedName, 28, currentY + 5);

    const price = item.originalPrice || item.price || 0;
    doc.text(`Rs.${price}`, 105, currentY + 5);
    doc.text(String(item.quantity), 137, currentY + 5);

    const netRate = item.displayNetRate ? (item.netRate || price) : (price * (1 - (orderData.discountPercent || 80) / 100));
    doc.text(`Rs.${netRate.toFixed(2)}`, 150, currentY + 5);

    const itemTotal = netRate * item.quantity;
    doc.text(`Rs.${itemTotal.toFixed(2)}`, 175, currentY + 5);

    currentY += 7;

    if (currentY > 265) {
      doc.addPage();
      currentY = 20;
    }
  });

  const totalsY = currentY + 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, totalsY - 2, 195, totalsY - 2);

  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', 130, totalsY + 2);
  doc.text(`Rs.${Number(orderData.subtotal).toFixed(2)}`, 175, totalsY + 2);

  doc.text('Packing Charge (3%):', 130, totalsY + 7);
  doc.text(`Rs.${Number(orderData.packingCharge).toFixed(2)}`, 175, totalsY + 7);

  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total:', 130, totalsY + 13);
  doc.text(`Rs.${Number(orderData.total).toFixed(2)}`, 175, totalsY + 13);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Thank you for your business! This is a computer-generated invoice receipt.', 15, totalsY + 25);

  doc.save(`invoice_${orderData.orderNumber}.pdf`);
};
