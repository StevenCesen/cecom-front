import { URL_BASE } from "./env.js";

export default async function useSearchProduct({contributor_id,name}) {
    const request=await fetch(`${URL_BASE}contributors/${contributor_id}/products?name=${name}`,{
        headers: {
            Accept: 'application/json'
        }
    });

    const response=await request.json();

    return response;
}