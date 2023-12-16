import React, { useState } from "react";
import { ApiCall } from "../service/ApiCall";
import { useAuth } from "../service/Context";
import { Show_Toast } from "../utils/Toast";
import { useNavigate } from "react-router-dom";
import { DashBord } from "../utils/Path_Url";
import { jwtDecode } from "jwt-decode";


function decodeTokenAndCheckRole(token) {
  // Check if the token is present and a string before decoding
  const decoded = token && typeof token === 'string' ? jwtDecode(token) : null;
  console.log(decoded, "tokenDecoded");
  return decoded;
}

function LoginForm() {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation logic
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Call API if there are no validation errors
      try {
        const response = await ApiCall("post", "/users/login", formData);

        if (response.data && response.data.token) {
          // Successful login
          console.log("Login Successful:", response.message);

          // Store the token using the login function from the context
          console.log(response, "responseToken");
          login(response.data.token);
          Show_Toast(response.message, true);

          // Decode the token and check the role
          const decodedToken = decodeTokenAndCheckRole(response.data.token);

          if (decodedToken.role === "admin") {
            navigate(DashBord);
          } else {
            // Handle non-admin user
            Show_Toast("Invalid user");
          }
        } else {
          // Handle authentication error
          console.error("Login Failed:", response.message);

          // Show an error message to the user
          Show_Toast(response.data, false);
        }
      } catch (error) {
        console.error("API Error:", error);
        // Handle API error, e.g., show error message
      }
    }
  };


  const validateForm = (data) => {
    const errors = {};

    if (!data. username) {
      errors. username = "Username or  username is required";
    }

    if (!data.password) {
      errors.password = "Password is required";
    }

    return errors;
  };


  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="row w-100 m-0">
          <div className="content-wrapper full-page-wrapper d-flex align-items-center auth login-bg">
            <div className="card col-lg-4 mx-auto">
              <div className="card-body px-5 py-5">
                <h3 className="card-title text-left mb-3">Login</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Username*</label>
                    <input
                      type="text"
                      className={`form-control p_input ${
                        errors.username ? "is-invalid" : ""
                      }`}
                      placeholder="Enter username "
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      style={{ color: 'white' }}
                    />
                    <div className="invalid-feedback">{errors.username}</div>
                  </div>
                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="text"
                      className={`form-control p_input ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      placeholder="Enter password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      style={{ color: 'white' }}
                    />
                    <div className="invalid-feedback">{errors.password}</div>
                  </div>
                
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2"
                      style={{
                        // backgroundColor: "#00d25b",
                        // color: "#fff",
                        padding: "10px 20px",
                        // borderRadius: "5px",
                        transition: "background-color 0.3s ease, transform 0.2s ease",
                        cursor: "pointer",
                        marginTop: "10px",
                        width: "100%", // Make the button full width
                      }}
                    >
                      Login
                    </button>
                  </div>
                 
                 
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
