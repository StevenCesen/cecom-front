import { URL_BASE } from "./env.js";

export default async function useGetTicket({id}) {
    const request=await fetch(`${URL_BASE}tickets/${id}`,{
        headers: {
            Accept: 'application/json'
        }
    });
    
    const response=await request.json();

    return response;
}