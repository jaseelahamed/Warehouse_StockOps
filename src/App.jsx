// import { useState } from 'react'
// import Header from "./layout/Header";
import "./App.css";
// import LeftSideBar from "./layout/LeftSideBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserDetails from "./pages/UserDetailsPage";
import { Userpage, Login,Movement,History,Warehouse,Stocks,Return,singlewarhouse } from "./utils/Path_Url";
import LoginForm from "./components/LoginForm";
import MainContainer from "./layout/MainContainer";
import MovementPage from "./pages/MovementPage";
import WarehousePage from "./pages/WarehousePage";
import DashbordPage from "./pages/DashbordPage";
import StockPage from "./pages/StockPage";
import HistoryPage from "./pages/HistoryPage";
import DeathStockPage from "./pages/DeathStockPage";
import SingleWarehouse from "./pages/SingleWarehouse";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={Login} element={<LoginForm />} />

          <Route path="/" element={<MainContainer />}>
            <Route index element={< DashbordPage/>} />

            <Route path={Userpage} element={<UserDetails />} />
            <Route path={Movement} element={<MovementPage />} />
            <Route path={Warehouse} element={<WarehousePage />} />
            <Route path={Stocks} element={<StockPage/>} />
            <Route path={History}  element={ <HistoryPage/>  } />
            <Route path={Return}  element={ <DeathStockPage/>  } />
            <Route path={singlewarhouse}  element={ <SingleWarehouse/>  } />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
