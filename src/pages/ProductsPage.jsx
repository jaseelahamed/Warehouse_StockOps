import ModalForm from "../components/ModalForm";
import React, { useState, useEffect } from "react";
import { Form, Button, Col, InputGroup } from "react-bootstrap";
import { Show_Toast } from "../utils/Toast";
import { ApiCall } from "../service/ApiCall";
import { Link } from "react-router-dom";

function ProductsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenTwo, setIsModalOpenTwo] = useState(false);
    const [data, setData] = useState({});
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({});
    const [product, setProduct] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    console.log(data);
    useEffect(() => {
      fetchProduct();
    }, []);
  
    const fetchProduct = async () => {
      try {
        setLoading(true);
          const apiResponse = await ApiCall("GET", "/products", null);
          console.log(apiResponse,"productlist Api")
  
        if (apiResponse.status === 200) {
            setProduct(apiResponse.data.data);
        } else {
          setErrors(apiResponse.message || "Failed to fetch warehouses");
        }
      } catch (error) {
        setErrors("Error fetching warehouses");
      } finally {
        setLoading(false);
      }
    };
  
    const handleOpenModal = (productId) => {
      const selectedWarehouse = product.find(
        (product) => product._id === productId
      ) || { isActive: true };
      setData(selectedWarehouse);
      setIsModalOpen(true);
    };
    const handleOpenModalTwo = (product) => {
        setData(product)
  
      setIsModalOpenTwo(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
  
    const handleCloseModalTwo = () => {
      setIsModalOpenTwo(false);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const validationErrors = validateForm(data);
  
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setValidated(true);
        return;
      }
  
      setValidated(true);
  
      try {
        const endpoint = data._id ? `/products/${data._id}` : "/products";
        const method = data._id ? "put" : "post";
  
        const response = await ApiCall(method, endpoint, data);
  
        if (response.status) {
          console.log("Product Created/Edited Successfully");
          Show_Toast(response.message, true);
          setData('');
          fetchProduct();
          handleCloseModal();
        } else {
          console.error("Error creating/editing product:", response.message);
          Show_Toast(response.message, false);
        }
      } catch (error) {
        console.error("Error creating/editing product:", error);
      }
    };
  
    const validateForm = (formData) => {
      const errors = {};
  
      if (!formData.productname || formData.productname.trim() === "" || !/\S/.test(formData.productname)) {
        errors.productname = "Product name is required and must contain at least one non-space character";
      }
  
      return errors;
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
    };
  
  
    
 
    const handleDelete = async (productId) => {
        try {
          const endpoint = `/products/${productId}`;
          const method = 'DELETE';
      
          const response = await ApiCall(method, endpoint, );
      
          if (response.status) {
            console.log('Product deleted successfully');
              Show_Toast(response.message, true);
              fetchProduct();
              handleCloseModalTwo()
            // Additional logic if needed after successful deletion
          } else {
            console.error('Error deleting product:', response.message);
            Show_Toast(response.message, false);
          }
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      };
      
  
    const filteredProduct = product.filter(
        (product) =>
          product &&
          product.productname &&
          product.productname.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
    return (
      <>
        

        <button
        type="button"
        className="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2"
        onClick={handleOpenModal}
      >
        <i className="mdi mdi-account-plus"></i> Add New Product
      </button>
        <div className="text-sm-end mt-3">
          
        </div>
        <div className="mt-2 mt-md-0 d-none d-lg-flex justify-content-end">
        <form className="nav-link mt-2 mt-md-0 d-none d-lg-flex search justify-content-end" style={{ width: "500px", marginRight: "-25px" , }}>
    <input
      type="text"
      className="form-control"
      placeholder="Search Products"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{
        borderRadius: "5px",
        marginRight: "10px",
        transition: "box-shadow 0.3s ease",
        color: 'white'
              }}
              
    />
  </form>
        </div>
        <div className="row mt-3">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title" style={{ color: "#00d25b" }}>
                  Product List
                </h4>
                <div className="table-responsive">
                  <table className="table">
                    <thead style={{ backgroundColor: "", color: "white" }}>
                      <tr>
                        <th> Product ID </th>
                        <th> Product Name </th>
                     
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProduct.map((product, index) => (
                        <tr
                          key={index}
                          style={{ transition: "background-color 0.3s ease" }}
                        >
                          <td>{index + 1}</td>
                          <td>
                            <span className="pl-2">
                              {product.productname}
                            </span>
                          </td>
                 
  
                          
                          <td>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <i
                                className="mdi mdi-lead-pencil"
                                style={{
                                  fontSize: "1.5em",
                                  color: "#00d25b",
                                  cursor: "pointer",
                                  transition: "color 0.3s ease",
                                }}
                                onClick={() => handleOpenModal(product._id)}
                              ></i>
                              <i
                                className="mdi mdi-delete"
                                style={{
                                  color: "red",
                                  fontSize: "1.5em",
                                  cursor: "pointer",
                                  transition: "color 0.3s ease",
                                          }}
                                          onClick={()=>handleOpenModalTwo(product)}
                              ></i>
                            </div>
                              </td>
                           
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
          title=" Product"
        >
          <Form
            noValidate
            validated={validated}
            onSubmit={(e) => handleSubmit(e)}
          >
            <Form.Group as={Col} controlId="validationCustom01">
              <Form.Label className="mb-1">Product Name</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter Product Name"
                  name="productname"
                  value={data?.productname ?? ""}
                  onChange={handleInputChange}
                  aria-describedby="inputGroupPrepend"
                  isInvalid={!!errors.productname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.productname}
                </Form.Control.Feedback>
              </InputGroup>
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
            <ModalForm
  show={isModalOpenTwo}
  onHide={handleCloseModalTwo}
  title="Delete Product"
  centered
>
  <div className="text-center">
    <i
      className="mdi mdi-alert-outline"
      style={{
        color: "red",
        fontSize: "4em",
        cursor: "pointer",
        transition: "color 0.3s ease",
      }}
    ></i>
    <p>Are you sure you want to delete {data.productname}?</p>
    <Button variant="danger" onClick={() => handleDelete(data._id)}>
      Delete
    </Button>
    <Button
      variant="success"
      onClick={handleCloseModalTwo}
      style={{ marginLeft: '20px' }} 
    >
      Cancel
    </Button>
  </div>
</ModalForm>


      </>
  )
}

export default ProductsPage