import { URL_BASE } from "./env.js";

export default async function useCreateItemcart({data}) {
    const request=await fetch(`${URL_BASE}itemcarts`,{
        method:'POST',
        headers: {
            Accept: 'application/json'
        },
        body:new URLSearchParams(data)
    });

    const response=await request.json();

    return response;
}