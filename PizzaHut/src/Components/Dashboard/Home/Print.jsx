import React from 'react';
import './print.css';

const PrintBill = ({ billDetails }) => {
  const { items, paymentMode, customerName, contactNumber, totalAmount, discountAmount, tax, netTotal, grandTotal } = billDetails;

  return (
    <div id="print-container">
      <h1>King PizzaHut</h1>
      <h2 id="payment-mode">Payment Mode: {paymentMode}</h2>
      {customerName && <h3 id="customer-name">Customer Name: {customerName}</h3>}
      {contactNumber && <h3 id="contact-number">Contact Number: {contactNumber}</h3>}
      <table id="bill-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.price.toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="3"><strong>Total:</strong></td>
            <td id="total-amount">{totalAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="3"><strong>Discount:</strong></td>
            <td id="discount-amount">{discountAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="3"><strong>Tax:</strong></td>
            <td id="tax-amount">{tax.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="3"><strong>Net Total:</strong></td>
            <td id="net-total">{netTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="3"><strong>Grand Total:</strong></td>
            <td id="grand-total">{grandTotal.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PrintBill;
