import useGetP12 from "./useGetP12.js";

export default async function useReadCert({file,password}){
    return await useGetP12({
        file:file,
        mi_pwd_p12:password
    });
}