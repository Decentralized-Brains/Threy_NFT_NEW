import axios from 'axios'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import abi from "../abi.json"
import { BACKEND } from '../config'
import { generateChar } from '../functions/GenRanChar'
import "./home.css"


function Animate() {
  const [words, setWords] = useState([])
  const [wordsTMP, setWordsTMP] = useState([])
  const [wallAddress, setWallAddress] = useState("")
  const [returnChar, setReturnChar] = useState()
  const [wordVisibilty, setwordVisibilty] = useState()
  const [wordeLenCounter, setWordLenCounter] = useState()
  const [mintWordCount, setMinWordCount] = useState()
  const [ownerAddress, setOwnerAddress] = useState("0xe5D16741A7E81eC488A48EeA19A6Ba22cC7748Fd")
  const [wordPrevMode, setWordPrevMode] = useState(false)
  const [seeButton, setButton] = useState(false)
  const [listedValue, setListedValue] = useState()
  const prvt_key = process.env.REACT_APP_PRIVATE_KEY
  
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
    }, 15000);
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }
  }

  const getWordsFromDatabase = async () => {
    const res = await axios.get(BACKEND + "/get-words")
    const w = res.data.map(w => w.word)
    
    setWords(w)
    setWordsTMP(res.data)
  }

useEffect(() => {
  getWordsFromDatabase()
  heightScroll()  
  type()
  }, [])


  const connecWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    const walletAddress = await signer.getAddress()
    setWallAddress(walletAddress)

    const data = { wallet: walletAddress, char: generateChar() }
    await axios.post(`${BACKEND}/set-data`, data)

    const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, abi, signer);
    const whiteListed = await contract.whiteListed(walletAddress)
    setListedValue(parseInt(whiteListed))
  }

  const getData = async () => {
    if (!wallAddress) return
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

  const setWord = async (word, idx) => {
    await getWordsFromDatabase()
    
    let claimedIdx = -1
    if(listedValue===0){
    let history = wordsTMP[idx].taken
    for (let i = 0; i < word.length; i++) {
      if (history[i] || word.charAt(i) !=  returnChar) continue
      claimedIdx = i
    }
    
    if (claimedIdx == -1) return window.alert("You cant choose this word.no char is free")
    const add = { wallet: wallAddress, word, claimedIdx }
    await axios.post(BACKEND + "/set-data", add)
  }
  else {
    alert("You Can't Change Word. You are Whitelisted! ")
  }
    getData()
    getWordsFromDatabase()
    getSelectedWords()
  }



  const getSelectedWords = async (word) => {

    const wordsArr = []
    const sendData = { word: wordVisibilty }
    const words = await axios.post(BACKEND + "/get-selected-words", sendData)
    // console.log(mintWordCount , wordeLenCounter, wallAddress)
    if (mintWordCount === wordeLenCounter && wallAddress === ownerAddress) {
      { words.data.map((item, i) => wordsArr.push(item.wallet)) }
      whiteList(wordsArr)
    }
  }


  const getMintWord = async () => {
    const mintWord = await axios.post(BACKEND + "/get-word-count", { word: wordVisibilty })
    setMinWordCount(mintWord.data.count)
    setButton(true)

  }



  const mintNft = async () => {
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    let signer;
    signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const cn = await contract.safeMint(wallAddress, wordVisibilty, { gasLimit: 3000000 });
    // console.log(cn)

  }

  const whiteList = async (arr) => {
    
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    let signer = new ethers.Wallet(prvt_key,provider)
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const cnn = await contract.whiteList(arr, { gasLimit: 3000000 })
  }



  const getAlert =(item,returnChar)=>{
    alert(` You Selected "${item}" `)
  }

  useEffect(() => {
    if (wallAddress !== "")
    {
    getData()
    getMintWord()
    if(mintWordCount && wordeLenCounter)
    getSelectedWords()
  }
    
  }, [wallAddress,mintWordCount, wordeLenCounter ])

  const checkWord = (item, idx) => {
    let res = []
    let history = wordsTMP[idx].taken
    for (let i = 0; i < item.length; i++) {
      if (history[i]) res.push(<span className='char-taken text-[#00FF00]'>{item.charAt(i)}</span>)
      else res.push(item.charAt(i))
    }
    return res
  }



  return (
    <div>
      <div className="bodie">
        <div className='absolute flex flex-col items-end gap-2 top-4 right-4'>
          <div className='flex gap-4'>
            {mintWordCount === wordeLenCounter && seeButton ? <button onClick={() => { mintNft() }} className='btn text-white hover:bg-[#1ea214] px-10 py-2 rounded-lg bg-[#19c50d]'>Mint</button> : null}
          
            <button onClick={connecWallet} className='btn text-white hover:bg-[#1ea214] px-8 py-2 rounded-lg bg-[#19c50d] right-8'>{wallAddress?"Connected":"Connect"}</button>

          </div>
          <div className='flex flex-col p-2'>
            <span className='text-white text-[14px] font-semibold' name="address" >{wallAddress ? `${wallAddress.substr(0, 5)}...${wallAddress.substr(35, 28)}` : null}</span>

            {wordVisibilty !== undefined ? <h1 className='text-white text-[14px] font-semibold'>Selected: <span className='text-[#42f435]'>{wordVisibilty}</span></h1> : null}
            {returnChar ? <span className='text-white'>Character: <span className='text-[#42f435] font-semibold'> {returnChar} </span></span> : null}
          </div>
        </div>
        <h1 id="myh1" className="header"></h1>
        <span className='text-[#00FF00]'></span>
        <p id="myp1" className="paragraph" ></p>
      </div>

      <div className="words">
        <p className="list grid grid-cols-4 max-md:grid max-md:grid-cols-2 max-sm:grid max-sm:grid-cols-2 px-4 gap-4">
          {words.map((item, i) => item.includes(returnChar) ? (<span key={i} onClick={() => {getAlert(item,returnChar); setWord(item,i)}} className='text-red-600 text-center hover:cursor-pointer shadow-[#7a2b3b] shadow-lg'>{checkWord(item, i)}</span>) : (<span key={i} className='text-white text-center'>{checkWord(item, i)}</span>)
          )}
        </p>
      </div>
    </div>

  )
}

export default Animate
