import React, { useState } from 'react'
import w95hg1 from "../components/images/w95hg1.png"
import Animate from './Animate'
import "./home.css"


function Home() {
  const [pre, setPre] = useState(false)
  
  return (
    <>
    <div>
      <div className="loading">
        <img alt="" className="hourglass" src={w95hg1} onAnimationEnd={()=>{setPre(true);setTimeout(()=>{},3000)}}/> 
    </div>
    {pre?
    <Animate />
    :null}
    </div>
    </>

  )
}

export default Home
