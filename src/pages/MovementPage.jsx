import React, { useState, useEffect } from "react";
import { ApiCall } from "../service/ApiCall";
import { Show_Toast } from "../utils/Toast";
import { useAuth } from "../service/Context";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Stocks } from "../utils/Path_Url";

function MovementPage() {
  const navigate =useNavigate()
  const { token } = useAuth();
  console
  const decoded = jwtDecode(token);
  console.log(decoded,"tokanuserid")
  const userId = decoded.userId;
  console.log(userId,"userid from token")

  const [formData, setFormData] = useState({
    sourceWarehouse: "",
    destinationWarehouse: "",
    movementType: "",
    userId,
    products: [],
  });

  const [warehouses, setWarehouses] = useState([]);
  const [towarehouse , setTowarehouse] =useState([])
  const [productOptions, setProductOptions] = useState([]);
  const [sourceWarehouseProducts, setSourceWarehouseProducts] = useState([]);

  useEffect(() => {
    const fetchWarehousesTo = async () => {
      try {
        const response = await ApiCall("GET", "/warehouses");
        setTowarehouse(response.data.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching warehouses:", error);
        throw error.message;
      }
    };
    const fetchWarehouses = async () => {
      try {
        const response = await ApiCall("GET", "/stocks");
        setWarehouses(response.data.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching warehouses:", error);
        throw error.message;
      }
    };

    const fetchProductOptions = async () => {
      try {
        const response = await ApiCall("GET", "/products");
        setProductOptions(response.data.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching product options:", error);
        throw error.message;
      }
    };

    fetchWarehouses();
    fetchWarehousesTo();
    fetchProductOptions();
  }, []);

  useEffect(() => {
    const fetchSourceWarehouseProducts = async () => {
      if (formData.sourceWarehouse) {
        try {
          const response = await ApiCall("GET", `/stocks/${formData.sourceWarehouse}`);
          setSourceWarehouseProducts(response.data.data.stockEntries);
        } catch (error) {
          console.error("Error fetching source warehouse products:", error);
          throw error.message;
        }
      }
    };

    fetchSourceWarehouseProducts();
  }, [formData.sourceWarehouse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (checked, productId, productName) => {
    if (checked) {
      setFormData((prevData) => ({
        ...prevData,
        products: [
          ...prevData.products,
          { product: productId, quantity: 1, productname: productName },
        ],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        products: prevData.products.filter((p) => p.product !== productId),
      }));
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    console.log('Handling quantity change:', productId, quantity);
    const updatedProducts = formData.products.map((product) =>
      product.product === productId ? { ...product, quantity } : product
    );
    setFormData({ ...formData, products: updatedProducts });
  };

  const handleMoveProductSubmit = async (e) => {
    e.preventDefault();

    // Check if the selected quantity exceeds the available stock
    for (const product of formData.products) {
      const selectedProduct = sourceWarehouseProducts.find(
        (entry) => entry.product._id === product.product
      );

      if (selectedProduct && product.quantity > selectedProduct.stock) {
        Show_Toast(`Out of stock for product: ${selectedProduct.product.productname}`);
        return;
      }
    }

    // Proceed with the form submission
    try {
      const response = await ApiCall("POST", "/movements", formData);
      console.log("API response:", response.data);
      Show_Toast(response.message, true);
      navigate(Stocks)
    } catch (error) {
      console.error("Error making API call:", error);
      Show_Toast(error.response.message, false);
    }
  };

  const uniqueWarehouses = warehouses.filter(
    (warehouse, index, self) =>
      index === self.findIndex((w) => w.warehouse._id === warehouse.warehouse._id)
  );
  const [selectedProducts, setSelectedProducts] = useState([]);

  // ...

  const handleProductSelection = (selectedProductId) => {
    if (selectedProducts.includes(selectedProductId)) {
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((productId) => productId !== selectedProductId)
      );
    } else {
      setSelectedProducts((prevSelected) => [...prevSelected, selectedProductId]);
    }
  };
  return (
    <>
<div className="container mt-5">      
        {/* <h1
          className="mb-4"
          style={{
            fontFamily: "YourCustomFont",
            color: "white",
            fontSize: "2.5em",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          Move Products
        </h1> */}
<h1
  className="mb-4"
  style={{
    fontFamily: "YourCustomFont",
    color: "white",
    fontSize: "3em",
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    marginTop: "50px",
    borderBottom: "2px solid #5fe398", // Add an underline
    paddingBottom: "20px", // Add some padding to space out the underline
    borderBottomWidth: "1px", // Reduce the width of the underline
    borderBottomHight: "5px", // Reduce the width of the underline
  }}
>
  Move Stocks
</h1>
        <div className="col-md-12">
        <div style={{
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  // minHeight: "100vh",
}}>
          <form onSubmit={handleMoveProductSubmit}  style={{ width: "600px" }}>
            {/* From and To Address */}
            <div className="mb-3 row">
            <div className="form-group" style={{ marginBottom: "20px", position: "relative" ,width:"600px"}}>
  <label htmlFor="sourceWarehouse" className="form-label" style={{ color: "white", fontSize: "1.2em", marginBottom: "10px" }}>
    From Address:
  </label>
  <select
    className="form-control "
    id="sourceWarehouse"
    name="sourceWarehouse"
    value={formData.sourceWarehouse}
    onChange={handleChange}
    style={{
      width: "100%",
      height: "50px",
      borderRadius: "10px",
      // boxShadow: "0 0 10px rgba(153,102,255,0.6)",
 
      outline: "none",
      // paddingLeft: "10px",
      color: "white",

    }}
  >
    <option value="" disabled>
      Select From Address
    </option>
    {uniqueWarehouses.map((warehouse, index) => (
      <option key={index} value={warehouse.warehouse._id}>
        {warehouse.warehouse.warehousename}
      </option>
    ))}
  </select>
</div>


              <div className="form-group" style={{ marginBottom: "20px", position: "relative" ,width:"600px"}}>
                <label htmlFor="destinationWarehouse" className="form-label" style={{ color: "white", fontSize: "1.2em", marginBottom: "10px" }}>
                  To Address:
                </label>
                <select
                  className="form-control"
                  id="destinationWarehouse"
                  name="destinationWarehouse"
                  value={formData.destinationWarehouse}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    height: "50px",
                    borderRadius: "10px",
                    // boxShadow: "0 0 10px rgba(153,102,255,0.6)",
               
                    outline: "none",
                    // paddingLeft: "10px",
                    color: "white",
              
                  }}
                >
                  <option value="" disabled>
                    Select To Address
                  </option>
                  {towarehouse.map((warehouse, index) => (
                    <option key={index} value={warehouse._id}>
                      {warehouse.warehousename}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Movement Type */}
            <div className="form-group" style={{ marginBottom: "20px", position: "relative",width:"200px" }}>
  <label htmlFor="movementType" className="form-label" style={{ color: "white", fontSize: "1.2em", marginBottom: "10px" }}>
    Movement Type:
  </label>
  <select
    className="form-control"
    id="movementType"
    name="movementType"
    value={formData.movementType}
    onChange={handleChange}
    style={{
      width: "100%",
      height: "50px",
      borderRadius: "10px",
      // boxShadow: "0 0 10px rgba(153,102,255,0.6)",
 
      outline: "none",
      // paddingLeft: "10px",
      color: "white",

    }}
  >
    <option value="" disabled>
      Select Movement Type
    </option>
    <option value="Transfer">Transfer</option>
    <option value="Return">Return</option>
  </select>
</div>

          {/* Products */}
<div className="mb-3">
  <label htmlFor="products" className="form-label" style={{ color: "white", fontSize: "1.2em", marginBottom: "10px" }}>
    Products:
  </label>
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
    }}
  >
    {sourceWarehouseProducts &&
      sourceWarehouseProducts.map((product) => (
        <div
          key={product.product._id}
          className="form-check form-check-success mb-3"
          style={{ margin: "10px", minWidth: "250px" }}
        >
          <input
            className="form-check-input"
            type="checkbox"
            id={`product_${product.product._id}`}
            value={product.product._id}
            checked={formData.products.some((p) => p.product === product.product._id)}
            onChange={(e) =>
              handleProductChange(e.target.checked, product.product._id, product.product.productname)
            }
          />
          <label
            className="form-check-label"
            htmlFor={`product_${product.product._id}`}
          >
            {product.product.productname} - Stock: {product.stock}
          </label>
          <div className="input-group" style={{ marginLeft: "10px" }}>
            <input
              type="number"
              className="form-control"
              id={`quantity_${product.product._id}`}
              value={
                (formData.products.find((p) => p.product === product.product._id) || {}).quantity || 0
              }
              onChange={(e) =>
                handleQuantityChange(product.product._id, e.target.value)
              }
            />
          </div>
        </div>
      ))}
  </div>
</div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                backgroundColor: "#5fe398",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                transition: "background-color 0.3s ease, transform 0.2s ease",
                cursor: "pointer",
                marginTop: "10px",
                width: "100%", // Make the button full width
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#00d25b";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#5fe398";
                e.target.style.transform = "scale(1)";
              }}
            >
              Submit
            </button>
            </form>
            </div>
        </div>
      </div>
    </>
  );
}

export default MovementPage;
