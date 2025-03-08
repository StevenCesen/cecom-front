import { URL_BASE } from "./env.js";

export default async function useUpdateOrder({id}) {
    const request=await fetch(`${URL_BASE}orders/${id}`,{
        method:'PUT',
        headers: {
            Accept: 'application/json'
        }
    });
    const response=await request.json();
    return response;
}