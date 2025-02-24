import { URL_BASE, URL_ROOT } from "../../hooks/env.js";
import loader from "../Loader/Loader.js";
import Push from "../Push/Push.js";

export default function CardDetailVoucher({id,client,contributor,ride_path,xml_path,access_key,total,date,sequential,app}){
    const template=`
        <div class="CardDetailVoucher">
            <p class="CardDetailVoucher__name">${client.name}</p>
            <h2 class="CardDetailVoucher__total">$ ${total}</h2>
            <div class="CardDetailVoucher__dates">
                <label>
                    Fecha
                    <p>${date}</p>
                </label>
                <label>
                    Número
                    <p>${sequential}</p>
                </label>
            </div>

            <label class="CardDetailVoucher__email">
                Correo electrónico
                <input type="text" id="email-voucher" value="${client.email}">
            </label>

            <div class="CardDetailVoucher__access">
                <a href="${URL_ROOT}public/ride_clients/${contributor.identification}/${ride_path}" target="_blank">RIDE</a>
                <a href="${URL_ROOT}public/xml_clients/${contributor.identification}/autorizados/${xml_path}" target="_blank">XML</a>
                <button 
                    class="CardDetailVoucher__send"
                    data-id="${id}"
                    id="send-invoice"
                >Enviar</button>
            </div>
            <button id="close-voucher">Volver</button>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    const btn_close=document.getElementById('close-voucher');
    const btn_invoice=document.getElementById('send-invoice');

    btn_invoice.addEventListener('click',async (e)=>{
        loader();

        const data={
            'access_key':access_key,
            'contributor_identification':contributor.identification,
            'client_name':client.name,
            'client_identification':client.identification,
            'client_direction':client.dir,
            'client_phone':client.phone,
            'client_email':document.getElementById('email-voucher').value,
            'concept':`CONSUMO EN ESTABLECIMIENTO ${contributor.commercial_name}`,
            'contributor_name':contributor.name
        };

        const request=await fetch(`${URL_BASE}sendInvoice`,{
            method:'POST',
            headers: {
                Accept: 'application/json'
            },
            body:new URLSearchParams(data)
        });

        const response=await request.json();

        if(response.status===200){
            Push({
                text:response.message
            });
        }else{
            Push({
                text:'Error, revisa el correo e inténtalo de nuevo'
            });
        }

        document.getElementById('body').removeChild(document.getElementById('loader'));
    });

    btn_close.addEventListener('click',(e)=>{
        const parent=e.target.parentElement.parentElement;
        parent.removeChild(e.target.parentElement);
    });

    document.getElementById('body').removeChild(document.getElementById('loader'));
}