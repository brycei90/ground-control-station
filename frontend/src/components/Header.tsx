import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="container text-center">
      <div className="row">
        <div className="col">
          <Link className="btn btn-success" to="/">
            home
          </Link>
        </div>
        <div className="col">
          <Link className="btn btn-success" to="/Plan">
            Plan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
