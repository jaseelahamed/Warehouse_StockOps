import React from "react";
import Header from "./Header";
import LeftSideBar from "./LeftSideBar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../service/Context";
import LoginForm from "../components/LoginForm";

function MainContainer() {
  const { token } = useAuth();

  return (
    <>
      {token ? (
        <div className="container-scroller">
          <LeftSideBar />
          <div className="container-fluid page-body-wrapper">
            <Header />
            <div className="main-panel">
              <div className="content-wrapper">
                <Outlet />
              </div>

              <footer className="footer">
                <div className="d-sm-flex justify-content-center justify-content-sm-between">
                  <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
                    StockOps
                  </span>
                  <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
                    {" "}
                    Free{" "}
                    <a
                      href="https://www.bootstrapdash.com/bootstrap-admin-template/"
                      target="_blank"
                    >
                      StockOps
                    </a>{" "}
                    from Foxiom
                  </span>
                </div>
              </footer>
              {/* partial */}
            </div>
          </div>
        </div>
      ) : (
        <LoginForm />
      )}
    </>
  );
}

export default MainContainer;
