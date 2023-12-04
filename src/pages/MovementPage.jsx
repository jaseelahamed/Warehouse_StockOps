import React, { useState, useEffect } from 'react';

function MovementPage() {
  const [formData, setFormData] = useState({
    fromAddress: '',
    toAddress: '',
    products: [],
  });

  const [warehouses, setWarehouses] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  useEffect(() => {
    // Fetch warehouses (addresses) from your API
    const fetchWarehouses = async () => {
      try {
        const response = await fetch('your-api-endpoint/warehouses');
        const data = await response.json();
        setWarehouses(data);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      }
    };

    // Fetch product options from your API
    const fetchProductOptions = async () => {
      try {
        const response = await fetch('your-api-endpoint/products');
        const data = await response.json();
        setProductOptions(data);
      } catch (error) {
        console.error('Error fetching product options:', error);
      }
    };

    fetchWarehouses();
    fetchProductOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (selectedProducts) => {
    setFormData({ ...formData, products: selectedProducts });
  };

  const handleMoveProductSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission, e.g., dispatching an action or making an API call
    console.log('Form data submitted:', formData);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Move Products</h1>
      <form onSubmit={handleMoveProductSubmit}>
        <div className="mb-3">
          <label htmlFor="fromAddress" className="form-label">
            From Address:
          </label>
          <select
            className="form-select"
            id="fromAddress"
            name="fromAddress"
            value={formData.fromAddress}
            onChange={handleChange}
          >
            <option value="" disabled>Select From Address</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.address}>
                {warehouse.address}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="toAddress" className="form-label">
            To Address:
          </label>
          <select
            className="form-select"
            id="toAddress"
            name="toAddress"
            value={formData.toAddress}
            onChange={handleChange}
          >
            {/* Fetch and populate the "To Address" dropdown in a similar manner */}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="products" className="form-label">
            Products:
          </label>
          <select
            multiple
            className="form-select"
            id="products"
            onChange={(e) => {
              const selectedProducts = Array.from(e.target.selectedOptions, (option) => option.value);
              handleProductChange(selectedProducts);
            }}
          >
            {productOptions.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add more product selection fields based on your requirements */}

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default MovementPage;
