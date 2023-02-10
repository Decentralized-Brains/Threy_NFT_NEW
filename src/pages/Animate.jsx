import React, { useEffect } from 'react'
import "./home.css"
import { ethers } from 'ethers'
import { useState } from 'react'
import { generateChar } from '../functions/GenRanChar'
import axios from 'axios'

function Animate() {
  const [prev, setPrev]= useState(false)
  const [getChar,setGetChar] = useState(false)
  const [wallAddress, setWallAddress] = useState("")
  

  const type=()=>{
  var images = document.querySelectorAll('img');
  for (var i = 0; i < images.length; i++) {
      images[i].ondragstart = function() {
          return false;
      };
  }
  
  var text1 = "< / >";
  var counter1 = 0;
  var elem1 = document.getElementById("myh1");
  var intervalId1;
  
  setTimeout(function(){
      intervalId1 = setInterval(typeWriter1, 75);
  }, 2000);
  
  function typeWriter1() {
      if (counter1 === text1.length) {
        clearInterval(intervalId1);
        return;
      }
      elem1.innerHTML = elem1.innerHTML+text1.substr(counter1,1);
      counter1++;
    }
    
    // Start Function 2

    var text2 = "<h1>How to mint</h1><p>1. Connect your wallet <br> 2. Identify your assigned letter <br> 3. Find a word with your letter in it (must be red(unclaimed)) <br> 4. Search for peers that will allow you to finish the word <br> 5. Click the word the same time as your friends (you have 30 seconds before it resets) <br> 6. Once the word is fully green, a mint button should appear, click that <br> 7. Confirm the transaction and recieve your nft <br><br>dont refresh or you will have to watch the animation again, the words status are updated live</p><h1 class='stats'>Price : 0.015 <br> Supply : 3000 </h1>";
    var counter2 = 0;
    var intervalId2;
    
    setTimeout(function(){
        intervalId2 = setInterval(typeWriter2, 15);
    }, 4000);
    
    function typeWriter2() {
      document.getElementById("myp1").innerHTML = text2.substr(0,counter2);
      counter2++;
      if (counter2 > text2.length) {
          clearInterval(intervalId2);
          return;
      }
    }
  
    window.onload = function() {
      // Get the current scroll position
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
      // Disable scrolling
      document.body.style.overflow = "hidden";
    
      // Wait for 10 seconds
      setTimeout(function() {
        // Re-enable scrolling and set the scroll position back to where it was
        document.body.style.overflow = "";
        window.scrollTo(scrollLeft, scrollTop);
      }, 12000);
  
      window.onbeforeunload = function () {
        window.scrollTo(0, 0);
      }
      
    };
}

useEffect(()=>{
  type()
},[])


const connecWallet=async()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum)
      let signer;
      await provider.send("eth_requestAccounts", []);
      signer  = provider.getSigner();
      const walletAddress = await signer.getAddress()
      setWallAddress(walletAddress);
      setPrev(true)
      const data = {Wallet:walletAddress,Character:generateChar()}
      await axios.post("http://localhost:8080/getData",data).then((respose)=>{console.log("Hello")}) 
  }
const getCharr=async()=>{
  const add = {address:wallAddress}
  await axios.post("http://localhost:8080/getChar",add).then((respose)=> console.log(respose)).catch(err => console.log(err)) 
      // console.log(add.address)
}

const getC=async()=>{
  await axios.get("http://localhost:8080/getChar",async(req,res)=>{
    console.log(req.body)
  })
}

useEffect(()=>{
  if(wallAddress!=="")
  getCharr()
  getC()
},[wallAddress])

  const chars = ["H","M","I","N"]
  const words = ["HELLO","CAT","DOG","APPLE"]
  return (
    <div>
    <div className="bodie">
      <div className='absolute flex flex-col gap-2 top-4 right-4'>
        <button onClick={()=>{setGetChar(true);connecWallet()}}   className= 'btn text-white hover:bg-[#1ea214] px-6 py-2 rounded-lg bg-[#19c50d] right-8'>Connect</button>    
        <span className='text-white text-[14px] font-semibold' name="address" >{wallAddress?`${wallAddress.substr(0,5)}...${wallAddress.substr(35,28)}`:null}</span>      
      </div>
        <h1 id="myh1" className="header"></h1>
        <span className='text-[#19c50d]'></span>
        <p id="myp1" className="paragraph" ></p>
    </div>
    <div className="words px-6">
    <p className="list grid grid-cols-5 max-md:grid max-md:grid-cols-2 max-sm:grid max-sm:grid-cols-2 gap-14">
        
          
        {words.map((w,k)=><span key={k} className='text-white'>{w.includes("A")?<span className='text-red-500'>{w}</span>:<span>{w}</span>}</span>)}
        </p>
      
        
    </div>
    </div>

  )
}

export default Animate
