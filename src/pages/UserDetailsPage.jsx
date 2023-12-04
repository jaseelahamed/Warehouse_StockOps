import ModalForm from "../components/ModalForm";
import React, { useState, useEffect } from "react";
import { Form, Button, Col, InputGroup } from "react-bootstrap";
import { Show_Toast } from "../utils/Toast";
import { ApiCall } from "../service/ApiCall";

function UserDetails() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({});
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const apiResponse = await ApiCall("GET", "/users", null);

        if (apiResponse.status === 200) {
          setUsers(apiResponse.data.data);
        } else {
          setErrors(apiResponse.message || "Failed to fetch users");
        }
      } catch (error) {
        setErrors("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (errors) {
    return <p>Error: {errors}</p>;
  }

  const handleOpenModal = (userData) => {
    setData(userData || {});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e, isToggleAction) => {
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
      let endpoint, method, requestData;
      if (isToggleAction) {
        const userToUpdate = users.find((user) => user.id === data.id);
        requestData = { ...userToUpdate, isActive: !userToUpdate.isActive };
        endpoint = `/updateStatus/${data.id}`;
        method = "put";
      } else {
        endpoint = data.id ? `/edit/${data.id}` : "/users";
        method = data.id ? "put" : "post";
        requestData = data;
      }

      const response = await ApiCall(method, endpoint, requestData);

      if (response.status) {
        console.log(isToggleAction ? "User status updated successfully" : "User created/edited successfully");
        Show_Toast(response.status);
        handleCloseModal();
      } else {
        console.error(isToggleAction ? "Error updating user status:" : "Error creating/editing user:", response.message);
        Show_Toast(response.status);
      }
    } catch (error) {
      console.error(isToggleAction ? "Error updating user status:" : "Error creating/editing user:", error);
    }
  };

  const validateForm = (formData) => {
    const errors = {};

    if (!formData || !formData.username) {
      errors.username = "Username is required";
    }

    if (!formData || !formData.password) {
      errors.password = "Password is required";
    }

    if (!formData || !formData.role) {
      errors.role = "Role is required";
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleButton = async (userId) => {
    console.log(userId)
    try {
      const userToUpdate = users.find((user) => user._id === userId);
      if (userToUpdate) {
        const updatedData = { ...userToUpdate, isActive: !userToUpdate.isActive };
        console.log(updatedData+"udatedata")

        const response = await ApiCall("put", `/users/${userId}`, updatedData);

        if (response.status) {
          
          console.log("User status updated successfully");
          Show_Toast(response.status, true);
         
        } else {
          console.error("Error updating user status:", response.message);
          Show_Toast(response.status, true);
        }
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
    
  };

// Filter users based on search term
const filteredUsers = users.filter((user) =>
user.username.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <>
      <div className="text-sm-end">
        <button
          type="button"
          className="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2"
          onClick={() => handleOpenModal()}
        >
          <i className="mdi mdi-account-plus"></i> Add New User
        </button>
      </div>
      <div>
      <form className="nav-link mt-2 mt-md-0 d-none d-lg-flex search justify-content-end">
          <input
            type="text"
            className="form-control"
            placeholder="Search User"
            style={{ width: "500px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th> User ID </th>
                    <th>User Name </th>
                    <th> Active Type </th>
                    <th> Password</th>
                    <th> Action </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="py-1">
                        <img src={"../../assets/images/faces-clipart/pic-1.png"} alt="image" />
                      </td>
                      <td>{user?.username || 'N/A'}</td>
                      <td>
                        <div
                          className={`badge ${
                            user && user.isActive ? "badge-outline-success" : "badge-outline-danger"
                          }`}
                          onClick={() => toggleButton(user?._id)}
                        >
                          {user && user.isActive ? "Active" : "Inactive"}
                        </div>
                      </td>
                      <td>{user?.password || 'N/A'}</td>
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
                            onClick={() => handleOpenModal(user)}
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ModalForm
        show={isModalOpen}
        onHide={handleCloseModal}
        title="User Registration Form"
      >
        <Form
          noValidate
          validated={validated}
          onSubmit={(e) => handleSubmit(e, false)}
        >
          <Form.Group as={Col} controlId="validationCustom01">
            <Form.Label className="mb-1">Username</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                required
                type="text"
                placeholder="Enter username"
                name="username"
                value={data?.username || ""}
                onChange={handleInputChange}
                aria-describedby="inputGroupPrepend"
                // isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type="invalid">
                {/* {errors.username} */}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" as={Col} controlId="validationCustom02">
            <Form.Label className="mb-1 mt-4">Password</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                required
                type="password"
                placeholder="Enter password"
                name="password"
                value={data?.password || ""}
                onChange={handleInputChange}
                aria-describedby="inputGroupPrepend"
                // isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {/* {errors.password} */}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" as={Col} controlId="validationCustom03">
            <Form.Label className="mb-1 mt-4">Role</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                required
                type="text"
                placeholder="Enter role"
                name="role"
                value={data?.role || ""}
                onChange={handleInputChange}
                aria-describedby="inputGroupPrepend"
                // isInvalid={!!errors.role}
              />
              <Form.Control.Feedback type="invalid">
                {/* {errors.role} */}
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

export default UserDetails;
