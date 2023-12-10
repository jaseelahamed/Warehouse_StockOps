import React, { useState } from "react";
import { ApiCall } from "../service/ApiCall";
import { useAuth } from "../service/Context";
import { Show_Toast } from "../utils/Toast";
import { useNavigate } from "react-router-dom";
import { DashBord } from "../utils/Path_Url";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

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

        if (response.data && response.data.data) {
          // Successful login
          console.log("Login Successful:", response.message);

          // Store the token using the login function from the context
          login(response.data.token);
          Show_Toast(response.message, true);

          // Redirect to the dashboard
          navigate(DashBord);
        } else {
          // Handle authentication error
          console.error("Login Failed:", response.message);

          // Show an error message to the user
          Show_Toast(response.message, false);
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
                    <label>Username or username *</label>
                    <input
                      type="text"
                      className={`form-control p_input ${
                        errors.username ? "is-invalid" : ""
                      }`}
                      placeholder="Enter username or username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    <div className="invalid-feedback">{errors.username}</div>
                  </div>
                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      className={`form-control p_input ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      placeholder="Enter password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <div className="invalid-feedback">{errors.password}</div>
                  </div>
                  <div className="form-group d-flex align-items-center justify-content-between">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          className="form-check-input"
                        />{" "}
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="forgot-pass">
                      Forgot password
                    </a>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block enter-btn"
                    >
                      Login
                    </button>
                  </div>
                  <div className="d-flex">
                    <button className="btn btn-facebook mr-2 col">
                      <i className="mdi mdi-facebook" /> Facebook
                    </button>
                    <button className="btn btn-google col">
                      <i className="mdi mdi-google-plus" /> Google plus
                    </button>
                  </div>
                  <p className="sign-up">
                    Don't have an Account?<a href="#"> Sign Up</a>
                  </p>
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
