import { URL_BASE } from "./env.js";

export default async function useCloseTicket({data,id}) {
    const request=await fetch(`${URL_BASE}tickets/${id}`,{
        method:'PUT',
        headers: {
            Accept: 'application/json'
        },
        body:new URLSearchParams(data)
    });

    const response=await request.json();

    return response;
}