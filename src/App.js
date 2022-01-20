import React from "react";
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";
//import แบบการสลายโครงสร้าง BrowserRouter เเปลงเป็น Router, Routes, Route 
import Home from "./pages/Home"
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ErrorPage from "./pages/ErrorPage";
import Menu from "./components/Menu";
//import ไฟล์ต่างๆ


// function App ที่รีเทิร์น Dom
function App() {
  return (
    <Router>
      <Menu/>
      <Routes>
        // หน้าที่เเสดงจะเปลี่ยนไปตาม path
        <Route path = "/"  element={<Home/>}/>
        <Route path = "/add"  element={<AddProduct/>}/>
        <Route path = "/edit/:id"  element={<EditProduct/>}/>
        <Route path = "*"  element={<ErrorPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
