import CardModal from "../../components/CardModal/CardModal.js";
import CardNewTicket from "../../components/CardNewTicket/CardNewTicket.js";
import useGetOrders from "../../hooks/useGetOrders.js";

export default async function Tickets({app}) {
    const orders=await useGetOrders({contributor_id:localStorage.getItem('cc'),filters:''});

    const template=`
        <div class="Orders">
            <div class="Orders__nav">
                <h3>Tickets</h3>
                <input class="Orders__search" id="search-ticket" type="search" placeholder="Nombre del cliente o cédula">
            </div>
            
            <span class="Orders__subtitle">${orders.total} items encontrados</span>

            <div class="Orders__list" id="content-list">
                
            </div>

            <button class="Orders__button" id="new-ticket">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M12 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    const content=document.getElementById('content-list');
    const search_ticket=document.getElementById('search-ticket');
    const btn_newticket=document.getElementById('new-ticket');

    btn_newticket.addEventListener('click',async (e)=>{
        CardModal({
            template:await CardNewTicket(),
            content:document.getElementById('body')
        });
    });

    document.getElementById('body').removeChild(document.getElementById('loader'));

}