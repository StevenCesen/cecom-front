import loader from "../../components/Loader/Loader.js";
import Push from "../../components/Push/Push.js";
import { URL_BASE } from "../../hooks/env.js";
import useClickToCopy from "../../hooks/useClickToCopy.js";
import useCloseTicket from "../../hooks/useCloseTicket.js";
import useCreateInteraction from "../../hooks/useCreateInteraction.js";
import useCreateTicketProduct from "../../hooks/useCreateTicketProduct.js";
import useGetCierreCaja from "../../hooks/useGetCierreCaja.js";
import useGetTicket from "../../hooks/useGetTicket.js";
import useSearchProduct from "../../hooks/useSearchProduct.js";

export default async function Ticket({id,app}) {

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

                        <div class="Ticket__newinteraction">
                            <label>
                                Nueva intervención
                                <textarea id="text-interaction" placeholder="Escribe el detalle aquí..."></textarea>
                            </label>

                            <label class="" for="new-file-ticket">
                                <img src="" id="new-preview-image">
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.5 9C12.3167 9 12.175 8.91667 12.075 8.75C11.975 8.58333 11.975 8.41667 12.075 8.25L15 3.175C15.1333 2.95833 15.3 2.82933 15.5 2.788C15.7 2.74667 15.9167 2.784 16.15 2.9C17.3 3.41667 18.3167 4.13733 19.2 5.062C20.0833 5.98667 20.7667 7.03267 21.25 8.2C21.3333 8.41667 21.3207 8.60433 21.212 8.763C21.1033 8.92167 20.9327 9.00067 20.7 9H12.5ZM8.925 10.225L5.925 5.025C5.79167 4.80833 5.75833 4.59167 5.825 4.375C5.89167 4.15833 6.025 3.98333 6.225 3.85C7.025 3.28333 7.91267 2.83333 8.888 2.5C9.86333 2.16667 10.9007 2 12 2C12.25 2 12.525 2.01267 12.825 2.038C13.125 2.06333 13.375 2.09233 13.575 2.125C13.8083 2.15833 13.9627 2.25833 14.038 2.425C14.1133 2.59167 14.0923 2.775 13.975 2.975L9.8 10.225C9.7 10.3917 9.55433 10.475 9.363 10.475C9.17167 10.475 9.02567 10.3917 8.925 10.225ZM2.85 14C2.66667 14 2.5 13.9377 2.35 13.813C2.2 13.6883 2.10833 13.534 2.075 13.35C2.04167 13.166 2.021 12.966 2.013 12.75C2.005 12.534 2.00067 12.284 2 12C2 10.95 2.171 9.90433 2.513 8.863C2.855 7.82167 3.384 6.834 4.1 5.9C4.28333 5.66667 4.496 5.55 4.738 5.55C4.98 5.55 5.16733 5.675 5.3 5.925L9.5 13.25C9.6 13.4167 9.596 13.5833 9.488 13.75C9.38 13.9167 9.234 14 9.05 14H2.85ZM7.85 21.1C6.75 20.5667 5.74167 19.8417 4.825 18.925C3.90833 18.0083 3.21667 16.9667 2.75 15.8C2.66667 15.5833 2.68333 15.396 2.8 15.238C2.91667 15.08 3.09167 15.0007 3.325 15H11.475C11.6583 15 11.8 15.0833 11.9 15.25C12 15.4167 12 15.5833 11.9 15.75L9.025 20.775C8.89167 20.9917 8.725 21.1333 8.525 21.2C8.325 21.2667 8.1 21.2333 7.85 21.1ZM12 22C11.7667 22 11.504 21.9873 11.212 21.962C10.92 21.9367 10.666 21.9077 10.45 21.875C10.2167 21.8417 10.0583 21.7417 9.975 21.575C9.89167 21.4083 9.90833 21.225 10.025 21.025L14.15 13.825C14.25 13.6583 14.4167 13.575 14.65 13.575C14.8833 13.575 15.05 13.6583 15.15 13.825L18.1 18.95C18.2167 19.1333 18.2543 19.3333 18.213 19.55C18.1717 19.7667 18.034 19.9667 17.8 20.15C17.0333 20.7167 16.1377 21.1667 15.113 21.5C14.0883 21.8333 13.0507 22 12 22ZM18.775 18.125L14.525 10.75C14.425 10.5833 14.4293 10.4167 14.538 10.25C14.6467 10.0833 14.7923 10 14.975 10H21.15C21.3333 10 21.5 10.0627 21.65 10.188C21.8 10.3133 21.8917 10.4673 21.925 10.65C21.9583 10.8327 21.979 11.0327 21.987 11.25C21.995 11.4673 21.9993 11.7173 22 12C22 13.05 21.829 14.1043 21.487 15.163C21.145 16.2217 20.616 17.209 19.9 18.125C19.7667 18.3083 19.575 18.4043 19.325 18.413C19.075 18.4217 18.8917 18.3257 18.775 18.125Z" fill="black"/>
                                </svg>
                                <input type="file" id="new-file-ticket">
                            </label>

                            <button id="add-new-interaction">
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19M12 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        <div class="Ticket__infointeractions" id="content-interaction">

                        </div>
                    </div>

                    <div class="Ticket__infopays">
                        <h3>Equipo receptado con</h3>
                        <div class="Ticket__infocomplements" id="content-complements">
                            
                        </div>

                        <h3 class="Ticket__subtitle">Productos y servicios</h3>
                        
                        <label class="Ticket__newproduct">
                            Agregar producto o servicios
                            <input id="search-new-product" type="search" placeholder="Nombre del producto">
                            <div class="Ticket__listproducts" id="content-new-products">

                            </div>
                        </label>
                        
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

                        <div class="Ticket__actions">
                            <button id="btn-finish">Cerrar ticket</button>
                            
                            <button id="btn-copy">Compartir</button>
                        </div>
                        
                    </div>

                </div>
            </div>

        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    // <button id="btn-gen">Generar factura</button>

    const content_interaction=document.getElementById('content-interaction');
    const content_complements=document.getElementById('content-complements');
    const content_products=document.getElementById('content-products');
    const content_pays=document.getElementById('content-pays');
    const subtotal_value=document.getElementById('subtotal');
    const iva_value=document.getElementById('iva');
    const total_value=document.getElementById('total');
    const total_pagar_value=document.getElementById('total_pagar');
    const btn_copy=document.getElementById('btn-copy');
    const btn_finish=document.getElementById('btn-finish');
    const search_products=document.getElementById('search-new-product');
    const content_list_products=document.getElementById('content-new-products');
    const btn_file_image=document.getElementById('new-file-ticket');
    const content_image=document.getElementById('new-preview-image');
    const btn_interaction=document.getElementById('add-new-interaction');
    // const btn_gen=document.getElementById('btn-gen');
    const text_interaction=document.getElementById('text-interaction');

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

    btn_copy.addEventListener('click',(e)=>{
        useClickToCopy(`localhost/anyplacev2/#/tickets/view/${id}`);
    });
    
    btn_finish.addEventListener('click',async (e)=>{
        loader();

        const close_ticket=await useCloseTicket({
            data:{
                status:'CERRADO'
            },
            id
        });

        if(close_ticket.status===200){
            Push({
                text:'Ticket cerrado correctamente'
            });
        }else{
            Push({
                text:'Error, inténtalo de nuevo'
            });
        }
        document.getElementById('body').removeChild(document.getElementById('loader'));
    });

    // btn_gen.addEventListener('click',async (e)=>{
    //     console.log(data);
    // });

    search_products.addEventListener('keyup',async (e)=>{
        if(e.target.value.length>5){
            const results=await useSearchProduct({
                contributor_id:localStorage.getItem('cc'),
                name:e.target.value
            });

            content_list_products.innerHTML="";
            
            results.data.map(item=>{
                content_list_products.insertAdjacentHTML('beforeend',`
                    <button 
                        data-id="${item.id}"
                        data-name="${item.name}"
                        data-price="${item.price}"  
                        data-description="${item.description}" 
                        data-descuento="${0}"
                        data-subtotal="${0}"  
                        data-tax="${0}"
                        class="Ticket__resultItem"
                    >${item.name}</button>
                `);
            });

        }else{
            content_list_products.innerHTML="";
        }
    });

    btn_file_image.addEventListener('change',(e)=>{
        content_image.setAttribute('src',URL.createObjectURL(e.target.files[0]));
    });

    content_list_products.addEventListener('click',async (e)=>{
        if(e.target.matches('.Ticket__resultItem')){
            const data={
                ticket_id:id,
                quantity:1,
                product_id:e.target.dataset.id
            };

            const create=await useCreateTicketProduct({data});

            if(create.status===200){
                Push({
                    text:'Se agregó nuevo ITEM'
                });
                content_list_products.innerHTML="";
            }else{
                Push({
                    text:'Error, inténtalo de nuevo'
                });
            }
        }
    });

    btn_interaction.addEventListener('click',async (e)=>{
        const data={
            ticket_id:id,
            detail:text_interaction.value,
            media:""
        };

        const create=await useCreateInteraction({data});

        if(create.status===200){
            Push({
                text:'Se agregó detalle'
            });
            text_interaction.value="";
        }else{
            Push({
                text:'Error, inténtalo de nuevo'
            });
        }
    });

    document.getElementById('body').removeChild(document.getElementById('loader'));
}