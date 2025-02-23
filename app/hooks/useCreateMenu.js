import { URL_BASE } from "./env.js";

export default async function useCreateMenu({data}) {
    const request=await fetch(`${URL_BASE}menus`,{
        method:'POST',
        headers: {
            Accept: 'application/json'
        },
        body:new URLSearchParams(data)
    });

    const response=await request.json();

    return response;
}