import React, { useState } from 'react';

const CustomerOrderForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    deliveryMethod: 'standard',
    product: '',
    quantity: 1,
    price: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you could send the data to an API or process it
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      deliveryMethod: 'standard',
      product: '',
      quantity: 1,
      price: '',
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Customer Order Form</h2>

      <label>Name</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} required />

      <label>Email</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} required />

      <label>Phone</label>
      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />

      <label>Address</label>
      <input type="text" name="address" value={formData.address} onChange={handleChange} />

      <label>Delivery Method</label>
      <select name="deliveryMethod" value={formData.deliveryMethod} onChange={handleChange}>
        <option value="standard">Standard</option>
        <option value="express">Express</option>
        <option value="pickup">Store Pickup</option>
      </select>

      <label>Product</label>
      <input type="text" name="product" value={formData.product} onChange={handleChange} required />

      <label>Quantity</label>
      <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" required />

      <label>Price ($)</label>
      <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" required />

      <label>Additional Notes</label>
      <textarea name="notes" value={formData.notes} onChange={handleChange} />

      <button type="submit">Submit Order</button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: '500px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  }
};

export default CustomerOrderForm;
