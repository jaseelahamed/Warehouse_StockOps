import React, { useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import Chart from 'chart.js/auto';

function DashbordPage() {
  const chartRef = useRef(null);

  useEffect(() => {
    const xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
    const yValues = [55, 49, 44, 24, 15];
    const barColors = ["red", "green", "blue", "orange", "brown"];

    const ctx = chartRef.current.getContext('2d');
    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
      options: {
        legend: { display: false },
        scales: {
          y: {
            beginAtZero: true
          }
        },
        title: {
          display: true,
          text: "World Wine Production 2018"
        }
      }
    });

    // Cleanup on component unmount
    return () => {
      myChart.destroy();
    };
  }, []);
  return (
      <>
      <Container>

<div className="row ">
<div className="col-xl-3 col-sm-6 grid-margin">
  <div className="card">
    <div className="card-body">
      <div className="row">
        <div className="col-9">
           <div className="d-flex align-items-center align-self-start">
            <h6 className="mb-0">Total Stock</h6>
          </div> 
        </div>
      </div>
      <h6 className="text-muted font-weight-normal">2324</h6>
    </div>
  </div>
</div>
<div className="col-xl-3 col-sm-6 grid-margin">
  <div className="card ">
    <div className="card-body">
      <div className="row">
        <div className="col-9">
          <div className="d-flex align-items-center align-self-start">

            <h6 className="mb-0">Total User</h6>
          </div>
        </div>
      </div>
      <h6 className="text-muted font-weight-normal">5432</h6>
    </div>
  </div>
</div>
<div className="col-xl-3 col-sm-6 grid-margin">
  <div className="card " >
    <div className="card-body">
      <div className="row">
        <div className="col-9">
          <div className="d-flex align-items-center align-self-start">
            <h5 className="mb-0">Total Warehouse</h5>
          </div>
        </div>
      </div>
      <h6 className="text-muted font-weight-normal">6543</h6>
    </div>
  </div>
</div>
<div className="col-xl-3 col-sm-6 grid-margin">
  <div className="card ">
    <div className="card-body">
      <div className="row">
        <div className="col-9">
          <div className="d-flex align-items-center align-self-start">
            <h5 className="mb-0">Dead Stock</h5>
          </div>
        </div>
      </div>
      <h6 className="text-muted font-weight-normal">4567</h6>
    </div> 
  </div>
</div>
</div>
{/* <ChartComponent /> */}
{/* Bar Chart */}
<div style={{ display: 'flex', justifyContent: 'center' }}>
        <canvas ref={chartRef} style={{ width: '100%', maxWidth: '600px' }}></canvas>
      </div>
































{/*   */}



</Container>

      </>
  )
}

export default DashbordPage