import loader from "../../components/Loader/Loader.js";
import Push from "../../components/Push/Push.js";
import useGetCierreCaja from "../../hooks/useGetCierreCaja.js";

export default async function Reporte({app}) {
    const template=`
        <div class="Reporte">
            <h2>Cobros</h2>
            <div class="Reporte__filters">
                <label>
                    Desde
                    <input type="datetime-local" id="date-init">
                </label>
                <label>
                    Hasta
                    <input type="datetime-local" id="date-end">
                </label>
                <a href="" id="generate">Generar</a>
            </div>
            <div class="">
                <div class="Reporte__head">
                    <label>FECHA</label>
                    <label>SECUENCIAL</label>
                    <label>CLIENTE</label>
                    <label>IDENTIFICACIÓN</label>
                    <label>VALOR</label>
                </div>
                <div id="content-report">

                </div>
            </div>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    const btn_generate=document.getElementById('generate');
    const content=document.getElementById('content-report');

    btn_generate.addEventListener('click',async (e)=>{
        e.preventDefault();

        loader();

        const date_init=document.getElementById('date-init');
        const date_end=document.getElementById('date-end');

        if(date_init.value===""){
            Push({
                text:"Por favor, ingrese una fecha de inicio."
            })
        }else if(date_end.value===""){
            Push({
                text:"Por favor, ingrese una fecha de cierre."
            })
        }else{
            const data=await useGetCierreCaja({
                contributor_id:localStorage.getItem('cc'),
                filters:`date_init=${date_init.value}&date_end=${date_end.value}`
            });

            console.log(data);

            data.data.map((pay)=>{
                let detail="";

                pay.items.map(item=>{
                    detail+=`
                        <div>
                            <label>${item.payment_date}</label>
                            <label>${item.payment_id}</label>
                            <label>${item.client_name}</label>
                            <label>${item.client_ci}</label>
                            <label>${item.payment_value}</label>
                        </div>
                    `;
                });

                content.insertAdjacentHTML('beforeend',`
                    <div class="Reporte__item">
                        <h4>${pay.type} ($ ${pay.total})</h4>
                        <div>
                            ${detail}
                        </div>
                    </div>
                `);
            });
        }

        document.getElementById('body').removeChild(document.getElementById('loader'));
    });

}