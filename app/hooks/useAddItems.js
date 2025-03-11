import { URL_BASE } from "./env.js";

export default async function useAddItems({body}) {
    const request=await fetch(`${URL_BASE}orders/additems`,{
        method:'POST',
        headers: {
            Accept: 'application/json'
        },
        body:new URLSearchParams(body)
    });
    const response=await request.json();
    return response;
}