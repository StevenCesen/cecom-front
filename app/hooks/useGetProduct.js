import { URL_BASE } from "./env.js";

export default async function useGetProduct({id}) {
    const request=await fetch(`${URL_BASE}products/${id}`,{
        headers: {
            Accept: 'application/json'
        }
    });

    const response=await request.json();

    return response;
}