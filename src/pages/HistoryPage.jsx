import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ApiCall } from "../service/ApiCall";
import ModalForm from "../components/ModalForm";
import { Button } from "react-bootstrap";
import { writeFile } from "xlsx";
import * as XLSX from "xlsx";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState();
  const [timeSearchTerm, setTimeSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenModal = (data) => {
    setProduct(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Optionally, you can fetch history here based on the selected date.
  };

  const fetchHistory = async () => {
    try {
      const apiResponse = await ApiCall("GET", "/movements", null);
      if (apiResponse.status === 200) {
        setHistory(apiResponse.data);
      } else {
        console.error(apiResponse.message || "Failed to fetch movements");
      }
    } catch (error) {
      console.error("Error fetching movements:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((movement) => {
    const movementDate = new Date(movement.timestamp).toLocaleDateString().toLowerCase();
    const selectedDateFormatted = selectedDate ? selectedDate.toLocaleDateString().toLowerCase() : "";
    return movementDate.includes(timeSearchTerm.toLowerCase()) && movementDate.includes(selectedDateFormatted);
  });

  const formatTimestamp = (timestamp) => {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Date(timestamp).toLocaleString('en-US', options);
  };


  const exportToExcel = () => {
    const data = history.map((item, index) => ({
      SI: index + 1,
      sourceWarehouse:
        item?.sourceWarehouse?.warehousename || "Warehouse Removed",
      destinationWarehouse:
        item?.destinationWarehouse?.warehousename || "Warehouse Removed",
      products: item.products
        .map((product) => product.product.productname)
        .join(", "),
      user: item.userId.username,
      timestamp: new Date(item.timestamp).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MovementHistory");
    const excelFileName = "movement_history.xlsx";
    writeFile(wb, excelFileName);
  };

  return (
    <>
       <button
        type="button"
        className="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2"
        onClick={exportToExcel}>
        <i class="mdi mdi-file-excel"></i>
            Export to Excel
        </button>
      {/* <Button style={{backgroundColor: "#00d25b" }} onClick={exportToExcel} className="mb-3">
                Export to Excel
              </Button> */}
      <div>
        <form className="nav-link mt-2 mt-md-0 d-none d-lg-flex search justify-content-end">
          {/* <input
            type="text"
            className="form-control"
            placeholder="Search by Time"
            style={{ width: "500px", borderRadius: "5px", transition: "box-shadow 0.3s ease" }}
            value={timeSearchTerm}
            onChange={(e) => setTimeSearchTerm(e.target.value)}
          /> */}
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            placeholderText="Select Date"
            dateFormat="MM/dd/yyyy"
            className="form-control ml-2"
          />
        </form>
      </div>

      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Movement History</h4>
            <p className="card-description">Transfer &amp; <code>Return</code></p>
            <div className="table-responsive">
              <table className="table table-bordered" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                <thead>
                  <tr>
                    <th>Move ID</th>
                    <th>Source Warehouse Name</th>
                    <th>Destination Warehouse Name</th>
                    <th>Time</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody style={{ borderRadius: '10px', overflow: 'hidden' }}>
                  {filteredHistory.map((movement) => (
                    <tr key={movement._id} style={{ transition: 'background-color 0.3s ease' }}>
                      <td onClick={() => handleOpenModal(movement.products)}>{movement.movement_id}</td>
                      <td>{movement.sourceWarehouse?.warehousename}</td>
                      <td>{movement.destinationWarehouse?.warehousename}</td>
                      <td>{formatTimestamp(movement.timestamp)}</td>
                      <td style={{ color: movement.movementType === 'Transfer' ? 'green' : 'red', transition: 'transform 0.3s ease' }}>{movement.movementType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ModalForm show={isModalOpen} onHide={handleCloseModal} title="Move Product" style={{ maxWidth: '600px', margin: '50px auto' ,borderRadius: "10px"}}>
        {product && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' , borderRadius: "10px"}}>
            <thead>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd', backgroundColor: '#bee6b8',color:'black' }}>Name</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd', backgroundColor: '#bee6b8',color:'black'  }}>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {product.map((item) => (
                <tr key={item.product._id}>
                  <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>{item.product.productname}</td>
                  <td style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ModalForm>
    </>
  );
}

export default HistoryPage;
