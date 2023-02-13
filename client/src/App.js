import React from "react";
import Home from "./pages/Home";
import {BrowserRouter,Route, Routes } from "react-router-dom";
import Main from "./pages/Main";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}/>
        <Route path="/home" element={<Home />} />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
