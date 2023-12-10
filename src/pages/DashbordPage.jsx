import React, { useEffect, useRef, useState } from 'react';
import { Container, Col, Form, InputGroup, Button } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import ModalForm from '../components/ModalForm';
import { ApiCall } from '../service/ApiCall';
import { Show_Toast } from "../utils/Toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {Bar} from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend,
ArcElement,
)


function DashbordPage() {


  const [chartdata, setChartdata] = useState([]);

  console.log("stocks",chartdata)
  const barWidth = 60; 

  const dashboarddata = async () => {
    try {
      const response = await ApiCall("get", '/stocks/total');
  
      console.log("response", response);
  
      // Assuming response.data is an array and you want to sort it based on a specific property
      const sortedData = response?.data.sort((a, b) => a.someProperty - b.someProperty);
  
      setChartdata(sortedData);
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
 
  useEffect(() => {
    dashboarddata();
  }, []);


  const chartRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [ productname, setProductname] = useState('');
  const [productid, setProductid] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setProductname(value);
    } else if (name === 'productid') {
      setProductid(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        const response = await ApiCall('POST', '/products', {
         productname,
         productid ,
        });

        if (response.status === 200) {
          Show_Toast(response.message,true,);
          // Additional logic after successful API call
        } else {
          Show_Toast('Failed to add product:', response.message,false);
        }
      } catch (error) {
        console.error('Error adding product:', error.message);
      } finally {
        handleCloseModal();
      }
    }

    setValidated(true);
  };

 
  return (
    <>
      <button
        type="button"
        className="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2"
        onClick={handleOpenModal}
      >
        <i className="mdi mdi-account-plus"></i> Add New Product
      </button>

     
      
      <Container>
      <div class="row">
      {chartdata.map((chartData) => (
        <div key={chartData._id} className="col-sm-4 grid-margin">
          <div className="card">
            <div className="card-body">
              
              <h2>{chartData.warehouse}</h2>  
              <div className="row">
                <div className="col-8 col-sm-12 col-xl-8 my-auto">
                  <div className="d-flex d-sm-block d-md-flex align-items-center">
                    <h3 className="mb-0">Total Stock:{chartData.totalStock}</h3>
                  </div>
                </div>
                <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                  {/* <i className="icon-lg mdi mdi-codepen text-primary ml-auto"></i> */}
                  <i class="icon-lg mdi mdi-monitor text-success ml-auto"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
              {/* <div class="col-sm-4 grid-margin">
                <div class="card">
                  <div class="card-body">
                    <h5>Sales</h5>
                    <div class="row">
                      <div class="col-8 col-sm-12 col-xl-8 my-auto">
                        <div class="d-flex d-sm-block d-md-flex align-items-center">
                          <h2 class="mb-0">$45850</h2>
                          <p class="text-success ml-2 mb-0 font-weight-medium">+8.3%</p>
                        </div>
                        <h6 class="text-muted font-weight-normal"> 9.61% Since last month</h6>
                      </div>
                      <div class="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                        <i class="icon-lg mdi mdi-wallet-travel text-danger ml-auto"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-4 grid-margin">
                <div class="card">
                  <div class="card-body">
                    <h5>Purchase</h5>
                    <div class="row">
                      <div class="col-8 col-sm-12 col-xl-8 my-auto">
                        <div class="d-flex d-sm-block d-md-flex align-items-center">
                          <h2 class="mb-0">$2039</h2>
                          <p class="text-danger ml-2 mb-0 font-weight-medium">-2.1% </p>
                        </div>
                        <h6 class="text-muted font-weight-normal">2.27% Since last month</h6>
                      </div>
                      <div class="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                        <i class="icon-lg mdi mdi-monitor text-success ml-auto"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
      </Container>

      <ModalForm
        show={isModalOpen}
        onHide={handleCloseModal}
        title="Add New Product"
      >
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group as={Col} controlId="validationCustom01">
            <Form.Label className="mb-1">Product Name</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                required
                type="text"
                placeholder="Enter product name"
                name="username"
                value={productname}
                onChange={handleInputChange}
                aria-describedby="inputGroupPrepend"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a product name.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" as={Col} controlId="validationCustom02">
            <Form.Label className="mb-1 mt-4">Product ID</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                required
                type="text"
                placeholder="Enter product ID"
                name="productid"
                value={productid}
                onChange={handleInputChange}
                aria-describedby="inputGroupPrepend"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a product ID.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <div className="d-flex justify-content-end mt-4">
            <Button
              type="submit"
              variant="primary"
              style={{ backgroundColor: '#00d25b', borderColor: '#00d25b' }}
            >
              Submit
            </Button>
          </div>
        </Form>
      </ModalForm>
      <ModalForm>
        
      </ModalForm>
    </>
  );
}

export default DashbordPage;
