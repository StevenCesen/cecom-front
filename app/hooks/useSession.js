import { URL_BASE } from "./env.js";

export default function useSession(){
    if(localStorage.getItem('tk')!==null & localStorage.getItem('tk')!==""){
        // const request=await fetch(`${URL_BASE}users/token`,{
        //     headers: {
        //         Accept: 'application/json',
        //         Authorization: `Bearer ${localStorage.getItem('token')}`
        //     }
        // });
        
        // if(request.status===401){
        //     return 401;
        // }else{
        //     const response=await request.json(); // TRUE: Token válido o FALSE: Token expirado
        //     return response;
        // }
        return true;
    }else{
        return false;
    }
}