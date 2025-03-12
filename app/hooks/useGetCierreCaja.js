import { URL_BASE } from "./env.js";

export default async function useGetCierreCaja({contributor_id,filters}) {
    const request=await fetch(`${URL_BASE}contributors/${contributor_id}/reports?${filters}`,{
        headers: {
            Accept: 'application/json'
        }
    });
    
    const response=await request.json();

    return response;
}