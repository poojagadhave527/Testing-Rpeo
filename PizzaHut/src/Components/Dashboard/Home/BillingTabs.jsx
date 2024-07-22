import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactDOMServer from 'react-dom/server';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './Billingtab.css';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import PrintBill from './Print';

const BillingTabs = ({ tabs, activeIndex, onSelect, handleDeleteTab, handleDeleteItemFromCart, handleQuantityChange, triggerMessage }) => {
  const [paymentMode, setPaymentMode] = useState('Not Selected');
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [tax, setTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    const calculateValues = () => {
      const total = calculateTotal(tabs[activeIndex].items);
      const discount = calculateDiscountAmount(total, discountPercentage);
      const netTotal = total - discount;
      const taxValue = calculateTax(netTotal);
      const totalWithTax = netTotal + taxValue;

      setTotalAmount(total);
      setDiscountAmount(discount);
      setTax(taxValue);
      setGrandTotal(totalWithTax);
    };

    calculateValues();
  }, [tabs, activeIndex, discountPercentage]);

  const handleContactChange = (event) => {
    const { value } = event.target;
    if (/^\d*$/.test(value)) {
      setContactNumber(value);
      triggerMessage('');
    } else {
      triggerMessage('Please enter a valid number');
    }
  };

  const handleBlur = () => {
    if (contactNumber.length !== 10) {
      triggerMessage('Mobile number must be exactly 10 digits', 'error');
    } else {
      triggerMessage('');
    }
  };

  const handleDiscountChange = (event) => {
    const { value } = event.target;
    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue)) {
      setDiscountPercentage(parsedValue);
    } else {
      setDiscountPercentage(0); // Set discount to 0 if input is not a valid number
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const calculateDiscountAmount = (total, discountPercentage) => {
    return (total * discountPercentage) / 100;
  };

  const calculateTax = (netTotal) => {
    // Example tax calculation (adjust based on your tax rules)
    return (netTotal * 18) / 100;
  };

  const handlePayment = async (tab, event) => {
    event.preventDefault();
    handleBlur();

    const customerDetails = {
      name: customerName,
      contactNumber: contactNumber,
    };

    try {
      const response = await axios.post('http://localhost:4000/customers', customerDetails);
      const customerId = response.data._id;

     
      const billingDetails = {
        customerId,
        items: tab.items,
        paymentMode,
        totalAmount,
        discountAmount,
        tax,
        netTotal: totalAmount-discountAmount,
        totalWithTax:grandTotal,
      };

      const response2 = await axios.post('http://localhost:4000/billings', billingDetails);
      if (response2.status === 201) {
        console.log(response2);
        triggerMessage('Details saved, printing...', 'success');
      }
    } catch (err) {
      console.log(err);
      triggerMessage('Error saving bill record', 'error');
    }

    const billDetails = {
      tabId: tab.id,
      items: tab.items,
      paymentMode,
      customerName: customerDetails.name,
      contactNumber: customerDetails.contactNumber,
      totalAmount,
      discountAmount,
      tax,
      netTotal: totalAmount-discountAmount,
      grandTotal
    };

    const printWindow = window.open('', '_blank');
    const printContent = ReactDOMServer.renderToString(<PrintBill billDetails={billDetails} />);

    printWindow.document.write(`
      <html>
        <head>
          <title>Bill Details</title>
          <style>
            /* Add your styles here */
          </style>
        </head>
        <body>${printContent}</body>
        <script>
          window.print();
          window.onafterprint = function() { window.close(); };
        </script>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Tabs selectedIndex={activeIndex} onSelect={onSelect}>
      <TabList className='billingTabsList'>
        {tabs.map((tab) => (
          <Tab key={tab.id}>
            Bill {tab.id}
            <button className='tabCloseButton' onClick={(e) => { e.stopPropagation(); handleDeleteTab(tab.id); }}>x</button>
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab.id}>
          <div className="billing-cart">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Remove</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {tab.items.length > 0 ? (
                  <>
                    {tab.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.price.toFixed(2)}</td>
                        <td>
                          <IconButton onClick={() => handleDeleteItemFromCart(tab.id, item._id)}>
                            <DeleteIcon className="deleteIcon" />
                          </IconButton>
                        </td>
                        <td>
                          <IconButton className='quantityIncrDecrIcons' onClick={() => handleQuantityChange(tab.id, item._id, -1)} disabled={item.quantity === 0}>
                            <RemoveIcon />
                          </IconButton>
                          {item.quantity}
                          <IconButton className='quantityIncrDecrIcons' onClick={() => handleQuantityChange(tab.id, item._id, 1)}>
                            <AddIcon />
                          </IconButton>
                        </td>
                        <td>{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={5}><h5>No items in cart</h5></td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className='positionButtonsOfPayment'>
              <form onSubmit={(e) => handlePayment(tab, e)}>
                <div className="row">
                  <div className="col-md-4">
                    <input
                      className='customerDetailsInput'
                      type="text"
                      placeholder="Customer Name"
                      value={customerName}
                      required
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <input
                      className='customerDetailsInput'
                      type="text"
                      placeholder="Contact Number"
                      value={contactNumber}
                      onBlur={handleBlur}
                      maxLength={10}
                      onChange={handleContactChange}
                      required
                    />
                    <input
                      type="number"
                      placeholder='Discount in %'
                      className='customerDetailsInput'
                      value={discountPercentage === 0 ? '' : discountPercentage} // Display empty string if discount is 0
                      onChange={handleDiscountChange}
                    />
                    <h6>Payment Mode: {paymentMode}</h6>
                  </div>
                  <div className="col-md-8">
                    <table>
                      <tbody>
                        <tr>
                          <th>Total</th>
                          <td>{totalAmount.toFixed(2)} Rs</td>
                        </tr>
                        <tr>
                          <th>Discount</th>
                          <td>{discountAmount.toFixed(2)} Rs</td>
                        </tr>
                        <tr>
                          <th>Tax (18%)</th>
                          <td>{tax.toFixed(2)} Rs</td>
                        </tr>
                        <tr>
                          <th>Net Total</th>
                          <td>{(totalAmount - discountAmount).toFixed(2)} Rs</td>
                        </tr>
                        <tr>
                          <th>Total Amount to Pay</th>
                          <td>{grandTotal.toFixed(2)} Rs</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                      <button type='button' onClick={() => setPaymentMode('Cash')} className='paymentModeBtn'>Cash</button>
                  </div>
                  <div className="col-md-4">
                    <button type='button' onClick={() => setPaymentMode('UPI')} className='paymentModeBtn'>UPI</button>
                  </div>
                  <div className="col-md-4">
                    <button type='submit' className='paymentModeBtn'>Pay</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </TabPanel>
      ))}
    </Tabs>
  );
};

export default BillingTabs;
