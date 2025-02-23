import { URL_BASE } from "./env.js";

export default async function useGetMenu({id}) {
    const request=await fetch(`${URL_BASE}menus/${id}`,{
        headers: {
            Accept: 'application/json'
        }
    });

    const response=await request.json();

    return response;
}