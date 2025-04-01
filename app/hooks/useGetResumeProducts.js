import { URL_BASE } from "./env.js";

export default async function useGetResumeProducts({contributor_id}) {
    const request=await fetch(`${URL_BASE}contributors/ResumeProducts?contributor_id=${contributor_id}`,{
        headers: {
            Accept: 'application/json'
        }
    });

    const response=await request.json();

    return response;
}