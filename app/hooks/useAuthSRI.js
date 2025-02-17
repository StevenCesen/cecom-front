import { URL_AUTH_PROD } from "./env.js";

export default async function useAuthSRI({ambiente,codificado,ruc,clave_acceso}) {  
    const formdata=new FormData();
    formdata.append('ambiente',ambiente);
    formdata.append('xml',codificado);
    formdata.append('clave_acceso',clave_acceso);
    formdata.append('ruc',ruc);
    
    const request=await fetch(URL_AUTH_PROD,{
        method:'POST',
        body:formdata
    });

    const response=await request.json();

    return response;
}