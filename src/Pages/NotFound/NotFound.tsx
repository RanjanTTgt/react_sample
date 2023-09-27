import { Link } from 'react-router-dom';
import React from "react";

export const NotFound = () => {
  return (
          <section className="main-section">
              <div className="container">
                  <div className="inner-section">
                      <div className="d-flex w-100 product-search-header flex-wrap heading justify-content-center">
                          <h4>
                              Maybe the page you are looking for has been removed, or you typed in the
                              wrong URL
                          </h4>
                      </div>
                      <div className="d-flex w-100 product-search-header flex-wrap heading justify-content-center">
                          <Link to={'/products'} >
                              Back to Home?
                          </Link>
                      </div>
                  </div>
              </div>
          </section>
  );
};
