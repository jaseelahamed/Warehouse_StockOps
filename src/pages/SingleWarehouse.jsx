import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ApiCall } from '../service/ApiCall';

function SingleWarehouse() {
  const Params = useParams();

  const [warehouse, setWarehouse] = useState([]);
    console.log(Params.id, 'detail');
    console.log("warehouse",warehouse)

  const Singlewarehouse = async () => {
    try {
      const response = await ApiCall('GET', `/stocks/${Params.id}`, null);

      if (response.status === 200) {
        console.log('Warehouse details:', response?.data?.data.stockEntries);
        setWarehouse(response?.data?.data.stockEntries
            );
      } else {
        console.error('Error fetching warehouse details:', response.message);
        Show_Toast(response.message,false);
      }
    } catch (error) {
      console.error('Error fetching warehouse details:', error);
    }
  };

  useEffect(() => {
    Singlewarehouse();
  }, []);

  return (
    <>
      <div className="col-lg-12 stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Warehouse Details</h4>
            <div className="table-responsive">
              <table className="table table-contextual">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Stock</th>
                    {/* <th>WarehouseId</th> */}
                  </tr>
                </thead>
                <tbody>
                  {warehouse && warehouse.map((item, index) => (
                    <tr key={index} className="table-info">
                      <td>{index + 1}</td>
                      <td>{item.product?.productname}</td>
                      <td>{item.stock}</td>
                          {/* <td>{ item.warehouse.warehouseId}</td>  */}
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

export default SingleWarehouse;
