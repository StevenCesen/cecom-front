export default function useGetTypeIdentification({identification}){
    console.log(identification)
    if(identification.length===13){
        if(identification==='9999999999999'){
            return '07';
        }else{
            return '04';
        }
    }else if(identification.length===10){
        return '05'
    }else{
        return '05';
    }
}