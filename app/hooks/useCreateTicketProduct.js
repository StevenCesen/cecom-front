import { URL_BASE } from "./env.js";

export default async function useCreateTicketProduct({data}) {
    const request=await fetch(`${URL_BASE}costs`,{
        method:'POST',
        headers: {
            Accept: 'application/json'
        },
        body:new URLSearchParams(data)
    });

    const response=await request.json();

    return response;
}