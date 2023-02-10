import React, { useEffect } from 'react'
import "./home.css"
import { ethers } from 'ethers'
import { useState } from 'react'
import { generateChar } from '../functions/GenRanChar'
import axios from 'axios'

function Animate() {
  const [prev, setPrev]= useState(false)
  const [wallAddress, setWallAddress] = useState("")
  const [returnChar, setReturnChar] = useState()
  const [showWord, setShowWord] = useState()
  

  const type=(showWord)=>{
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

    let text2 = `<h1>How to mint</h1><p>1. Connect your wallet <br> 2. Identify your assigned letter <br> 3. Find a word with your letter in it (must be red(unclaimed)) <br> 4. Search for peers that will allow you to finish the word <br> 5. Click the word the same time as your friends (you have 30 seconds before it resets) <br> 6. Once the word is fully green, a mint button should appear, click that <br> 7. Confirm the transaction and recieve your nft <br><br>dont refresh or you will have to watch the animation again, the words status are updated live</p><h1 class='stats'>Price : 0.015 <br>Supply : 3000 <br>Supply : ${showWord} </h1>`;
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
  type(showWord)
},[showWord])


const connecWallet=async()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum)
      let signer;
      await provider.send("eth_requestAccounts", []);
      signer  = provider.getSigner();
      const walletAddress = await signer.getAddress()
      setWallAddress(walletAddress);
      setPrev(true)
      const data = {wallet:walletAddress,char:generateChar()}
      const res =  await axios.post("http://localhost:8080/set-data",data)  
      console.log(res.data)

  }
const getData=async()=>{
  const add = {wallet:wallAddress}
  const res2 = await axios.post("http://localhost:8080/get-data",add)
  const ch = res2.data.char
  setShowWord(res2.data.word)
  console.log(ch)
  setReturnChar(ch)
}

const setWord=async(word)=>{
  const add = {wallet:wallAddress,word}
  const res2 = await axios.post("http://localhost:8080/set-data",add)
  console.log(res2.data.word)
  setShowWord(res2.data.word)
}

useEffect(()=>{
  if(wallAddress!=="")
  getData()
},[wallAddress])

console.log(showWord)

const words = ["HELLO","APPLE","FLANK","GHOST","JUMPS","MIZEN","COMIC","RABBIT"]
  return (
    <div>
      
    <div className="bodie">
    {/* <h1 className='text-[#19c50d] absolute bottom-0 '>Selected Word: {showWord}</h1> */}
      <div className='absolute flex flex-col gap-2 top-4 right-4'>
        <button onClick={()=>{connecWallet()}}   className= 'btn text-white hover:bg-[#1ea214] px-6 py-2 rounded-lg bg-[#19c50d] right-8'>Connect</button>    
        <span className='text-white text-[14px] font-semibold' name="address" >{wallAddress?`${wallAddress.substr(0,5)}...${wallAddress.substr(35,28)}`:null}</span>      
      </div>
        <h1 id="myh1" className="header"></h1>
        <span className='text-[#19c50d]'></span>
        <p id="myp1" className="paragraph" ></p>
    </div>
    <div className="words px-6">
    <p className="list grid grid-cols-4 max-md:grid max-md:grid-cols-2 max-sm:grid max-sm:grid-cols-2 gap-10">
        {words.map((item,i)=>item.includes(returnChar)?(<span key={i}  onClick={()=>setWord(item)} className='text-red-600 text-center shadow-[#ff6786] shadow-lg'>{item}</span>):(<span key={i} className='text-white text-center'>{item}</span>)
        )}
        </p>
      
        
    </div>
    </div>

  )
}

export default Animate
