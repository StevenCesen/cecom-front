import CardOrder from "../../components/CardOrder/CardOrder.js";
import loader from "../../components/Loader/Loader.js";
import useGetOrders from "../../hooks/useGetOrders.js";

export default async function Orders({app}) {
    const orders=await useGetOrders({contributor_id:localStorage.getItem('cc'),filters:''});

    const template=`
        <div class="Orders">
            <div class="Orders__nav">
                <h3>Comandas</h3>
                <input class="Orders__search" type="search" placeholder="Nombre del cliente o cédula">
            </div>
            
            <span class="Orders__subtitle">50 items encontrados</span>

            <div class="Orders__list" id="content-list">
                
            </div>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    const content=document.getElementById('content-list');

    orders.data.map(order=>{
        console.log(order)
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

    document.getElementById('body').removeChild(document.getElementById('loader'));

}