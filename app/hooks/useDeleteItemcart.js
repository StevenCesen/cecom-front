import { URL_BASE } from "./env.js";

export default async function useDeleteItemcart({id}) {
    const request=await fetch(`${URL_BASE}itemcarts/${id}`,{
        method:'DELETE',
        headers: {
            Accept: 'application/json'
        }
    });

    const response=await request.json();

    return response;
}