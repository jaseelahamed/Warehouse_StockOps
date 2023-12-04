import ModalForm from "../components/ModalForm";
import React, { useState,useEffect } from "react";
import { Form, Button, Col, InputGroup } from "react-bootstrap";
import { Show_Toast } from "../utils/Toast";
import { ApiCall } from "../service/ApiCall";

function WarehousePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState({});
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({});
    const [warehouses, setWarehouses] = useState([]);
  
    useEffect(() => {
        fetchWarehouses();
      }, []);
    
      const fetchWarehouses = () => {
        // Simulate an asynchronous API call with setTimeout
        setTimeout(() => {
          // Fake data for demonstration purposes
          const fakeWarehouses = [
            { id: 1, warehousename: "Warehouse 1", totalStock: 100, isActive: true },
            { id: 2, warehousename: "Warehouse 2", totalStock: 150, isActive: false },
            // Add more fake warehouses as needed
          ];
    
          setWarehouses(fakeWarehouses);
        }, 1000); // Simulating a 1-second delay
      };
    
    const handleOpenModal = (warehouseId) => {
      const selectedWarehouse = warehouses.find((warehouse) => warehouse.id === warehouseId) || { isActive: true };
      setData(selectedWarehouse);
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
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
        const endpoint = data.id ? `/edit/${data.id}` : "/register";
        const method = data.id ? "put" : "post";
  
        const response = await ApiCall(method, endpoint, data);
  
        if (response.status) {
          console.log("Warehouse Created/Edited Successfully");
          Show_Toast(response.status);
          // Update the warehouse list or fetch the updated data from the server
          // Example: fetchWarehouses();
          handleCloseModal();
        } else {
          console.error("Error creating/editing warehouse:", response.message);
          Show_Toast(response.status);
        }
      } catch (error) {
        console.error("Error creating/editing warehouse:", error);
      }
    };
  
    const validateForm = (formData) => {
      const errors = {};
  
      if (!formData.warehousename) {
        errors.warehousename = "Warehouse Name is required";
      }
  
      // Add validation for other form fields if needed
  
      return errors;
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
    };
  
    const toggleButton = async (warehouseId) => {
      try {
        const warehouseToUpdate = warehouses.find((warehouse) => warehouse.id === warehouseId);
        const updatedData = { ...warehouseToUpdate, isActive: !warehouseToUpdate.isActive };
  
        const response = await ApiCall("put", `/updateStatus/${warehouseId}`, updatedData);
  
        if (response.status) {
          console.log("Warehouse status updated successfully");
          Show_Toast(response.status);
          // Update the warehouse list or fetch the updated data from the server
          // Example: fetchWarehouses();
        } else {
          console.error("Error updating warehouse status:", response.message);
          Show_Toast(response.status);
        }
      } catch (error) {
        console.error("Error updating warehouse status:", error);
      }
    };
  return (
    <>
      <div className="text-sm-end">
        <button
          type="button"
          className="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2"
          style={{
            transition: "transform 0.3s ease ",
            ":hover": {
              transform: "scale(1.1) rotate(10deg)", // Increase size and add a slight rotation
            },
          }}
          onClick={handleOpenModal}
        >
          <i class="mdi mdi-account-plus"></i> Add New Warehouse
        </button>
      </div>
      <div>
        <form className="nav-link mt-2 mt-md-0 d-none d-lg-flex search justify-content-end">
          <input
            type="text"
            className="form-control"
            placeholder="Search Warehouse"
            style={{ width: "500px" }} // Adjust the width as needed
          />
        </form>
      </div>
      <div className="row ">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Warehouse List</h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th> Warehouse ID </th>
                      <th> Warehouse Name </th>
                      <th> Total Stock </th>
                      <th> Active or Not </th>
                    </tr>
                  </thead>
                  {warehouses.map((warehouse) => (
                      <tr key={warehouse.id}>
                        <td>{warehouse.id}</td>
                        <td>
                          <img src="assets/images/faces/face5.jpg" alt="image" />
                          <span className="pl-2">{warehouse.warehousename}</span>
                        </td>
                        <td>{warehouse.totalStock}</td>
                        <td>
                          <div
                            className={`badge ${
                              warehouse.isActive
                                ? "badge-outline-success"
                                : "badge-outline-danger"
                            }`}
                            onClick={() => toggleButton(warehouse.id)}
                          >
                            {warehouse.isActive ? "Active" : "Inactive"}
                          </div>
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
                              onClick={() => handleOpenModal(warehouse.id)}
                            ></i>
                            <i
                              className="mdi mdi-delete-sweep"
                              style={{
                                color: "red",
                                fontSize: "1.5em",
                                cursor: "pointer",
                                transition: "color 0.3s ease",
                              }}
                            ></i>
                          </div>
                        </td>
                      </tr>
                    ))}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalForm
        show={isModalOpen}
        onHide={handleCloseModal}
        title="Warehouse Registration Form"
      >
        <Form
          noValidate
          validated={validated}
          onSubmit={(e) => handleSubmit(e)}
        >
          <Form.Group as={Col} controlId="validationCustom01">
            <Form.Label className="mb-1">Warehouse Name</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                required
                type="text"
                placeholder="Enter Warehouse Name"
                name="Warehouse Name"
                value={data?.warehousename ?? ""}
                onChange={handleInputChange}
                aria-describedby="inputGroupPrepend"
                isInvalid={!!errors.warehousename}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
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
    </>
  );
}

export default WarehousePage;
