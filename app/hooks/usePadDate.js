export default function usePadDate(value){
    if(Number(value)<10){
        return `0${Number(value)}`;
    }else{
        return value;
    }
}