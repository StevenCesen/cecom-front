import { URL_BASE } from "./env.js";

export default async function useGetOrdersMesero({contributor_id,filters}) {
    const request=await fetch(`${URL_BASE}contributors/${contributor_id}/ordersmesero?${filters}`,{
        headers: {
            Accept: 'application/json'
        }
    });

    const response=await request.json();

    return response;
}