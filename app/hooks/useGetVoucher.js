import { URL_BASE } from "./env.js";

export default async function useGetVoucher({id}) {
    const request=await fetch(`${URL_BASE}vouchers/${id}`,{
        headers: {
            Accept: 'application/json'
        }
    });

    const response=await request.json();

    return response;
}