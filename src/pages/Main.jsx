import React from "react";
import W9Logo from "../components/images/w95logo.png"
import win95 from "../components/images/win95em.png"
import tumblr from "../components/images/tumblr_fda654985437a7b2664e5833e086c69b_43cf0d59_540.png"
import "./main.css"
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate()
  
  return (
    <div className="App" style={{overflow:"hidden"}}>
      <div className="animation">
        <img alt="" className="wlogo" src={W9Logo} />
      </div>
      
      <div className="intro">
      <div >
        <img alt="" className="win95" src={win95} />
        <img onClick={()=>{navigate("home")}} alt="" className="computer link1" src={tumblr} />
        <p className="enter max-sm:left-[55%] sm:left-[52%] md:left-[51%]">enter</p>
      </div>
      </div>
      
      
    </div>
  );
}

export default Main;
