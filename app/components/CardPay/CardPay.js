import useGenerate from "../../hooks/useGenerate.js";
import useGetClients from "../../hooks/useGetClients.js";
import useGetTypeIdentification from "../../hooks/useGetTypeIdentification.js";
import usePayWays from "../../hooks/usePayWays.js";
import useRound from "../../hooks/useRound.js";
import loader from "../Loader/Loader.js";
import Push from "../Push/Push.js";

export default async function CardPay({data,content}){

    let detalle="",total=0;

    console.log(data)

    data.details.map(item=>{
        total+=Number(item.price)*Number(item.quantity);
        detalle+=`
            <div>
                <input data-codigo="${item.item_id}" data-id="${item.id}" data-descuento="0" data-name="${item.name}" data-description="${item.description}" data-price="${item.price}" data-quantity="${item.quantity}" type="checkbox" class="check-item" checked>
                <label>${item.name}</label>
                <label>${item.quantity}</label>
                <input class="product-price" value="${item.price}">
                ${(item.quantity>1) ? `<button class="product-desgloce" data-codigo="${item.item_id}" data-id="${item.id}" data-descuento="0" data-name="${item.name}" data-description="${item.description}" data-price="${item.price}" data-quantity="${item.quantity}">Desglozar item</button>` : ""}
            </div>
        `;
    });

    const template=`
        <div class="CardPay">
            <button class="CardPay__close" id="close-pay">Regresar</button>

            <h3>Información del cliente</h3>

            <div class="CardPay__client">
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

                <label>
                    Fecha
                    <input id="date" type="date">
                </label>
                
                <div class="CardPay__result" id="client-results">

                </div>
            </div>

            <h3>Detalle</h3>

            <div class="CardPay__detail" id="detalle">
                ${detalle}
            </div>

            <h3>Totales</h3>

            <div class="CardPay__totals">
                <label>Total a cobrar:</label>
                <label id="total-pay" data-total="${total}">$ ${total}</label>
            </div>

            <h3>Forma y tipo de pago</h3>

            <div class="CardPay__payways">
                <div id="content-payways">
                    <div class="CardPay__payway">
                        <label>
                            Forma de pago
                            <select class="pay-way">
                                <option value="01">EFECTIVO - SIN UTILIZACIÓN DEL SISTEMA FINANCIERO</option>
                                <option value="15">COMPENSACIÓN DE DEUDAS</option>
                                <option value="16">TARJETA DE DÉBITO</option>
                                <option value="17">DINERO ELECTRÓNICO</option>
                                <option value="18">TARJETA PREPAGO</option>
                                <option value="19">TARJETA DE CRÉDITO</option>
                                <option value="20">OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO</option>
                                <option value="21">ENDOSO DE TÍTULOS</option>
                            </select>
                        </label>

                        <label>
                            Tipo de pago
                            <select class="pay-type">
                                <option value="EFECTIVO">EFECTIVO</option>
                                <option value="AHORITA">AHORITA - BANCO DE LOJA</option>
                                <option value="DE UNA">DE UNA - BANCO PICHINCHA</option>
                                <option value="TARJETA CREDITO">TARJETA DE CRÉDITO - DATAFAST</option>
                                <option value="TARJETA DEBITO">TARJETA DE DEBITO - DATAFAST</option>
                            </select>
                        </label>
                        <label>
                            Valor
                            <input type="text" class="pay-value" value="0">
                        </label>
                        <button class="CardPay__paywayDelete">Eliminar</button>
                    </div>
                </div>
                <button id="new-payway">Nueva forma de pago</button>
            </div>

            <label class="CardPay__note">
                Nota
                <textarea id="note" placeholder="Escribe una nota"></textarea>
            </label>

            <button class="CardPay__pay" id="CardPay__pay">Cobrar</button>
        </div>
    `;

    content.insertAdjacentHTML('beforeend',template);

    const content_details=document.getElementById('detalle');
    const btn_new_payway=document.getElementById('new-payway');
    const btn_pay=document.getElementById('CardPay__pay');
    const btn_close=document.getElementById('close-pay');
    const search_client=document.getElementById('name-client');
    const content_clients=document.getElementById('client-results');

    search_client.addEventListener('keyup',async (e)=>{
        if(e.target.value.length>6){
            const clients=await useGetClients({
                contributor_id:localStorage.getItem('cc'),
                filters:`identification=${e.target.value}`
            });

            content_clients.innerHTML="";

            clients.data.map(client=>{
                content_clients.insertAdjacentHTML('beforeend',`
                    <button 
                        data-name="${client.name}" 
                        data-identification="${client.identification}" 
                        data-email="${client.email}"
                        data-direction="${client.direction}"
                        data-phone="${client.phone}"  
                        class="client-option" 
                    >${client.name}</button>
                `);
            });
        }else{
            content_clients.innerHTML="";
        }
    });

    content_clients.addEventListener('click',(e)=>{
        if(e.target.matches('.client-option')){
            document.getElementById('name-client').value=e.target.dataset.name;
            document.getElementById('identification-client').value=e.target.dataset.identification;
            document.getElementById('email-client').value=e.target.dataset.email;
            document.getElementById('phone-client').value=e.target.dataset.phone;
            document.getElementById('direction-client').value=e.target.dataset.direction;

            content_clients.innerHTML="";
        }
    });

    btn_new_payway.addEventListener('click',(e)=>{
        const content=document.getElementById('content-payways');

        content.insertAdjacentHTML('beforeend',`
            <div class="CardPay__payway">
                <label>
                    Forma de pago
                    <select class="pay-way">
                        <option value="01">EFECTIVO - SIN UTILIZACIÓN DEL SISTEMA FINANCIERO</option>
                        <option value="15">COMPENSACIÓN DE DEUDAS</option>
                        <option value="16">TARJETA DE DÉBITO</option>
                        <option value="17">DINERO ELECTRÓNICO</option>
                        <option value="18">TARJETA PREPAGO</option>
                        <option value="19">TARJETA DE CRÉDITO</option>
                        <option value="20">OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO</option>
                        <option value="21">ENDOSO DE TÍTULOS</option>
                    </select>
                </label>

                <label>
                    Tipo de pago
                    <select class="pay-type">
                        <option value="EFECTIVO">EFECTIVO</option>
                        <option value="AHORITA">AHORITA - BANCO DE LOJA</option>
                        <option value="DE UNA">DE UNA - BANCO PICHINCHA</option>
                        <option value="TARJETA CREDITO">TARJETA DE CRÉDITO - DATAFAST</option>
                        <option value="TARJETA DEBITO">TARJETA DE DEBITO - DATAFAST</option>
                    </select>
                </label>
                <label>
                    Valor
                    <input type="text" class="pay-value" value="0">
                </label>
                <button class="CardPay__paywayDelete">Eliminar</button>
            </div>
        `);
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

            let pay_ways=document.getElementsByClassName('CardPay__payway');
            pay_ways=[].slice.call(pay_ways);

            const nota=document.getElementById('note').value;

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
    
                            const voucher=await useGenerate({
                                contributor,
                                info_estab,
                                info_doc,
                                date,
                                client,
                                detail,
                                info_pay,
                                nota,
                                btn,
                                context:'ORDER',
                                order:data.id
                            });
    
                            console.log(voucher);
    
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

    content_details.addEventListener('click',(e)=>{
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

            e.target.parentElement.parentElement.removeChild(e.target.parentElement);

            //  Insertamos los nuevos productos

            for (let i = 0; i < cantidad; i++) {
                content_details.insertAdjacentHTML('beforeend',`
                    <div>
                        <input data-codigo="${codigo}" data-id="${id}" data-descuento="${dscto}" data-name="${name}" data-description="${description}" data-price="${price}" data-quantity="${1}" type="checkbox" class="check-item" checked>
                        <label>${name}</label>
                        <label>1</label>
                        <input class="product-price" value="${price}">
                    </div>    
                `);
            }
        }
    });

    content_details.addEventListener('change',(e)=>{
        console.log(e)
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
                console.log(price);
                if(price.checked){
                    new_total+=Number(price.dataset.price);
                }
            });

            console.log(new_total)

            document.getElementById('total-pay').setAttribute('data-total',new_total);
            document.getElementById('total-pay').textContent=`$ ${new_total}`;
        }

    });

    document.getElementById('body').removeChild(document.getElementById('loader'));
}