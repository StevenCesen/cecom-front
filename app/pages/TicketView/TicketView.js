import useGetTicket from "../../hooks/useGetTicket.js";

export default async function TicketView({id,app}) {
    console.log(id)
    const data=await useGetTicket({id});

    let subtotal=0,iva=0,total_pagado=0;

    const template=`
        <div class="Ticket">
            
            <h2>Ticket #${id}</h2>
            
            <div class="Ticket__information">
                <div class="Ticket__client">
                </div>

                <div class="Ticket__dates">
                    <div class="Ticket__infoticket">
                        <div class="Ticket__infohead">
                            <h3>${data.data.title}</h3>
                            <p>${data.data.status}</p>
                        </div>

                        <h3 class="Ticket__subtitle">Historial de intervenciones</h3>

                        <div class="Ticket__infointeractions" id="content-interaction">

                        </div>
                    </div>

                    <div class="Ticket__infopays">
                        <h3>Equipo receptado con</h3>
                        <div class="Ticket__infocomplements" id="content-complements">
                            
                        </div>

                        <h3 class="Ticket__subtitle">Productos y servicios</h3>
                        
                        <div class="Ticket__infoproducts" id="content-products">

                        </div>

                        <h3 class="Ticket__subtitle">Pagos</h3>
                        <div class="Ticket__infopay" id="content-pays">

                        </div>

                        <div class="Ticket__value">
                            <strong>Subtotal:</strong>
                            <label id="subtotal"></label>
                        </div>

                        <div class="Ticket__value">
                            <strong>IVA:</strong>
                            <label id="iva"></label>
                        </div>

                        <div class="Ticket__value">
                            <strong>Total:</strong>
                            <label id="total"></label>
                        </div>

                        <div class="Ticket__value">
                            <strong>Total a pagar:</strong>
                            <label id="total_pagar"></label>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    const content_interaction=document.getElementById('content-interaction');
    const content_complements=document.getElementById('content-complements');
    const content_products=document.getElementById('content-products');
    const content_pays=document.getElementById('content-pays');
    const subtotal_value=document.getElementById('subtotal');
    const iva_value=document.getElementById('iva');
    const total_value=document.getElementById('total');
    const total_pagar_value=document.getElementById('total_pagar');

    data.data.interactions.map((interaction)=>{
        content_interaction.insertAdjacentHTML('beforeend',`
            <div class="Ticket__interaction">
                <label>${interaction.date_create}</label>
                <label>${interaction.detail}</label>
                <label>${interaction.media}</label>
            </div>
        `);
    });

    data.data.complements.map((complement)=>{
        content_complements.insertAdjacentHTML('beforeend',`
            <div class="Ticket__complement">
                <label>${complement.text}</label>
                <label>${complement.quantity}</label>
                <img src="${complement.media}">
            </div>
        `);
    });

    data.data.costs.map((product)=>{

        subtotal+=product.price;

        content_products.insertAdjacentHTML('beforeend',`
            <div class="Ticket__product">
                <label>${product.name}</label>
                <label>${product.quantity}</label>
                <label>IMAGEN</label>
                <label>$ ${product.price}</label>
            </div>
        `);
    });

    data.data.pays.map((pay)=>{
        total_pagado+=pay.pay_value;
        content_pays.insertAdjacentHTML('beforeend',`
            <div class="Ticket__pay">
                <label>${pay.date_create}</label>
                <label>${pay.pay_type}</label>
                <label>$ ${pay.pay_value}</label>
            </div>
        `);
    });

    subtotal_value.textContent=`$ ${subtotal}`;
    iva_value.textContent=`$ ${iva}`;
    total_value.textContent=`$ ${subtotal+iva}`;
    total_pagar_value.textContent=`$ ${(subtotal+iva)-total_pagado}`;

    document.getElementById('body').removeChild(document.getElementById('loader'));
}