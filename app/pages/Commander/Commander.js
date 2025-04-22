import CardModal from "../../components/CardModal/CardModal.js";
import CardProductSelect from "../../components/CardProductSelect/CardProductSelect.js";
import Cart from "../../components/Cart/Cart.js";
import loader from "../../components/Loader/Loader.js";
import Push from "../../components/Push/Push.js";
import useGetCategories from "../../hooks/useGetCategories.js";
import useGetOrder from "../../hooks/useGetOrder.js";
import useGetOrders from "../../hooks/useGetOrders.js";
import useGetOrdersMesero from "../../hooks/useGetOrdersMesero.js";
import useGetProducts from "../../hooks/useGetProducts.js";
import useSumCart from "../../hooks/useSumCart.js";
import useUpdateOrder from "../../hooks/useUpdateoOrder.js";
import Order from "../Order/Order.js";

export default async function Commander({app}) {

    let categories="",products="",first_category="",first_category_id=0;
    
    let data_categories=await useGetCategories({
        contributor_id:localStorage.getItem('cc')
    });

    data_categories.map((type,n)=>{
        if(n==0){
            first_category=type.name;
            first_category_id=type.id;
            categories+=`
                <button data-type="${type.id}" data-name="${type.name}" class="commander-category Orders__categories--active">${type.name}</button>
            `;
        }else{
            categories+=`
                <button data-type="${type.id}" data-name="${type.name}" class="commander-category">${type.name}</button>
            `;
        }
    });

    let orders="";

    const data_orders=await useGetOrdersMesero({
        contributor_id:localStorage.getItem('cc'),
        filters:`user_id=${localStorage.getItem('ui')}`
    });

    first_category=`Pendientes de hoy (${data_orders.data.length})`;

    data_orders.data.map(order=>{
        orders+=`
            <div class="OrderItem">
                <h4>${order.client_name}</h4>
                <p>${order.floor} | ${order.table}</p>
                <p>${order.create_date}</p>
                <p># ${order.order_number_day}</p>
                <button data-id="${order.id}" class="CardOrder__view">Ver</button>
                ${(order.status==='PENDIENTE') ? `<button data-id="${order.id}" class="CardOrder__finish">Finalizar</button>` : ''}
            </div>
        `;
    });

    const template=`
        <div class="Orders">
            <div class="Orders__nav" id="content-search-orders">
                <h3>Comandas</h3>
                <input class="Orders__search" type="search" id="search-client-commander" placeholder="Nombre del cliente">
            </div>

            <div class="Orders__select">
                <button class="Orders__select--buttonActive" id="list">Listar</button>
                <button>PISO 1</button>
                <button>PISO 2</button>
                <button>PISO 3</button>
            </div>

            <div class="Orders__list">
                <div class="Orders__categories" id="content-categories">
                    ${categories}
                </div>
            </div>

            <h3 class="Orders__subtitle" id="category">${first_category}</h3>

            <div class="Orders_contentItems" id="content-items">
                
            </div>

            <div class="Orders_contentOrders" id="content-orders">
                ${orders}
            </div>

            <button class="Orders__button" id="new-commander">
                <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.49671 18.0003C7.89454 18.0003 8.27607 18.1584 8.55737 18.4397C8.83868 18.721 8.99671 19.1025 8.99671 19.5003C8.99671 19.8982 8.83868 20.2797 8.55737 20.561C8.27607 20.8423 7.89454 21.0003 7.49671 21.0003C7.09889 21.0003 6.71736 20.8423 6.43605 20.561C6.15475 20.2797 5.99671 19.8982 5.99671 19.5003C5.99671 19.1025 6.15475 18.721 6.43605 18.4397C6.71736 18.1584 7.09889 18.0003 7.49671 18.0003ZM16.4967 18.0003C16.8945 18.0003 17.2761 18.1584 17.5574 18.4397C17.8387 18.721 17.9967 19.1025 17.9967 19.5003C17.9967 19.8982 17.8387 20.2797 17.5574 20.561C17.2761 20.8423 16.8945 21.0003 16.4967 21.0003C16.0989 21.0003 15.7174 20.8423 15.4361 20.561C15.1547 20.2797 14.9967 19.8982 14.9967 19.5003C14.9967 19.1025 15.1547 18.721 15.4361 18.4397C15.7174 18.1584 16.0989 18.0003 16.4967 18.0003ZM2.08071 2.75134C2.14665 2.56372 2.2844 2.40997 2.46367 2.32389C2.64295 2.23782 2.84907 2.22647 3.03671 2.29234L3.33871 2.39834C3.95471 2.61534 4.47871 2.79934 4.89071 3.00134C5.33071 3.21834 5.70971 3.48434 5.99371 3.90034C6.27571 4.31234 6.39171 4.76534 6.44571 5.26234C6.46905 5.48434 6.48338 5.73034 6.48871 6.00034H8.14671L9.80171 15.3773C7.77671 15.3593 6.66171 15.2423 5.92571 14.4673C5.05971 13.5513 4.99671 12.5813 4.99671 9.64034V7.03834C4.99671 6.29834 4.99671 5.80334 4.95571 5.42334C4.91571 5.06034 4.84571 4.87834 4.75571 4.74634C4.66771 4.61734 4.53471 4.49634 4.23071 4.34834C3.90871 4.19034 3.46971 4.03434 2.80171 3.79934L2.54071 3.70834C2.4477 3.6757 2.36203 3.62504 2.28861 3.55926C2.21519 3.49348 2.15545 3.41387 2.11282 3.32499C2.07019 3.23611 2.0455 3.13969 2.04016 3.04126C2.03483 2.94283 2.04794 2.84431 2.08071 2.75134ZM11.3257 15.3803H14.1677L15.8237 6.00034H9.66971L11.3257 15.3803ZM17.3467 6.00034C18.9427 6.00134 20.3487 6.02534 20.7727 6.57734C21.2167 7.15434 21.0427 8.02434 20.6967 9.76334L20.1967 12.1883C19.8817 13.7163 19.7237 14.4813 19.1717 14.9303C18.6207 15.3803 17.8397 15.3803 16.2787 15.3803H15.6907L17.3467 6.00034Z" fill="white"/>
                </svg>
            </button>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    const btn_new_command=document.getElementById('new-commander');
    const content_items=document.getElementById('content-items');
    const content_categories=document.getElementById('content-categories');
    const content_orders=document.getElementById('content-orders');
    const content_search_orders=document.getElementById('content-search-orders');
    const btn_list=document.getElementById('list');

    btn_new_command.addEventListener('click',(e)=>{
        CardModal({
            template:Cart({mode:'only-cart'}),
            content:document.getElementById('body')
        });
    });

    btn_list.addEventListener('click',async (e)=>{
        loader();
        content_orders.innerHTML="";
        content_items.innerHTML="";
        content_search_orders.removeChild(content_search_orders.children[1]);
        content_search_orders.insertAdjacentHTML('beforeend',`
            <input class="Orders__search" type="search" id="search-client-commander" placeholder="Nombre del cliente">
        `);

        const data_orders=await useGetOrders({
            contributor_id:localStorage.getItem('cc'),
            filters:`user_id=${localStorage.getItem('ui')}`
        });

        document.getElementById('category').textContent="Pendientes de hoy";
        let new_orders="";

        data_orders.data.map(order=>{
            new_orders+=`
                <div class="OrderItem">
                    <h4>${order.client_name}</h4>
                    <p>${order.floor} | ${order.table}</p>
                    <p>${order.create_date}</p>
                    <p># ${order.order_number_day}</p>
                    <button data-id="${order.id}" class="CardOrder__view">Ver</button>
                    ${(order.status==='PENDIENTE') ? `<button data-id="${order.id}" class="CardOrder__finish">Finalizar</button>` : ''}
                </div>
            `;
        });

        content_orders.insertAdjacentHTML('beforeend',new_orders);
        document.getElementById('body').removeChild(document.getElementById('loader'));
    });

    content_categories.addEventListener('click',async (e)=>{
        if(e.target.matches('.commander-category')){

            loader();
            content_orders.innerHTML="";
            content_search_orders.removeChild(content_search_orders.children[1]);
            content_search_orders.insertAdjacentHTML('beforeend',`
                <input class="Orders__search" type="search" id="search-item-commander" placeholder="Nombre del producto">
            `);
            
            let data_products=await useGetProducts({
                contributor_id:localStorage.getItem('cc'),
                filters:`type=${e.target.dataset.type}`
            });

            content_items.innerHTML="";
            document.getElementById('category').textContent=e.target.dataset.name;
            document.getElementById('category').dataset.type=e.target.dataset.type;

            data_products.data.map(item=>{
                CardProductSelect({
                    id:item.id,
                    image:"",
                    name:item.name,
                    price:item.price,
                    content:content_items
                });
            });
            document.getElementById('body').removeChild(document.getElementById('loader'));
        }
    });

    content_items.addEventListener('click',async (e)=>{
        if(e.target.matches('.add-to-commander')){
            //  Enviamos al carrito
            const cart=(localStorage.getItem('cart')!==null) ? JSON.parse(localStorage.getItem('cart')) : [];

            cart.push({
                id:e.target.dataset.id,
                name:e.target.dataset.name,
                price:e.target.dataset.price,
                imagen:e.target.dataset,
                quantity:1
            });

            localStorage.setItem('cart',JSON.stringify(cart));

            Push({
                text:'Item agregado correctamente'
            });
        }
    });

    content_orders.addEventListener('click',async (e)=>{
        if(e.target.matches('.CardOrder__finish')){
            const id=e.target.dataset.id;
            
            loader();
            const update=await useUpdateOrder({id});
            
            const button=e.target;
            button.parentElement.removeChild(button);

            document.getElementById('body').removeChild(document.getElementById('loader'));

            Push({
                text:'Comanda completada, !En Mesa¡'
            });

        }

        if(e.target.matches('.CardOrder__view')){
            const id=e.target.dataset.id;
            loader();
            const order=await useGetOrder({id});

            console.log(order);

            await Order({
                data:order,
                app
            });
        }

    });

    document.getElementById('body').removeChild(document.getElementById('loader'));
}