import CardOrder from "../../components/CardOrder/CardOrder.js";

export default async function Orders({app}) {
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

    CardOrder({
        id:2,
        client_name:'Sara Young',
        table:'1',
        floor:'2',
        status:'FINALIZADO',
        date:'2025/02/09 19:00:06',
        total:23.75,
        content:content
    });

    CardOrder({
        id:2,
        client_name:'John Doe',
        table:'1',
        floor:'2',
        status:'PENDIENTE',
        date:'2025/02/09 19:00:06',
        total:23.75,
        content:content
    });

    document.getElementById('body').removeChild(document.getElementById('loader'));

}