import { URL_BASE } from "../../hooks/env.js";
import useCreateItemcart from "../../hooks/useCreateItemcart.js";
import useDeleteItemcart from "../../hooks/useDeleteItemcart.js";
import useGenerate from "../../hooks/useGenerate.js";
import useGetClients from "../../hooks/useGetClients.js";
import useGetProducts from "../../hooks/useGetProducts.js";
import useGetTypeIdentification from "../../hooks/useGetTypeIdentification.js";
import usePayWays from "../../hooks/usePayWays.js";
import useRound from "../../hooks/useRound.js";
import useSearchProduct from "../../hooks/useSearchProduct.js";
import CardDrop from "../CardDrop/CardDrop.js";
import CardInformationAdditional from "../CardInformationAdditional/CardInformationAdditional.js";
import CardPayWay from "../CardPayWay/CardPayWay.js";
import loader from "../Loader/Loader.js";
import Push from "../Push/Push.js";

export default async function CardPay({data,context,content}){

    let detalle="",total=0;

    if(data.details.length>0){
        data.details.map(item=>{
            total+=Number(item.price)*Number(item.quantity);
            
            detalle+=`
                <div class="CardPay__listItem">
                    <label>
                        <input 
                            data-codigo="${item.item_id}" 
                            data-id="${item.id}" 
                            data-descuento="0" 
                            data-name="${item.name}" 
                            data-description="${item.description}" 
                            data-price="${item.price}" 
                            data-quantity="${item.quantity}" 
                            type="checkbox" 
                            class="check-item" 
                            checked
                        >
                        <label>${item.name}</label>
                    </label>
                    <label>${item.quantity}</label>
                    
                    <input type="number" class="product-price" value="${item.price}">
                    <input type="number" class="product-price" value="0.00">
                    <input type="number" class="product-price" value="0.00">
                    <label>${Number(item.quantity)*Number(item.price)}</label>

                    <div>
                        <button 
                            data-codigo="${item.item_id}" 
                            data-id="${item.id}" 
                            class="product-delete" 
                            class="product-delete"
                        >Quitar</button>

                        ${(item.quantity>1) 
                            ? 
                                `<button 
                                    class="product-desgloce" 
                                    data-codigo="${item.item_id}" 
                                    data-id="${item.id}" 
                                    data-descuento="0" 
                                    data-name="${item.name}" 
                                    data-description="${item.description}" 
                                    data-price="${item.price}" 
                                    data-quantity="${item.quantity}"
                                >Desglozar</button>` 
                            :   
                                ""
                        }
                    </div>
                </div>
            `;
        });
    }

    const template=`
        <div class="CardPay">
            <button class="CardPay__close" id="close-pay">Regresar</button>

            <h3>Nueva factura</h3>

            <div class="CardPay__section">
                <div class="CardPay__products">
                    <h2>Productos y servicios</h2>
                    <span>Agregue los productos o servicios a facturar</span>
                    
                    <div class="CardPay__SearchProducts">
                        <h3>Agregar nuevo artículo</h3>
                        <div class="CardPay__search" id="search-product">
                            
                        </div>
                    </div>
                    
                    <div class="CardPay__previewProduct">
                        <label>
                            Cantidad
                            <input type="number" id="new-item-size" step="0.01" value="1">
                        </label>
                        <label>
                            Precio
                            <input type="number" id="new-item-price" step="0.01" value="0">
                        </label>
                        <label>
                            Descuento
                            <input type="number" id="new-item-dscto" step="0.01" value="1">
                        </label>
                        <label>
                            IVA
                            <select id="new-item-iva">
                                <option value="0">NO APLICA</option>
                                <option selected value="0">IVA 0%</option>
                                <option value="5">IVA 5%</option>
                                <option value="12">IVA 12%</option>
                                <option value="15">IVA 15%</option>
                            </select>
                        </label>
                    </div>

                    <div class="CardPay__action">
                        <strong>Subtotal: </strong>
                        <button id="add-item-commander">Agregar item</button>
                    </div>

                    <div class="CardPay__contentlist">
                        <div class="CardPay__listHead">
                            <label>Nombre</label>
                            <label>Cantidad</label>
                            <label>Precio</label>
                            <label>Descuento</label>
                            <label>IVA</label>
                            <label>Total</label>
                            <label>Acciones</label>
                        </div>
                        <div id="content-items">
                            ${detalle}
                        </div>
                    </div>
                </div>

                <div class="CardPay__datesInvoice">
                    <div class="CardPay__datesClient" id="content-dates-invoice">
                        <h2>Datos de la factura</h2>
                        <span>Elija un cliente</span>

                        <label class="CardPay__date">
                            Fecha de emisión
                            <input type="date" id="date">
                        </label>
                    </div>

                    <div class="CardPay__client" id="content-dates-client">
                        <h2>Cliente seleccionado</h2>
                        <span>Con estos datos se generará la factura electrónica</span>

                        <div>
                            <label>
                                Nombre del cliente
                                <input id="name-client" type="text" placeholder="Escribe o busca aquí">
                            </label>
                            <label>
                                Cédula
                                <input id="identification-client" type="text" placeholder="Escribe aquí">
                            </label>
                            <label>
                                Dirección
                                <input id="direction-client" type="text" placeholder="Escribe aquí">
                            </label>
                            <label>
                                Teléfono
                                <input id="phone-client" type="text" placeholder="Escribe aquí">
                            </label>
                            <label>
                                Correo
                                <input id="email-client" type="text" placeholder="Escribe aquí">
                            </label>
                        </div>
                    </div>

                    <div class="CardPay__datesResumen">
                        <h2>Resumen</h2>
                        <span></span>

                        <div class="CardPay__totals">
                            <label>Total a cobrar:</label>
                            <label id="total-pay" data-total="${total}">$ ${total}</label>
                        </div>
                        <button id="print-account">Imprimir cuenta</button>
                    </div>

                    <div class="CardPay__datesResumen" id="content-pay-ways">
                        <h2>Forma de pago</h2>
                        <span>Agrega todas las formas de pago que se realicen en esta factura</span>

                        <button class="CardPay__btnGenerate" id="btn-new-pay">Agregar forma de pago</button>
                    </div>

                    <div class="CardPay__datesResumen" id="content-pay-adicional">
                        <h2>Información adicional</h2>
                        <span>Ingresa parámetros adicionales a la factura</span>

                        <button class="CardPay__btnGenerate" id="btn-new-adicional">Agregar adicional</button>

                    </div>

                    <button class="CardPay__btnGenerate" id="CardPay__pay">Generar factura</button>
                </div>
            </div>
        </div>
    `;

    content.insertAdjacentHTML('beforeend',template);

    const content_search_products=document.getElementById('search-product');
    const content_dates_invoice=document.getElementById('content-dates-invoice');
    const btn_pay=document.getElementById('CardPay__pay');
    const btn_close=document.getElementById('close-pay');
    const content_pay_ways=document.getElementById('content-pay-ways');
    const content_pay_adicionales=document.getElementById('content-pay-adicional');
    const btn_add_adicional=document.getElementById('btn-new-adicional');
    const content_details=document.getElementById('content-items');
    const btn_new_pays=document.getElementById('btn-new-pay');
    const btn_print_account=document.getElementById('print-account');

    //  Importamos el CardDrop para buscar productos
    await CardDrop({
        title:'Producto/Servicio',
        subtitle:'Seleccionar producto',
        placeholder:'Buscar producto...',
        icon:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.984 10C21.947 8.689 21.823 7.853 21.403 7.14C20.805 6.125 19.729 5.56 17.578 4.432L15.578 3.382C13.822 2.461 12.944 2 12 2C11.056 2 10.178 2.46 8.422 3.382L6.422 4.432C4.271 5.56 3.195 6.125 2.597 7.14C2 8.154 2 9.417 2 11.942V12.059C2 14.583 2 15.846 2.597 16.86C3.195 17.875 4.271 18.44 6.422 19.569L8.422 20.618C10.178 21.539 11.056 22 12 22C12.944 22 13.822 21.54 15.578 20.618L17.578 19.568C19.729 18.439 20.805 17.875 21.403 16.86C21.823 16.147 21.947 15.311 21.984 14M21 7.5L17 9.5M17 9.5L16.5 9.75L12 12M17 9.5V13M17 9.5L7.5 4.5M12 12L3 7.5M12 12V21.5" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
            </svg>`,
        datalist:await useGetProducts({contributor_id:localStorage.getItem('cc'),filters:""}),
        order_id:data.id,
        content:content_search_products
    });

    //  Importamos el CardDrop para buscar clientes
    await CardDrop({
        title:'Cliente',
        subtitle:'Seleccionar cliente',
        placeholder:'Buscar cliente...',
        icon:`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C11.0111 2 10.0444 2.29324 9.22215 2.84265C8.3999 3.39206 7.75904 4.17295 7.3806 5.08658C7.00216 6.00021 6.90315 7.00555 7.09607 7.97545C7.289 8.94536 7.7652 9.83627 8.46447 10.5355C9.16373 11.2348 10.0546 11.711 11.0245 11.9039C11.9945 12.0969 12.9998 11.9978 13.9134 11.6194C14.827 11.241 15.6079 10.6001 16.1573 9.77785C16.7068 8.95561 17 7.98891 17 7C17 5.67392 16.4732 4.40215 15.5355 3.46447C14.5979 2.52678 13.3261 2 12 2ZM12 10C11.4067 10 10.8266 9.82405 10.3333 9.49441C9.83994 9.16476 9.45542 8.69623 9.22836 8.14805C9.0013 7.59987 8.94189 6.99667 9.05764 6.41473C9.1734 5.83279 9.45912 5.29824 9.87868 4.87868C10.2982 4.45912 10.8328 4.1734 11.4147 4.05764C11.9967 3.94189 12.5999 4.0013 13.1481 4.22836C13.6962 4.45542 14.1648 4.83994 14.4944 5.33329C14.8241 5.82664 15 6.40666 15 7C15 7.79565 14.6839 8.55871 14.1213 9.12132C13.5587 9.68393 12.7956 10 12 10ZM21 21V20C21 18.1435 20.2625 16.363 18.9497 15.0503C17.637 13.7375 15.8565 13 14 13H10C8.14348 13 6.36301 13.7375 5.05025 15.0503C3.7375 16.363 3 18.1435 3 20V21H5V20C5 18.6739 5.52678 17.4021 6.46447 16.4645C7.40215 15.5268 8.67392 15 10 15H14C15.3261 15 16.5979 15.5268 17.5355 16.4645C18.4732 17.4021 19 18.6739 19 20V21H21Z" fill="black"/>
            </svg>
        `,
        datalist:await useGetClients({contributor_id:localStorage.getItem('cc'),filters:""}),
        order_id:data.id,
        content:content_dates_invoice
    });

    //  Insertamos el Card de la forma de pago
    CardPayWay({
        content:content_pay_ways
    });

    //  Insertamos el Card para información adicional
    CardInformationAdditional({
        content:content_pay_adicionales
    });

    btn_print_account.addEventListener('click',async (e)=>{
        const data_order={
            'contributor_id':localStorage.getItem('cc'),
            'nro_order':data.id
        };

        const request=await fetch(`${URL_BASE}orders/account`,{
            method:'POST',
            headers: {
                Accept: 'application/json'
            },
            body:new URLSearchParams(data_order)
        });
    
        const response=await request.json();

        if(response.status===200){
            Push({
                text:'Se imprimió la cuenta'
            })
        }else{
            Push({
                text:'Error, inténtalo de nuevo'
            })
        }
    });

    btn_pay.addEventListener('click',async (e)=>{
        loader();     
        const contributor=data.contributor;
        
        if(contributor.cert!==""){
            const info_estab    =   {
                estab:data.establishment.nro_estab,   //    Numeración del establecimiento
                pto_emi:"001", //    Numeración del punto de emisión
                nro:data.establishment.nro_invoices      //    Secuencial del documento a generar (Número de factura)
            }; 

            const info_doc      =   {
                type:'01',
            };

            const date          =   document.getElementById('date').value;

            const client        =   {
                identification_type:(document.getElementById('identification-client').value!=="") ? useGetTypeIdentification({identification:document.getElementById('identification-client').value}) : "",  
                name:document.getElementById('name-client').value,
                identification:document.getElementById('identification-client').value,
                email:document.getElementById('email-client').value,
                phone:document.getElementById('phone-client').value,
                dir:document.getElementById('direction-client').value
            };

            const detail        =   [];

            const btn           =   e.target;

            //  Llenamos el listado de productos
            let items=document.getElementsByClassName('check-item');
            items=[].slice.call(items);

            let subtotal=0,iva=0,total=0;

            items.map(item=>{
                if(item.checked){
                    let pre_total=Number(item.dataset.price);
                    let sub_total=pre_total*Number(item.dataset.quantity);
                    let tax_total=0;
                    let i_total=Number(item.dataset.price)*Number(item.dataset.quantity)
                    
                    detail.push({
                        id:item.dataset.id,
                        name:item.dataset.name,
                        description:item.dataset.description,
                        quantity:item.dataset.quantity,
                        price:useRound({value:pre_total}),
                        descuento:item.dataset.descuento,
                        subtotal:useRound({value:sub_total}),
                        tax:useRound({value:tax_total}),
                        codigo:item.dataset.codigo
                    });

                    total+=Number(i_total);
                    subtotal+=Number(sub_total);
                    iva+=Number(tax_total);
                }
            });

            //  Seleccionamos las formas de pago

            let pay_ways=document.getElementsByClassName('CardPayWay');
            pay_ways=[].slice.call(pay_ways);

            // const nota=document.getElementById('note').value;

            let data_pays=[],cont=true,sum=0;

            pay_ways.map(pay=>{

                sum+=Number(pay.children[2].children[0].value);

                if(pay.children[2].children[0].value===0){
                    Push({
                        text:'Por favor, introduzca el valor cobrado en todas las formas de pago.'
                    });
                    cont=false;
                }else{
                    data_pays.push({
                        pay_way:pay.children[0].children[0].value,
                        type_pay:pay.children[1].children[0].value,
                        value:pay.children[2].children[0].value
                    });
                }
            });

            if(cont){
                const info_pay      =   {
                    pay_way:data_pays,
                    subtotal:useRound({value:subtotal}),
                    descuento:0,
                    tax:useRound({value:iva}),
                    total:useRound({value:total})
                };
    
                if(
                    client.identification_type!=="" & 
                    client.name!=="" & 
                    (client.identification!=="" & client.identification.length>=10) & 
                    client.email!=="" & 
                    client.phone!=="" & 
                    client.dir!=="" &
                    date!=="" &
                    sum==document.getElementById('total-pay').dataset.total
                ){ //    Válidamos que estén todos los datos del cliente
    
                    if(detail.length>0){   //  Validamos que existen productos
    
                        if(
                            info_pay.pay_way!=="" 
                        ){   //  Validamos la información del pago
    
                            /**
                             * ====================> Enviamos a facturar
                             */
    
                            console.log(detail)
                            console.log(info_pay)
                            console.log({
                                contributor,
                                info_estab,
                                info_doc,
                                date,
                                client,
                                detail,
                                info_pay,
                                nota:'',
                                btn,
                                context,
                                order:(data.id!=="without-order") ? data.id : null
                            })
    
                            try {
                                const voucher=await useGenerate({
                                    contributor,
                                    info_estab,
                                    info_doc,
                                    date,
                                    client,
                                    detail,
                                    info_pay,
                                    nota:'',
                                    btn,
                                    context,
                                    order:(data.id!=="") ? data.id : null
                                });
        
                                console.log(voucher);

                                if(voucher!==undefined){
                                    document.getElementById('body').removeChild(document.getElementById('loader'));
                                }
                                
                            } catch (error) {
                                
                            }
                            
                        }else{
                            Push({
                                text:'Por favor, ingrese la forma de pago.'
                            });
                        }
    
                    }else{
                        Push({
                            text:'Por favor, agregue productos.'
                        });
                    }
    
                }else{
                    Push({
                        text:'No existen datos del cliente, fecha o las formas de pago no suman el total.'
                    });
                    document.getElementById('body').removeChild(document.getElementById('loader'));
                }
            }else{
                document.getElementById('body').removeChild(document.getElementById('loader'));
            }
        }else{
            Push({
                text:'Por favor, agregue su firma digital.'
            });
            document.getElementById('body').removeChild(document.getElementById('loader'));
        }
        
    });

    btn_close.addEventListener('click',(e)=>{
        const parent=e.target.parentElement.parentElement;
        parent.removeChild(e.target.parentElement);
    });

    btn_add_adicional.addEventListener('click',(e)=>{
        CardInformationAdditional({
            content:content_pay_adicionales
        });
    });

    content_details.addEventListener('click',async (e)=>{
        if(e.target.matches('.check-item')){
            let checks=document.getElementsByClassName('check-item');
            checks=[].slice.call(checks);
            
            let new_total=0;

            checks.map(check=>{
                if(check.checked){
                    new_total+=Number(check.dataset.price)*Number(check.dataset.quantity);
                }
            });

            document.getElementById('total-pay').textContent=`$ ${new_total}`;
        }

        if(e.target.matches('.product-desgloce')){
            const cantidad=e.target.dataset.quantity;
            const price=e.target.dataset.price;
            const dscto=e.target.dataset.descuento;
            const name=e.target.dataset.name;
            const codigo=e.target.dataset.codigo;
            const id=e.target.dataset.id;
            const description=e.target.dataset.description;

            e.target.parentElement.parentElement.removeChild(e.target.parentElement.parentElement.children[e.target.parentElement.parentElement.children.length-1]);
            e.target.parentElement.parentElement.removeChild(e.target.parentElement);
            
            //  Insertamos los nuevos productos
            for (let i = 0; i < cantidad; i++) {
                content_details.insertAdjacentHTML('beforeend',`
                    <div>
                        <input data-codigo="${codigo}" data-id="${id}" data-descuento="${dscto}" data-name="${name}" data-description="${description}" data-price="${price}" data-quantity="${1}" type="checkbox" class="check-item" checked>
                        <label>${name}</label>
                        <label>1</label>
                        <input class="product-price" value="${price}">
                        <button data-codigo="${codigo}" data-id="${id}" class="product-delete">Quitar</button>
                    </div>
                `);
            }

            content_details.insertAdjacentHTML('beforeend',`
                <div class="CardPay__addItems">
                    <label></label>
                    <input id="new-item-name" type="text" placeholder="Buscar producto">
                    <input id="new-item-size" type="number" value="1">
                    <input id="new-item-price" type="number" value="">
                    <button id="add-item-commander">Agregar al pedido actual</button>
                    <div id="content-new-items">

                    </div>
                </div>
            `);

        }

        if(e.target.matches('.product-delete')){
            const id=e.target.dataset.id;
            const del=await useDeleteItemcart({id});

            if(del.status===200){
                Push({
                    text:'Producto eliminado.'
                });

                e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                
                let checks=document.getElementsByClassName('check-item');
                checks=[].slice.call(checks);
                
                let new_total=0;

                checks.map(check=>{
                    if(check.checked){
                        new_total+=Number(check.dataset.price)*Number(check.dataset.quantity);
                    }
                });

                document.getElementById('total-pay').textContent=`$ ${new_total}`;

            }else{
                Push({
                    text:'No se pudo eliminar el producto'
                });
            }
        }
    });

    //  Para actualizar los valores de los ITEM´s y actualizar el RESUMEN de precios
    content_details.addEventListener('change',(e)=>{
        if(e.target.matches('.product-price')){

            let prices=document.getElementsByClassName('product-price');
            prices=[].slice.call(prices);

            let new_total=0;

            e.target.parentElement.children[0].dataset.price=e.target.value;

            prices.map((price)=>{
                new_total+=Number(price.value);
            });

            document.getElementById('total-pay').dataset.total=new_total;
            document.getElementById('total-pay').textContent=`$ ${new_total}`;
        }

        if(e.target.matches('.check-item')){

            let prices=document.getElementsByClassName('check-item');
            prices=[].slice.call(prices);

            let new_total=0;

            prices.map((price)=>{
                if(price.checked){
                    new_total+=Number(price.dataset.price)*Number(price.dataset.quantity);
                }
            });

            document.getElementById('total-pay').setAttribute('data-total',new_total);
            document.getElementById('total-pay').textContent=`$ ${new_total}`;
        }
    });

    btn_new_pays.addEventListener('click',(e)=>{
        CardPayWay({
            content:content_pay_ways
        });
    });

    document.getElementById('body').removeChild(document.getElementById('loader'));
}