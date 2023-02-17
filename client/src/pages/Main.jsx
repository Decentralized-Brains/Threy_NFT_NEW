import React from "react";
import W9Logo from "../components/images/w95logo.png"
import win95 from "../components/images/win95em.png"
import tumblr from "../components/images/tumblr_fda654985437a7b2664e5833e086c69b_43cf0d59_540.png"
import "./main.css"
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate()

  const heightScroll = function () {
    // Get the current scroll position
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    // Disable scrolling
    document.body.style.overflow = "hidden";
    // Wait for 10 seconds
    setTimeout(function () {
      // Re-enable scrolling and set the scroll position back to where it was
      document.body.style.overflow = "";
      window.scrollTo(scrollLeft, scrollTop);
    }, 16000);
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }
  }
  return (
    <div className="App" style={{overflow:"hidden"}}>
      <div className="animation">
        <img alt="" className="wlogo" src={W9Logo} />
      </div>
      
      <div className="intro">
      <div>
        <img alt="" className="win95" src={win95} />
        <div className="align--pc">
        <img onClick={()=>{navigate("home");heightScroll()}} alt="" className="computer link1" src={tumblr} />
        <p className="enter">enter</p>
        </div>
      </div>
      </div>
      
      
    </div>
  );
}

export default Main;
