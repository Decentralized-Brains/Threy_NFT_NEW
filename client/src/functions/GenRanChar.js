import axios from "axios";
import { BACKEND } from '../config'


export const generateChar=()=>{
   
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    let result = characters.charAt(Math.floor(Math.random() * charactersLength));
    // alert(result)
    return result
    
}
