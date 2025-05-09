export default function useUpdateTotal(){
    let items=document.getElementsByClassName('Cart__item');
    items=[].slice.call(items);

    if(!!document.getElementById('total')){
        const total=document.getElementById('total');

        let new_total=0;

        items.map(item=>{
            new_total+=Number(item.children[2].textContent.split(' ')[1]);
        });

        total.innerHTML=`
            <strong>Total:</strong>
            $ ${new_total.toFixed(2)}
        `;
    }
}