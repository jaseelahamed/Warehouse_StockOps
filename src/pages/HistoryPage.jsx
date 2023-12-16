import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ApiCall } from "../service/ApiCall";
import ModalForm from "../components/ModalForm";
import { Button } from "react-bootstrap";
import { writeFile } from "xlsx";
import * as XLSX from "xlsx";
import 'react-datepicker/dist/react-datepicker.css';

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState();
  const [timeSearchTerm, setTimeSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
console.log(history,"history time")
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
      console.log(apiResponse,"apiresponse")
      if (apiResponse.status === 200) {
        setHistory(apiResponse.data.data);
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
    const movementDate = new Date(movement.createdAt).toLocaleDateString().toLowerCase();
    const selectedDateFormatted = selectedDate ? selectedDate.toLocaleDateString().toLowerCase() : "";
    return movementDate.includes(timeSearchTerm.toLowerCase()) && movementDate.includes(selectedDateFormatted);
  });

  const formatTimestamp = (createdAt) => {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Date(createdAt).toLocaleString('en-US', options);
  };


  const exportToExcel = () => {
    const data = history.map((item, index) => ({
      SI: index + 1,
      sourceWarehouse:
        item?.sourceWarehouse?.warehousename || "Warehouse Removed",
      destinationWarehouse:
        item?.destinationWarehouse?.warehousename || "Warehouse Removed",
      moveditems: item.products
        .map((product) => product.product.productname)
        .join(", "),
      user: item.userId.username,
      timestamp: new Date(item.createdAt).toLocaleString(),
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
   
      <div>
        <form className="nav-link mt-2 mt-md-0 d-none d-lg-flex search justify-content-end" style={{  marginBottom: "10px" }}>
         
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            placeholderText="Select Date"
            dateFormat="MM/dd/yyyy"
          
            className="form-control ml-2 custom-datepicker"
           
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
                    <th>Moved Items</th>
                    
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody style={{ borderRadius: '10px', overflow: 'hidden' }}>
                  {filteredHistory.map((movement,index) => (
                    <tr key={movement._id} style={{ transition: 'background-color 0.3s ease' }}>
                      <td>{ index+1}</td>
           
                      <td>{movement.sourceWarehouse?.warehousename}</td>
                      <td>{movement.destinationWarehouse?.warehousename}</td>
                      <td>{formatTimestamp(movement.createdAt)}</td>
           <td onClick={() => handleOpenModal(movement.products)}   style={{
    textDecoration: 'none',
    color: 'rgba(153,102,255,0.6)',
    transition: 'transform 0.3s',
    // display: 'inline-block', // Ensures inline display
  }}
  onMouseOver={(e) => (e.target.style.transform = 'translateY(-2px)')}
  onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}>          <i class="mdi mdi-shopping">Click</i></td>
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
              <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                
                  <div className="table-responsive">
          <table className="table table-bordered" style={{ borderRadius: '10px', overflow: 'hidden' }}>
            <thead>
              <tr>
                <th style={{  backgroundColor: '',color:'white' }}>Name</th>
                <th style={{ color:'white'  }}>Quantity</th>
              </tr>
            </thead>
            <tbody style={{ borderRadius: '10px', overflow: 'hidden' }}>
              {product.map((item) => (
                <tr key={item.product._id}>
                  <td  style={{ color:'white'  }}>{item.product.productname}</td>
                  <td style={{ color:'white'  }}>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
                  </table>
                  </div>
                  </div>
                  </div>
                  </div>
        )}
      </ModalForm>
    </>
  );
}

export default HistoryPage;
