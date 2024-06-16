import React, { useEffect } from "react";
import "./ConsolePage.css";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { validate } from "../auth/config";

const AdminConsole = () => {
  let location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    validate(navigate);
  }, [navigate]);

  return (
    <div className="console-page container-fluid">
      <div className="row">
        <div className="col-2 mt-5 option">
          <nav>
            <div className="option-item-container">
              <Link
                to="/console/project"
                className={`option-item ${
                  location.pathname === "/console/project" ? "nav-active" : ""
                }`}
              >
                <p>Project Details</p>
                <div
                  className={`active-stick ${
                    location.pathname === "/console/project"
                      ? "nav-active-stick"
                      : ""
                  }`}
                ></div>
              </Link>
            </div>
            <div className="option-item-container">
              <Link
                to="/console/source"
                className={`option-item ${
                  location.pathname === "/console/source" ? "nav-active" : ""
                }`}
              >
                <p>Source</p>
                <div
                  className={`active-stick ${
                    location.pathname === "/console/source"
                      ? "nav-active-stick"
                      : ""
                  }`}
                ></div>
              </Link>
            </div>
            <div className="option-item-container">
              <Link
                to="/console/control"
                className={`option-item ${
                  location.pathname === "/console/control" ? "nav-active" : ""
                }`}
              >
                <p>Control</p>
                <div
                  className={`active-stick ${
                    location.pathname === "/console/control"
                      ? "nav-active-stick"
                      : ""
                  }`}
                ></div>
              </Link>
            </div>
            <div className="option-item-container">
              <Link
                to="/console/expert"
                className={`option-item ${
                  location.pathname === "/console/expert" ? "nav-active" : ""
                }`}
              >
                <p>Expert Help</p>
                <div
                  className={`active-stick ${
                    location.pathname === "/console/expert"
                      ? "nav-active-stick"
                      : ""
                  }`}
                ></div>
              </Link>
            </div>
          </nav>
        </div>
        <div className="col-10 mt-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminConsole;
