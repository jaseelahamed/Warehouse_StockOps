import React from "react";
import { Link } from "react-router-dom";
import { Userpage, Login, Movement,Warehouse,Stocks,Return } from "../utils/Path_Url";
import { History,DashBord } from "../utils/Path_Url";


function LeftSideBar() {
  return (
    <>
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
          {/* <a
            className="sidebar-brand brand-logo"
            href="https://themewagon.github.io/corona-free-dark-bootstrap-admin-template/index.html"
          >
            <img
              src="https://themewagon.github.io/corona-free-dark-bootstrap-admin-template/assets/images/logo.svg"
              alt="logo"
            />
          </a> */}
          <a
            className="sidebar-brand brand-logo-mini"
            href="https://themewagon.github.io/corona-free-dark-bootstrap-admin-template/index.html"
          >
            <img
              src="https://themewagon.github.io/corona-free-dark-bootstrap-admin-template/assets/images/logo-mini.svg"
              alt="logo"
            />
          </a>
        </div>
        <ul className="nav">
          <li className="nav-item profile">
            <div className="profile-desc">
              <div className="profile-pic">
                <div className="count-indicator">
                  <img
                    className="img-xs rounded-circle "
                    src="../../assets/images/faces/face15.jpg"
                    alt
                  />
                  <span className="count bg-success" />
                </div>
                <div className="profile-name">
                  <h5 className="mb-0 font-weight-normal">Jasil</h5>
                  <span>Gold Member</span>
                </div>
              </div>
              <a href="#" id="profile-dropdown" data-toggle="dropdown">
                <i className="mdi mdi-dots-vertical" />
              </a>
              <div
                className="dropdown-menu dropdown-menu-right sidebar-dropdown preview-list"
                aria-labelledby="profile-dropdown"
              >
                <a href="#" className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-settings text-primary" />
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject ellipsis mb-1 text-small">
                      Account settings
                    </p>
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a href="#" className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-onepassword  text-info" />
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject ellipsis mb-1 text-small">
                      Change Password
                    </p>
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a href="#" className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-calendar-today text-success" />
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject ellipsis mb-1 text-small">
                      To-do list
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </li>
          {/* <li className="nav-item nav-category">
            <span className="nav-link">Navigation</span>
          </li> */}
          <li className="nav-item menu-items">
            <Link
              className="nav-link"
             to={DashBord}
            >
              <span className="menu-icon">
                <i className="mdi mdi-speedometer" style={{
                            fontSize: "1.5em",
                            color: "#00d25b",
                            cursor: "pointer",
                            // color: '#000', // Initial color
                            transition: "color 0.3s ease", // Smooth transition
                            ":hover": { color: "#00d25b" },
                          }} />
              </span>
              <span className="menu-title">Dashboard</span>
            </Link>
          </li>
          <li className="nav-item menu-items">
            <Link
              className="nav-link"
              to={Warehouse}

            >
              <span className="menu-icon">
              
              <i class="mdi mdi-houzz-box"   style={{
                            fontSize: "1.5em",
                            color: "#00d25b",
                            cursor: "pointer",
                            // color: '#000', // Initial color
                            transition: "color 0.3s ease", // Smooth transition
                            ":hover": { color: "#00d25b" },
                          }}></i> 
              </span>
              <span className="menu-title">Warehouse List</span>
            </Link>
          </li>
       
          <li className="nav-item menu-items">
            <Link className="nav-link" to={Userpage}>
              <span className="menu-icon">
              <i class="mdi mdi-account-card-details" style={{
                            fontSize: "1.5em",
                            color: "#00d25b",
                            cursor: "pointer",
                            // color: '#000', // Initial color
                            transition: "color 0.3s ease", // Smooth transition
                            ":hover": { color: "#00d25b" },
                          }}></i> 
              </span>
              <span className="menu-title">User List</span>
            </Link>
          </li>
          <li className="nav-item menu-items">
            <Link
              className="nav-link"
              to={Stocks}
            >
              <span className="menu-icon">
              <i class="mdi mdi-clipboard-text"  style={{
                            fontSize: "1.5em",
                            color: "#00d25b",
                            cursor: "pointer",
                            // color: '#000', // Initial color
                            transition: "color 0.3s ease", // Smooth transition
                            ":hover": { color: "#00d25b" },
                          }}></i> 
              </span>
              <span className="menu-title">Stock List</span>
            </Link>
          </li>
          <li className="nav-item menu-items">
            <Link className="nav-link" to={Movement}>
              <span className="menu-icon">
              <i class="mdi mdi-truck-delivery"   style={{
                            fontSize: "1.5em",
                            color: "#00d25b",
                            cursor: "pointer",
                            // color: '#000', // Initial color
                            transition: "color 0.3s ease", // Smooth transition
                            ":hover": { color: "#00d25b" },
                          }} ></i>
              </span>
              <span className="menu-title">Transfer Movement</span>
            </Link>
          </li>
          <li className="nav-item menu-items">
            <Link className="nav-link" to={History}>
              <span className="menu-icon">
              <i class="mdi mdi-history"   style={{
                            fontSize: "1.5em",
                            color: "#00d25b",
                            cursor: "pointer",
                            // color: '#000', // Initial color
                            transition: "color 0.3s ease", // Smooth transition
                            ":hover": { color: "#00d25b" },
                          }} ></i>
              </span>
              <span className="menu-title"> Movement History</span>
            </Link>
          </li>
        
         
          <li className="nav-item menu-items">
      {/* <a className="nav-link" data-toggle="collapse" href="#auth" aria-expanded="false" aria-controls="auth">
        <span className="menu-icon">
          <i className="mdi mdi-security" />
        </span>
        <span className="menu-title">User Pages</span>
        <i className="menu-arrow" />
      </a> */}
      <div className="collapse" id="auth">
        <ul className="nav flex-column sub-menu">
          <li className="nav-item"> <a className="nav-link" href="https://themewagon.github.io/corona-free-dark-bootstrap-admin-template/pages/samples/blank-page.html"> Blank Page </a></li>
          <li className="nav-item"> <a className="nav-link" href="https://themewagon.github.io/corona-free-dark-bootstrap-admin-template/pages/samples/error-404.html"> 404 </a></li>
          <li className="nav-item"> <a className="nav-link" href="https://themewagon.github.io/corona-free-dark-bootstrap-admin-template/pages/samples/error-500.html"> 500 </a></li>
          <li className="nav-item"> <Link className="nav-link" to={Login} > Login </Link></li>
          <li className="nav-item"> <a className="nav-link" href="https://themewagon.github.io/corona-free-dark-bootstrap-admin-template/pages/samples/register.html"> Register </a></li>
        </ul>
      </div>
    </li>
          <li className="nav-item menu-items">
            <Link className="nav-link" to={Return}>
              <span className="menu-icon">
              <i class="mdi mdi-heart-broken"  style={{
                            fontSize: "1.5em",
                            color: "red",
                            cursor: "pointer",
                         
                          }}></i>
              </span>
              <span className="menu-title">Return Stock</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default LeftSideBar;
