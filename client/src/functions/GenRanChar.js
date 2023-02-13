import axios from "axios";
import { BACKEND } from '../config'


export const generateChar=async(wallAddress)=>{
    const add = { wallet:wallAddress }
    const res2 = await axios.post(BACKEND + "/get-data", add)
    console.log()
    if(res2.status ===200) return null
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    let result = characters.charAt(Math.floor(Math.random() * charactersLength));
    alert(result)
    return result
    
}
