import { jsPDF } from 'jspdf';

export const generateReceipt = (payment, residentName) => {
  const doc = new jsPDF();
  const receiptNo = payment.receiptNumber || `RCP-${Date.now()}`;

  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('SocietySync', 20, 25);
  doc.setFontSize(10);
  doc.text('Maintenance Payment Receipt', 20, 33);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  let y = 55;
  const addLine = (label, value) => {
    doc.setFont(undefined, 'bold');
    doc.text(`${label}:`, 20, y);
    doc.setFont(undefined, 'normal');
    doc.text(String(value), 70, y);
    y += 12;
  };

  addLine('Receipt No', receiptNo);
  addLine('Resident', residentName || 'N/A');
  addLine('Flat Number', payment.flatNumber);
  addLine('Month', `${payment.month} ${payment.year}`);
  addLine('Amount', `Rs. ${payment.amount}`);
  if (payment.fine > 0) addLine('Late Fee', `Rs. ${payment.fine}`);
  addLine('Total Paid', `Rs. ${payment.totalAmount}`);
  addLine('Payment Mode', payment.paymentMode || 'N/A');
  addLine('Paid Date', payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : new Date().toLocaleDateString());
  addLine('Status', payment.status);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Thank you for your payment. This is a computer-generated receipt.', 20, 270);

  doc.save(`receipt-${payment.flatNumber}-${payment.month}.pdf`);
};
