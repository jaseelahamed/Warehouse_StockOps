import React from 'react'
import { useAuth } from "../service/Context";

function Header() {
  const { setToken } = useAuth();

  const handleLogout = () => {
    console.log("logout")
    // Remove the token from local storage
    localStorage.removeItem("token");
    
    // Set the token in the context to null or undefined (depending on your implementation)
    setToken(null);
  };

  return (
      <>
<nav className="navbar p-0 fixed-top d-flex flex-row">
  <div className="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
    <a className="navbar-brand brand-logo-mini" href="https://themewagon.github.io/corona-free-dark-bootstrap-admin-template/index.html"><img src="https://themewagon.github.io/corona-free-dark-bootstrap-admin-template/assets/images/logo-mini.svg" alt="logo" /></a>
  </div>
  <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
    <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
      <span className="mdi mdi-menu" />
    </button>
  
    <ul className="navbar-nav navbar-nav-right">
     

      <li className="nav-item dropdown">
        <a className="nav-link" id="profileDropdown" href="#" data-toggle="dropdown">
          <div className="navbar-profile">
            <img className="img-xs rounded-circle" src="../../assets/images/faces/face15.jpg" alt />
            <p className="mb-0 d-none d-sm-block navbar-profile-name">Log out</p>
            <i className="mdi mdi-menu-down d-none d-sm-block" />
          </div>
        </a>
        <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="profileDropdown">
          <h6 className="p-3 mb-0">Profile</h6>
         
          <a className="dropdown-item preview-item" onClick={handleLogout}>
            <div className="preview-thumbnail">
              <div className="preview-icon bg-dark rounded-circle">
                <i className="mdi mdi-logout text-danger" />
              </div>
            </div>
            <div className="preview-item-content" >
      <p className="preview-subject mb-1" >
        Log out
      </p>
    </div>
          </a>
          <div className="dropdown-divider" />
          {/* <p className="p-3 mb-0 text-center">Advanced settings</p> */}
        </div>
      </li>
    </ul>
    <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
      <span className="mdi mdi-format-line-spacing" />
    </button>
  </div>
</nav>

      </>
  )
}

export default Header