import ModalForm from "../components/ModalForm";
import React, { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { Show_Toast } from "../utils/Toast";
import { ApiCall } from "../service/ApiCall";

function StockPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({
    product: "",
    warehouse: "",
    quantity: 0,
  });
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState();
  const [warehouses, setWarehouses] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  useEffect(() => {
    fetchStocks();
    fetchProducts();
    fetchWarehouses();
  }, []);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const apiResponse = await ApiCall("GET", "/stocks", null);

      if (apiResponse.status === 200) {
        setStocks(apiResponse.data.data);
      } else {
        setErrors(apiResponse.message || "Failed to fetch stocks");
      }
    } catch (error) {
      setErrors("Error fetching stocks");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const apiResponse = await ApiCall("GET", "/products", null);

      if (apiResponse.status === 200) {
        setProducts(apiResponse.data.data);
      } else {
        setErrors(apiResponse.message || "Failed to fetch products");
      }
    } catch (error) {
      setErrors("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const apiResponse = await ApiCall("GET", "/warehouses", null);

      if (apiResponse.status === 200) {
        setWarehouses(apiResponse.data.data);
      } else {
        setErrors(apiResponse.message || "Failed to fetch warehouses");
      }
    } catch (error) {
      setErrors("Error fetching warehouses");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (stocksId) => {
    const selectedStock = stocks.find((stock) => stock._id === stocksId);
    setData(selectedStock);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    const formErrors = validateForm(data);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const endpoint = data._id ? `/edit/${data._id}` : "/stocks";
      const method = data._id ? "put" : "post";

      const response = await ApiCall(method, endpoint, data);

      if (response.status) {
        console.log("Stock created/edited successfully");
        Show_Toast(response.message, true);
        fetchStocks();
        handleCloseModal();
      } else {
        console.error("Error creating/editing stock:", response.message);
        Show_Toast(response.message,false);
      }
    } catch (error) {
      console.error("Error creating/editing stock:", error);
    }
  };

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.product) {
      errors.product = "Product is required";
    }

    if (!formData.warehouse) {
      errors.warehouse = "Warehouse is required";
    }

    // if (formData.quantity <= 0) {
    //   errors.quantity = "Quantity must be greater than 0";
    // }

    return errors;
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setData({ ...data, [name]: value });
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value) {
      setData({
        ...data,
        [name]: value,
        warehouse: warehouses.find((item) => item.warehousename === "Godown")
          ._id,
      });
      console.log("Updated Data:", data);
    }
    // setData({ ...data, warehouse: warehouses.find((item)=>item.warehousename==='Godown')._id });
  };

  const toggleButton = async (stocksId) => {
    try {
      if (!stocksId) {
        console.error("Invalid stocksId");
        return;
      }

      const stockToUpdate = stocks.find((stock) => stock._id === stocksId);

      if (stockToUpdate) {
        const updatedData = {
          ...stockToUpdate,
          isActive: !stockToUpdate.isActive,
        };

        const response = await ApiCall(
          "put",
          `/stocks/${stocksId}`,
          updatedData
        );

        if (response.status) {
          console.log("Stock status updated successfully");
          Show_Toast(response.status, true);
          fetchStocks();
        } else {
          console.error("Error updating stock status:", response.message);
          Show_Toast(response.status);
        }
      } else {
        console.error("Stock not found for the given ID:", stocksId);
      }
    } catch (error) {
      console.error("Error updating stock status:", error);
    }
  };

  const filteredStocks = stocks.filter(
    (stock) =>
      stock &&
      stock.product &&
      stock.product.productname &&
      stock.product.productname
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (selectedWarehouse === "" || stock.warehouse._id === selectedWarehouse)
  );

  const SingleStock = async (stocksId) => {
    try {
      const response = await ApiCall("GET", `/stocks/${stocksId}`, null);

      if (response.status === 200) {
        console.log("Stock details:", response.data);
        // Handle the data from the API response, e.g., display in a modal or navigate to a new page
      } else {
        console.error("Error fetching stock details:", response.message);
        Show_Toast(response.status);
      }
    } catch (error) {
      console.error("Error fetching stock details:", error);
    }
  };

  return (
    <>
      <div className="text-sm-end mt-3">
        <button
          type="button"
          className="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2"
          onClick={handleOpenModal}
          style={{
            backgroundColor: "#00d25b",
            borderColor: "#00d25b",
            transition: "background-color 0.3s ease",
          }}
        >
          {/* <i className="mdi mdi-account-plus">
          </i>  */}
          <i class="mdi mdi-table-column-plus-after"></i>
          Add New Stock
        </button>

        <Form.Group as={Col} controlId="validationCustom05">
          <Form.Label className="mb-1"> </Form.Label>
          <Form.Control
            as="select"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            style={{
              width: "150px",
              borderRadius: "5px",
              marginRight: "10px",
              transition: "box-shadow 0.3s ease",
            }}
          >
            <option value="">All Warehouses</option>
            {warehouses &&
              warehouses.map((warehouse) => (
                <option key={warehouse._id} value={warehouse._id}>
                  {warehouse.warehousename}
                </option>
              ))}
          </Form.Control>
        </Form.Group>

        {selectedWarehouse && (
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => setSelectedWarehouse("")}
            style={{ transition: "background-color 0.3s ease" }}
          >
            Clear Warehouse Filter
          </Button>
        )}
      </div>

      <div>
        <form className="nav-link mt-2 mt-md-0 d-none d-lg-flex search justify-content-end"  style={{  marginRight: "-20px"  }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search Stocks"
            style={{
              width: "500px",
              borderRadius: "5px",
              transition: "box-shadow 0.3s ease",
              color: 'white'

            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      <div className="row mt-3">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title" style={{ color: "#00d25b" }}>
                Stocks List
              </h4>
              <div className="table-responsive">
                <table className="table">
                  <thead style={{ backgroundColor: "", color: "white" }}>
                    <tr>
                      <th>Stock ID</th>
                      <th>Product Name</th>
                      <th>Warehouse Name</th>
                      <th>Total Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStocks.map((stock, index) => (
                      <tr
                        key={stock._id}
                        style={{
                          transition: "background-color 0.3s ease",
                          cursor: "pointer",
                        }}
                        onClick={() => SingleStock(stock._id)}
                      >
                        <td>{index + 1}</td>
                        <td>{stock.product.productname}</td>
                        <td>{stock.warehouse.warehousename}</td>
                        <td>{stock.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalForm
        show={isModalOpen}
        onHide={handleCloseModal}
        title="Stock Registration Form"
      >
        <Form
          noValidate
          validated={validated}
          onSubmit={(e) => handleSubmit(e)}
        >
          <Form.Group as={Col} controlId="validationCustom02">
            <Form.Label className="mb-1">Product</Form.Label>
            <Form.Control
              as="select"
              name="product"
              value={data?.product?._id}
              onChange={handleInputChange}
              required
              isInvalid={!!errors.product}
            >
              <option value="" disabled>
                Select a product
              </option>
              {products &&
                products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.productname}
                  </option>
                ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.product}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="validationCustom04">
            <Form.Label className="mb-1">Quantity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Quantity"
              name="quantity"
              value={data?.quantity}
              onChange={handleInputChange}
              required
              isInvalid={!!errors.quantity}
            />
            <Form.Control.Feedback type="invalid">
              {errors.quantity}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-end mt-4">
            <Button
              type="submit"
              variant="primary"
              style={{ backgroundColor: "#00d25b", borderColor: "#00d25b" }}
            >
              Submit
            </Button>
          </div>
        </Form>
      </ModalForm>
    </>
  );
}

export default StockPage;
