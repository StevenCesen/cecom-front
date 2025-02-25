export default function useSumCart(){
    const cart=(localStorage.getItem('cart')!==null) ? JSON.parse(localStorage.getItem('cart')) : [];
    let total=0;

    cart.map(item=>{
        total+=Number(item.price);
    });

    return total;
}