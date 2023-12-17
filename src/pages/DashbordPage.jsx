import React, { useEffect, useRef, useState } from 'react';
import { Container, Col, Form, InputGroup, Button } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import ModalForm from '../components/ModalForm';
import { ApiCall } from '../service/ApiCall';
import { Show_Toast } from "../utils/Toast";
import { useNavigate } from "react-router-dom";
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
import { Bar } from 'react-chartjs-2'
import { Products } from '../utils/Path_Url';

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

  const navigate = useNavigate()
  const [chartdata, setChartdata] = useState([]);
  const barWidth = 60;

  const dashboarddata = async () => {
    try {
      const response = await ApiCall("get", '/stocks/total');

      console.log("response", response);

      // Assuming response.data is an array and you want to sort it based on a specific property
      const sortedData = response?.data.sort((a, b) => b.totalStock - a.totalStock);

      setChartdata(sortedData);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const colors = [
    'rgba(54,162,235,0.6)',
    'rgba(153,102,255,0.6)',
    'rgba(75,192,192,0.6)',
    'rgba(255,99,132,0.6)',
  ];
  const data = {
    labels: chartdata?.map(item => item?.warehouse),
    datasets: [
      {
        label: 'Total Stock',
        data: chartdata?.map(item => item?.totalStock),
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        barThickness: barWidth
      },
    ],
  };
  const options = {
    scales: {
      x: {
        barPercentage: 0.9,
        categoryPercentage: 0.8,
      },
    },
  };

  useEffect(() => {
    dashboarddata();
  }, []);

  const chartRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [productname, setProductname] = useState('');
  const [productid, setProductid] = useState('');
  const [errors, setErrors] = useState({});
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'productname') {
      setProductname(value);
    } else if (name === 'productid') {
      setProductid(value);
    }
  };


  const validateForm = (formData) => {
    const errors = {};

    if (!formData.productname || formData.productname.trim() === "" || !/\S/.test(formData.productname)) {
      errors.productname = "Product name is required and must contain at least one non-space character";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const validationErrors = validateForm({ productname });
  
    setErrors(validationErrors);
    setValidated(true);
  
    if (Object.keys(validationErrors).length === 0 && form.checkValidity()) {
      try {
        const response = await ApiCall('POST', '/products', {
          productname,
        });
  
        if (response.status === 200) {
          Show_Toast(response.message, true);
          setProductname('');
          navigate(Products);
          // Additional logic after a successful API call
        } else {
          Show_Toast('Failed to add product:', response.message, false);
        }
      } catch (error) {
        console.error('Error adding product:', error.message);
      } finally {
        handleCloseModal();
      }
    }
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

        <Bar data={data} options={options}>

        </Bar>

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
                placeholder="Enter Product Name"
                name="productname"
                value={data?.productname }
                onChange={handleInputChange}
                aria-describedby="inputGroupPrepend"
                isInvalid={!!errors.productname}
    />
    <Form.Control.Feedback type="invalid">
    {errors.productname}
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
