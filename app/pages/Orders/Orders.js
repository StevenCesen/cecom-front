import CardOrder from "../../components/CardOrder/CardOrder.js";
import CardPay from "../../components/CardPay/CardPay.js";
import loader from "../../components/Loader/Loader.js";
import useGetOrder from "../../hooks/useGetOrder.js";
import useGetOrders from "../../hooks/useGetOrders.js";

export default async function Orders({app}) {
    const orders=await useGetOrders({contributor_id:localStorage.getItem('cc'),filters:''});

    const template=`
        <div class="Orders">
            <div class="Orders__nav">
                <h3>Comandas</h3>
                <input class="Orders__search" id="search-order" type="search" placeholder="Nombre del cliente o cédula">
            </div>
            
            <span class="Orders__subtitle">${orders.total} items encontrados</span>

            <div class="Orders__list" id="content-list">
                
            </div>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    const content=document.getElementById('content-list');
    const search_order=document.getElementById('search-order');

    orders.data.map(order=>{
        CardOrder({
            id:order.id,
            client_name:order.client_name,
            table:order.table,
            floor:order.floor,
            status:order.status,
            date:order.create_date,
            total:'',
            content:content
        });
    });

    search_order.addEventListener('keyup',async (e)=>{

        if(e.target.value.length>4 & e.target.value!==""){
            const client_name=e.target.value;

            const orders_client=await useGetOrders({
                contributor_id:localStorage.getItem('cc'),
                filters:`client_name=${client_name}`
            });

            content.innerHTML="";

            orders_client.data.map(order=>{
                CardOrder({
                    id:order.id,
                    client_name:order.client_name,
                    table:order.table,
                    floor:order.floor,
                    status:order.status,
                    date:order.create_date,
                    total:'',
                    content:content
                });
            });

        }else if(e.target.value===""){

            content.innerHTML="";

            orders.data.map(order=>{
                CardOrder({
                    id:order.id,
                    client_name:order.client_name,
                    table:order.table,
                    floor:order.floor,
                    status:order.status,
                    date:order.create_date,
                    total:'',
                    content:content
                });
            });
        }
        
    });

    content.addEventListener('click',async (e)=>{
        if(e.target.matches('.CardOrder__button')){

            loader();

            const id=e.target.dataset.id;

            const data=await useGetOrder({id});

            await CardPay({
                data:data,
                context:'ORDER',
                content:app
            });

        }
    });

    document.getElementById('body').removeChild(document.getElementById('loader'));

}