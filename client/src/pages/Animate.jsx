import axios from 'axios'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import abi from "../abi.json"
import { BACKEND } from '../config'
import { generateChar } from '../functions/GenRanChar'
import words from "./Words"
import "./home.css"



function Animate() {
  const [prev, setPrev] = useState(false)
  const [wallAddress, setWallAddress] = useState("")
  const [returnChar, setReturnChar] = useState()
  const [wordVisibilty, setwordVisibilty] = useState()
  const [wordeLenCounter, setWordLenCounter] = useState()
  const [mintWordCount, setMinWordCount] = useState()
  const [ownerAddress, setOwnerAddress] = useState("0xe5D16741A7E81eC488A48EeA19A6Ba22cC7748Fd")
  const [wordPrevMode, setWordPrevMode] = useState(false)





  const type = (showWord) => {
    let images = document.querySelectorAll('img');
    for (let i = 0; i < images.length; i++) {
      images[i].ondragstart = function () {
        return false;
      };
    }

    let text1 = "< / >";
    let counter1 = 0;
    let elem1 = document.getElementById("myh1");
    let intervalId1;

    setTimeout(function () {
      intervalId1 = setInterval(typeWriter1, 75);
    }, 2000);

    function typeWriter1() {
      if (counter1 === text1.length) {
        clearInterval(intervalId1);
        return;
      }
      elem1.innerHTML = elem1.innerHTML + text1.substr(counter1, 1);
      counter1++;
    }

    // Start Function 2
    let text2 = `<h1>How to mint</h1><p>1. Connect your wallet <br> 2. Identify your assigned letter <br> 3. Find a word with your letter in it (must be red(unclaimed) <br> 4. Search for peers that will allow you to finish the word <br> 5. Click the word the same time as your friends (you have 30 seconds before it resets) <br> 6. Once the word is fully green, a mint button should appear, click that <br> 7. Confirm the transaction and recieve your nft <br><br>dont refresh or you will have to watch the animation again, the words status are updated live</p><h1 class='stats'>Price : 0.015 <br>Supply : 3000 <br></h1>`;
    let counter2 = 0;
    let intervalId2;

    setTimeout(function () {
      intervalId2 = setInterval(typeWriter2, 15);
    }, 4000);

    function typeWriter2() {
      document.getElementById("myp1").innerHTML = text2.substr(0, counter2);
      counter2++;
      if (counter2 > text2.length) {
        clearInterval(intervalId2);
        return;
      }
    }
    
  }
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
    }, 18000);
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }
  }


useEffect(() => {
  heightScroll()  
  type()
  }, [])


  const connecWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    let signer;
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    const walletAddress = await signer.getAddress()
    setWallAddress(walletAddress);
    const generatedChar = generateChar()
    setPrev(true)
    const data = { wallet: walletAddress, char: generatedChar }
    const res = await axios.post(BACKEND + "/set-data", data)

  }

  const getData = async () => {
    const add = { wallet: wallAddress }
    const res2 = await axios.post(BACKEND + "/get-data", add)
    setReturnChar(res2.data.char)
    setwordVisibilty(res2.data.word)
    setWordPrevMode(true)
    try {
      const wordLengthCounter = (res2.data.word.length)
      setWordLenCounter(wordLengthCounter)
    } catch (e) { }
  }

  const setWord = async (word) => {
    const add = { wallet: wallAddress, word }
    const res3 = await axios.post(BACKEND + "/set-data", add)
    console.log(add)
    console.log(res3)
    getData()
  }


  const getSelectedWords = async (word) => {

    const wordsArr = []
    const sendData = { word: wordVisibilty }
    const words = await axios.post(BACKEND + "/get-selected-words", sendData)
    if (mintWordCount === wordeLenCounter && wallAddress == ownerAddress) {
      { words.data.map((item, i) => wordsArr.push(item.wallet)) }
      whiteList(wordsArr)
    }
  }


  const getMintWord = async () => {
    const mintWord = await axios.post(BACKEND + "/get-word-count", { word: wordVisibilty })
    setMinWordCount(mintWord.data.count)
  }

  const mintNft = async () => {
    const contractAddress = "0xA4c9351D9653d362E975D234bB9ca775Fb78aeF8"
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    let signer;
    signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const cn = await contract.safeMint(wallAddress, wordVisibilty, { gasLimit: 3000000 });
    console.log(cn)

  }

  const whiteList = async (arr) => {
    const contractAddress = "0xA4c9351D9653d362E975D234bB9ca775Fb78aeF8"
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    let signer;
    signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const cnn = await contract.whiteList(arr, { gasLimit: 3000000 })
  }

  useEffect(() => {
    if (wallAddress !== "")
      getData()
    getMintWord()
    getSelectedWords()
  }, [wallAddress, getData()])

  // const words = ["HELLO", "APPLE", "FLANK", "GHOST", "JUMPS", "MIZEN", "COMIC", "RABBIT", "YOURK", "QUEEN", "VOWEL","ANNEX"]
  return (
    <div>
      <div className="bodie">
        <div className='absolute flex flex-col items-end gap-2 top-4 right-4'>
          <div className='flex gap-4'>
            {mintWordCount === wordeLenCounter ? <button onClick={() => { mintNft() }} className='btn text-white hover:bg-[#1ea214] px-10 py-2 rounded-lg bg-[#19c50d]'>Mint</button> : null}
          
            <button onClick={() => { connecWallet() }} className='btn text-white hover:bg-[#1ea214] px-8 py-2 rounded-lg bg-[#19c50d] right-8'>{prev?"Connected":"Connect"}</button>

          </div>
          <div className='flex flex-col p-2'>
            <span className='text-white text-[14px] font-semibold' name="address" >{wallAddress ? `${wallAddress.substr(0, 5)}...${wallAddress.substr(35, 28)}` : null}</span>

            {wordVisibilty !== undefined ? <h1 className='text-white text-[14px] font-semibold'>Selected: <span className='text-[#42f435]'>{wordVisibilty}</span></h1> : null}
            {returnChar ? <span className='text-white'>Character: <span className='text-[#42f435] font-semibold'> {returnChar} </span></span> : null}
          </div>


        </div>
        <h1 id="myh1" className="header"></h1>
        <span className='text-[#19c50d]'></span>
        <p id="myp1" className="paragraph" ></p>
      </div>

      <div className="words">
        <p className="list grid grid-cols-4 max-md:grid max-md:grid-cols-2 max-sm:grid max-sm:grid-cols-2 gap-6">
          {words.map((item, i) => item.includes(returnChar) ? (<span key={i} onClick={() => { setWord(item) }} className='text-red-600 text-center hover:cursor-pointer shadow-[#7a2b3b] shadow-lg'>{item}</span>) : (<span key={i} className='text-white text-center'>{item}</span>)
          )}
        </p>
      </div>
    </div>

  )
}

export default Animate
