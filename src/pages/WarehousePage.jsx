import ModalForm from "../components/ModalForm";
import React, { useState, useEffect } from "react";
import { Form, Button, Col, InputGroup } from "react-bootstrap";
import { Show_Toast } from "../utils/Toast";
import { ApiCall } from "../service/ApiCall";
import { Link } from "react-router-dom";

function WarehousePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({});
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [warehouses, setWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  console.log(data);
  useEffect(() => {
    fetchWarehouses();
  }, []);

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

  const handleOpenModal = (warehouseId) => {
    const selectedWarehouse = warehouses.find(
      (warehouse) => warehouse._id === warehouseId
    ) || { isActive: true };
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
      const endpoint = data._id ? `/warehouses/${data._id}` : "/warehouses";
      const method = data._id ? "put" : "post";

      const response = await ApiCall(method, endpoint, data);

      if (response.status) {
        console.log("Warehouse Created/Edited Successfully");
        Show_Toast(response.message, true);
        setData('')
        fetchWarehouses();
        handleCloseModal();
      } else {
        console.error("Error creating/editing warehouse:", response.message);
        Show_Toast(response.message, false);
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

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const toggleButton = async (warehouseId) => {
    try {
      if (!warehouseId) {
        console.error("Invalid warehouseId");
        return;
      }

      const warehouseToUpdate = warehouses.find(
        (warehouse) => warehouse?._id === warehouseId
      );

      if (warehouseToUpdate) {
        const updatedData = {
          ...warehouseToUpdate,
          isActive: !warehouseToUpdate.isActive,
        };

        const response = await ApiCall(
          "put",
          `/warehouses/${warehouseId}`,
          updatedData
        );

        if (response.status) {
          console.log("Warehouse status updated successfully");
          Show_Toast(response.message, true);
          setData('')
          fetchWarehouses();
        } else {
          console.error("Error updating warehouse status:", response.message);
          Show_Toast(response.message,false);
        }
      } else {
        console.error("Warehouse not found for the given ID:", warehouseId);
      }
    } catch (error) {
      console.error("Error updating warehouse status:", error);
    }
  };

  // const Singlewarehouse = async (warehouseId) => {
  //   try {
  //     const response = await ApiCall("GET", `/stocks/${warehouseId}`, null);

  //     if (response.status === 200) {
  //       console.log("Warehouse details:", response.data);
  //     } else {
  //       console.error("Error fetching warehouse details:", response.message);
  //       Show_Toast(response.status);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching warehouse details:", error);
  //   }
  // };

  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse &&
      warehouse.warehousename &&
      warehouse.warehousename.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <i className="mdi mdi-account-plus"></i> Add New Warehouse
        </button>
      </div>
      <div className="mt-2 mt-md-0 d-none d-lg-flex justify-content-end">
      <form className="nav-link mt-2 mt-md-0 d-none d-lg-flex search justify-content-end" style={{ width: "500px", marginRight: "-25px" , }}>
  <input
    type="text"
    className="form-control"
    placeholder="Search Warehouse"
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
                Warehouse List
              </h4>
              <div className="table-responsive">
                <table className="table">
                  <thead style={{ backgroundColor: "", color: "white" }}>
                    <tr>
                      <th> Warehouse ID </th>
                      <th> Warehouse Name </th>
                      <th> Total Stock </th>
                      <th> Active or Not </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWarehouses.map((warehouse, index) => (
                      <tr
                        key={warehouse._id}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <td>{index + 1}</td>
                        <td>
                          <span className="pl-2">
                            {warehouse.warehousename}
                          </span>
                        </td>
                        <Link
  to={`/singlewarhouse/${warehouse._id}`}
  style={{
    textDecoration: 'none',
    color: 'rgba(153,102,255,0.6)',
    transition: 'transform 0.3s',
    display: 'inline-block', // Ensures inline display
  }}
  onMouseOver={(e) => (e.target.style.transform = 'translateY(-2px)')}
  onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
>
  <td>
    View Stock
  </td>
</Link>

                        <td>
                          <div
                            className={`badge ${
                              warehouse.isActive
                                ? "badge-outline-success"
                                : "badge-outline-danger"
                            }`}
                            onClick={() => toggleButton(warehouse._id)}
                            style={{
                              cursor: "pointer",
                              transition: "background-color 0.3s ease",
                            }}
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
                              onClick={() => handleOpenModal(warehouse._id)}
                            ></i>
                            {/* <i
                              className="mdi mdi-delete-sweep"
                              style={{
                                color: "red",
                                fontSize: "1.5em",
                                cursor: "pointer",
                                transition: "color 0.3s ease",
                              }}
                            ></i> */}
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
                name="warehousename"
                value={data?.warehousename ?? ""}
                onChange={handleInputChange}
                aria-describedby="inputGroupPrepend"
                isInvalid={!!errors.warehousename}
              />
              <Form.Control.Feedback type="invalid">
                {errors.warehousename}
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
