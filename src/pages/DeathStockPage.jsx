import React, { useState, useEffect } from "react";
import { ApiCall } from "../service/ApiCall";

function DeathStockPage() {
  const [riturn, setReturn] = useState([]);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReturn();
  }, []);

  const fetchReturn = async () => {
    try {
      const apiResponse = await ApiCall("GET", "/deadstocks", null);
      console.log(apiResponse,"dethstock")
      if (apiResponse.status === 200) {
        setReturn(apiResponse.data.data);
      } else {
        setErrors(apiResponse.message || "Failed to fetch dead stocks");
      }
    } catch (error) {
      setErrors("Error fetching dead stocks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <div className="col-lg-15 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title" style={{ color: '#d20038' }}>Return Table</h4>
            <p className="card-description">
              <code>.DeadStock</code>
            </p>
            <div className="table-responsive">
              <table className="table table-hover" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                <thead>
                  <tr>
                    <th style={{ color: '#00d25b' }}>Warehouse Name</th>
                    <th style={{ color: '#00d25b' }}>Product Name</th>
                    <th style={{ color: '#00d25b' }}>Quantity</th>
                  </tr>
                </thead>
                <tbody style={{ borderRadius: '10px', overflow: 'hidden' }}>
                  {riturn && riturn.map((item, index) => (
                    <tr key={item._id} style={{ transition: 'background-color 0.3s ease' }}>
                      <td>{item.warehouse.warehousename}</td>
                      <td>{item.product[0].product.productname}</td>
                      <td>
                        <label className="badge badge-danger" style={{
                          borderRadius: '5px',
                          padding: '8px',
                          cursor: 'pointer',
                          background: 'linear-gradient(to right, #ff8a00, #da1b60)',
                          color: '#fff',
                          transition: 'transform 0.3s ease',
                        }}>
                          {item.quantity}
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default DeathStockPage;
