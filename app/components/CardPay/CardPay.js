import useGenerate from "../../hooks/useGenerate.js";
import useGetTypeIdentification from "../../hooks/useGetTypeIdentification.js";
import usePayWays from "../../hooks/usePayWays.js";
import useRound from "../../hooks/useRound.js";
import loader from "../Loader/Loader.js";
import Push from "../Push/Push.js";

export default async function CardPay({data,content}){

    let detalle="",total=0;

    data.details.map(item=>{
        total+=Number(item.price)*Number(item.quantity);
        detalle+=`
            <div>
                <input data-id="${item.id}" data-descuento="0" data-name="${item.name}" data-description="${item.description}" data-price="${item.price}" data-quantity="${item.quantity}" type="checkbox" class="check-item" checked>
                <label>${item.name}</label>
                <label>${item.quantity}</label>
                <input value="${item.price}">
                ${(item.quantity>1) ? "<button>Desglozar item</button>" : ""}
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
                    <input id="name-client" type="text">
                </label>
                <label>
                    Cédula
                    <input id="identification-client" type="text">
                </label>
                <label>
                    Dirección
                    <input id="direction-client" type="text">
                </label>
                <label>
                    Teléfono
                    <input id="phone-client" type="text">
                </label>
                <label>
                    Correo
                    <input id="email-client" type="text">
                </label>

                <label>
                    Fecha
                    <input id="date" type="date">
                </label>
                
                <div class="CardPay__result">

                </div>

            </div>

            <h3>Detalle</h3>

            <div class="CardPay__detail" id="detalle">
                ${detalle}
            </div>

            <h3>Totales</h3>

            <div class="CardPay__totals">
                <label>Total a cobrar:</label>
                <label id="total-pay">$ ${total}</label>
            </div>

            <h3>Forma y tipo de pago</h3>

            <div class="CardPay__payways">
                <div id="content-payways">
                    <div class="CardPay__payway">
                        <label>
                            Forma de pago
                            ${usePayWays()}
                        </label>

                        <label>
                            Tipo de pago
                            <select id="pay-way">
                                <option value="EFECTIVO">EFECTIVO</option>
                                <option value="AHORITA">AHORITA - BANCO DE LOJA</option>
                                <option value="DE UNA">DE UNA - BANCO PICHINCHA</option>
                                <option value="TARJETA CREDITO">TARJETA DE CRÉDITO - DATAFAST</option>
                                <option value="TARJETA DEBITO">TARJETA DE DEBITO - DATAFAST</option>
                            </select>
                        </label>
                        <label>
                            Valor
                            <input type="text">
                        </label>
                        <button class="CardPay__paywayDelete">Eliminar</button>
                    </div>
                </div>
                <button id="new-payway">Nueva forma de pago</button>
            </div>

            <button class="CardPay__pay" id="CardPay__pay">Cobrar</button>
        </div>
    `;

    content.insertAdjacentHTML('beforeend',template);

    const content_details=document.getElementById('detalle');
    const btn_new_payway=document.getElementById('new-payway');
    const btn_pay=document.getElementById('CardPay__pay');
    const btn_close=document.getElementById('close-pay');

    btn_new_payway.addEventListener('click',(e)=>{
        const content=document.getElementById('content-payways');

        content.insertAdjacentHTML('beforeend',`
            <div class="CardPay__payway">
                <label>
                    Forma de pago
                    ${usePayWays()}
                </label>

                <label>
                    Tipo de pago
                    <select id="pay-way">
                        <option value="EFECTIVO">EFECTIVO</option>
                        <option value="AHORITA">AHORITA - BANCO DE LOJA</option>
                        <option value="DE UNA">DE UNA - BANCO PICHINCHA</option>
                        <option value="TARJETA CREDITO">TARJETA DE CRÉDITO - DATAFAST</option>
                        <option value="TARJETA DEBITO">TARJETA DE DEBITO - DATAFAST</option>
                    </select>
                </label>
                <label>
                    Valor
                    <input type="text">
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
                    });

                    total+=Number(i_total);
                    subtotal+=Number(sub_total);
                    iva+=Number(tax_total);
                }
            });

            const info_pay      =   {
                pay_way:document.getElementById('pay-way').value,
                subtotal:useRound({value:subtotal}),
                descuento:0,
                tax:useRound({value:iva}),
                total:useRound({value:total})
            };

            //  Validamos los datos ingresados
        
            if(
                client.identification_type!=="" & 
                client.name!=="" & 
                (client.identification!=="" & client.identification.length>=10) & 
                client.email!=="" & 
                client.phone!=="" & 
                client.dir!=="" &
                date!==""
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
                            btn,
                            context:'ORDER'
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
                    text:'Por favor, revise o ingrese todos los datos correctos del cliente.'
                });
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
    });

    document.getElementById('body').removeChild(document.getElementById('loader'));
}