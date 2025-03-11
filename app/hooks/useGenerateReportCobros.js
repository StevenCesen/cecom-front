import { URL_BASE } from "./env.js";

export default async function useGenerateReportCobros({contributor_id}) {
    const request=await fetch(`${URL_BASE}contributors/${contributor_id}/reports`,{
        headers: {
            Accept: 'application/json'
        }
    });

    const response=await request.json();

    return response;
}