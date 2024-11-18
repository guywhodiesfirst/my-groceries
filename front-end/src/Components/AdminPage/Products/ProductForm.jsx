import { useState } from 'react';
import './ProductForm.css';
import { ProductsApi } from '../../../api/ProductsApi.js';

const ProductForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    category: '',
    ...initialData,
  });

  const handleChange = ({ target: { name, value } }) => {
    if (name === 'price') {
      value = parseFloat(value);
    } else if (name === 'quantity') {
      value = parseInt(value, 10);
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (initialData) {
      await ProductsApi.updateProduct(formData);
    } else {
      await ProductsApi.createProduct(formData);
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h1>{initialData ? `Editing product with ID: ${formData._id}` : 'Creating new product'}</h1>
      <div>
        <label>Name:</label>
        <input
          required
          className="text-input"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          required
          className="text-input"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          required
          className="text-input"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          min="0.01"
          max="10000"
        />
      </div>
      <div>
        <label>Quantity:</label>
        <input
          required
          className="text-input"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          max="1000"
        />
      </div>
      <div>
        <label>Category:</label>
        <input
          required
          className="text-input"
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="create-button">
        {initialData ? 'Save Changes' : 'Create Product'}
      </button>
    </form>
  );

};

export default ProductForm;
