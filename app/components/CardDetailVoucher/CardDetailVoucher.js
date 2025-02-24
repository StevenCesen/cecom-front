import { URL_ROOT } from "../../hooks/env.js";

export default function CardDetailVoucher({id,client,contributor,ride_path,xml_path,total,date,sequential,app}){
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
            <div class="CardDetailVoucher__access">
                <a href="${URL_ROOT}public/ride_clients/${contributor.identification}/${ride_path}" target="_blank">RIDE</a>
                <a href="${URL_ROOT}public/xml_clients/${contributor.identification}/autorizados/${xml_path}" target="_blank">XML</a>
                <button 
                    class="CardDetailVoucher__send"
                    data-id="${id}"
                >Enviar</button>
            </div>
            <button id="close-voucher">Volver</button>
        </div>
    `;
    app.insertAdjacentHTML('beforeend',template);

    const btn_close=document.getElementById('close-voucher');

    btn_close.addEventListener('click',(e)=>{
        const parent=e.target.parentElement.parentElement;
        parent.removeChild(e.target.parentElement);
    });

    document.getElementById('body').removeChild(document.getElementById('loader'));
}