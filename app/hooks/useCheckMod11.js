import { URL_BASE } from "./env.js";

export default async function useCheckMod11({clave_acceso}) { 
    const request=await fetch(`${URL_BASE}vouchers/mod11?clave_acceso=${clave_acceso}`,{
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });

    if(request.ok){
        const response=await request.json();
        return response;
    }else{
        return false;
    }
}