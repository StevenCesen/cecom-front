import { URL_BASE } from "./env.js";

export default async function useGetOrder({id}) {
    const request=await fetch(`${URL_BASE}orders/${id}`,{
        headers: {
            Accept: 'application/json'
        }
    });

    const response=await request.json();

    return response;
}