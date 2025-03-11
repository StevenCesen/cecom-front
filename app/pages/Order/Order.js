import CartItem from "../../components/CartItem/CartItem.js";
import loader from "../../components/Loader/Loader.js";
import Push from "../../components/Push/Push.js";
import useAddItems from "../../hooks/useAddItems.js";
import useSearchProduct from "../../hooks/useSearchProduct.js";

export default async function Order({data,app}) {

    let items="";

    data.details.map(item=>{
        items+=`
            <div class="Order__item">
                <label>${item.name}</label>
                <label>${item.quantity}</label>
                <label>${item.notes}</label>
            </div>
        `;
    });

    const template=`
        <div class="Order" id="view-order">
            <button class="Order__btn--close" id="close-order">Volver</button>
            <h2>Comanda #${data.order_number_day}</h2>
            <div class="Order__client">
                <label>
                    Cliente: ${data.client_name}
                </label>
                <label>
                    # mesa: ${data.table}
                </label>
            </div>

            <h3>Detalle del pedido</h3>
            <div class="Order__items">
                ${items}
            </div>

            <div class="Order__contentNew">
                <div class="Order__searchNew">
                    <label>
                        Buscar producto
                        <input type="text" id="search-new-product">
                    </label>
                    <div id="content-new-items">
                    </div>
                </div>
                <div class="Order__listNew" id="content-new-products">

                </div>
            </div>

            <button 
                data-id="${data.id}" 
                id="update-add-order"
                class="Order__btn--update"
            >
                Actualizar comanda
            </button>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);
    document.getElementById('body').removeChild(document.getElementById('loader'));

    const btn_close=document.getElementById('close-order');
    const btn_update=document.getElementById('update-add-order');
    const search=document.getElementById('search-new-product');
    const content_new=document.getElementById('content-new-products');

    search.addEventListener('keyup',async (e)=>{
        if(e.target.value!=="" & e.target.value.length>4){
            const results=await useSearchProduct({
                contributor_id:localStorage.getItem('cc'),
                name:e.target.value
            });

            document.getElementById('content-new-items').innerHTML="";
            
            results.data.map(item=>{
                document.getElementById('content-new-items').insertAdjacentHTML('beforeend',`
                    <button 
                        data-id="${item.id}"
                        data-name="${item.name}"
                        data-price="${item.price}"  
                        data-description="${item.description}" 
                        data-descuento="${0}"
                        data-subtotal="${0}"  
                        data-tax="${0}"
                        class="Cart__resultItem"
                    >${item.name}</button>
                `);
            });
        }else{
            document.getElementById('content-new-items').innerHTML="";
        }
    });

    document.getElementById('content-new-items').addEventListener('click',(e)=>{
        if(e.target.matches('.Cart__resultItem')){
            document.getElementById('content-new-items').innerHTML="";
            document.getElementById('content-new-products').insertAdjacentHTML('beforeend',`
                <div class="Cart__item" data-id="${e.target.dataset.id}" data-price="${e.target.dataset.price}" data-name="${e.target.dataset.name}" >
                    <div class="Cart__itemImage">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 21C4.45 21 3.97933 20.8043 3.588 20.413C3.19667 20.0217 3.00067 19.5507 3 19V5C3 4.45 3.196 3.97933 3.588 3.588C3.98 3.19667 4.45067 3.00067 5 3H19C19.55 3 20.021 3.196 20.413 3.588C20.805 3.98 21.0007 4.45067 21 5V19C21 19.55 20.8043 20.021 20.413 20.413C20.0217 20.805 19.5507 21.0007 19 21H5ZM6 17H18L14.25 12L11.25 16L9 13L6 17Z" fill="#AEAEAE"/>
                        </svg>
                    </div>
                    <div class="Cart__itemDates">
                        <p>${e.target.dataset.name}</p>
                        <div>
                            <button data-price="${e.target.dataset.price}" class="Cart__itemMinus">-</button>
                            <input 
                                class="Cart__itemITEM"
                                data-id="${e.target.dataset.id}" 
                                data-price="${e.target.dataset.price}" 
                                data-name="${e.target.dataset.name}" 
                                data-description="" 
                                data-descuento="${0}"
                                data-subtotal="${0}"  
                                data-tax="${0}"
                                value="1"
                                type="number"
                            >
                            <button data-price="${e.target.dataset.price}" class="Cart__itemMore">+</button>
                        </div>
                    </div>
                    <label class="Cart__price">$ ${Number(e.target.dataset.price)*Number(1)}</label>

                    <button data-id="${e.target.dataset.id}"  class="Cart__button--delete remove-to-commander">
                        <svg data-id="${e.target.dataset.id}"  class="remove-to-commander" width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path data-id="${e.target.dataset.id}"  class="remove-to-commander" d="M6 20.0005V6.00047H5V5.00047H9V4.23047H15V5.00047H19V6.00047H18V20.0005H6ZM7 19.0005H17V6.00047H7V19.0005ZM9.808 17.0005H10.808V8.00047H9.808V17.0005ZM13.192 17.0005H14.192V8.00047H13.192V17.0005Z" fill="#FF5152"/>
                        </svg>
                    </button>
                    <div></div>
                    <textarea class="Cart__itemNote" placeholder="Nueva nota"></textarea>
                </div> 
            `);
        }
    });

    btn_close.addEventListener('click',(e)=>{
        const parent=e.target.parentElement.parentElement;
        parent.removeChild(e.target.parentElement);
    });

    btn_update.addEventListener('click',async (e)=>{
        let items=[].slice.call(document.getElementsByClassName('Cart__item'));

        if(items.length>0){
            loader();

            let item_list=[];

            items.map((item)=>{
                item_list.push({
                    id:item.dataset.id,
                    name:item.dataset.name,
                    price:item.dataset.price,
                    imagen:'',
                    quantity:item.children[1].children[1].children[1].value,
                    notes:item.children[5].value
                });
            });

            const data_update={
                items:JSON.stringify(item_list),
                contributor_id:localStorage.getItem('cc'),
                user_id:localStorage.getItem('ui'),
                order_id:data.id,
                client_piso:data.floor,
                client_mesa:data.table,
                order_number_day:data.order_number_day,
                client_name:data.client_name
            };
            
            const response=await useAddItems({body:data_update});
            
            if(response.status===200){
                document.getElementById('view-order').parentElement.removeChild(document.getElementById('view-order'));
                Push({
                    text:'Comanda actualizada correctamente'
                });
            }

            document.getElementById('body').removeChild(document.getElementById('loader'));

        }else{
            Push({
                text:'Agregue productos'
            });
        }
    });
}