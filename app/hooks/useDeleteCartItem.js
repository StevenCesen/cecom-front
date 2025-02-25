export default function useDeleteCartItem({id}){
    let items=document.getElementsByClassName('Cart__item');
    items=[].slice.call(items);

    let new_items=[];

    items.map((item)=>{
        if(item.dataset.id===id){
            const parent=item.parentElement;
            parent.removeChild(item);
        }else{
            new_items.push({
                id:item.dataset.id,
                name:item.dataset.name,
                price:item.dataset.price,
                imagen:'',
                quantity:item.children[1].children[1].children[1].value
            });
        }
    });
    
    localStorage.setItem('cart',JSON.stringify(new_items));
}