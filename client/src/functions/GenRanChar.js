

export const generateChar=()=>{
    const characters ='abcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let result = characters.charAt(Math.floor(Math.random() * charactersLength));
    // alert(result)
    return result
    
}
