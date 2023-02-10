import React from 'react'
import w95hg1 from "../components/images/w95hg1.png"
import Animate from './Animate'
import "./home.css"


function Home() {
  
  return (
    <>
    
    <div>
      
      <div className="loading">
        <img   alt="" className="hourglass" src={w95hg1}/>
    </div>
    <Animate />
    </div>
    </>

  )
}

export default Home
