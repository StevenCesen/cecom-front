import { URL_BASE } from "./env.js";

export default async function useCreateInteraction({data}) {
    const request=await fetch(`${URL_BASE}interactions`,{
        method:'POST',
        headers: {
            Accept: 'application/json'
        },
        body:new URLSearchParams(data)
    });

    const response=await request.json();

    return response;
}