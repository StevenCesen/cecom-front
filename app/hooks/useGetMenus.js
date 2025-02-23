import { URL_BASE } from "./env.js";

export default async function useGetMenus({contributor_id}) {
    const request=await fetch(`${URL_BASE}contributors/${contributor_id}/menus`,{
        headers: {
            Accept: 'application/json'
        }
    });

    const response=await request.json();

    return response;
}