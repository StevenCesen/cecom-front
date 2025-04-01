import loader from "../../components/Loader/Loader.js";
import Push from "../../components/Push/Push.js";
import { URL_BASE } from "../../hooks/env.js";
import useGetResumeContributor from "../../hooks/useGetResumeContributor.js";
import useGetResumeProducts from "../../hooks/useGetResumeProducts.js";

export default async function Home({contributor_id,app}) {

    loader();

    const data=await useGetResumeContributor({contributor_id});
    const products=await useGetResumeProducts({contributor_id});

    let bars="",max=0;

    if(products.length>0){
        max=products[0].Cantidad;
    }

    products.map(product=>{

        let porcentaje=product.Cantidad*100/max;

        bars+=`
            <div class="Home__metricsBar">
                <div>
                    <p>${product.Producto}</p>
                    <p>${product.Cantidad} Vendidos</p>
                </div>
                <span style="width:${porcentaje}% !important;"></span>
            </div>
        `;
        
    });

    const template=`
        <div class="Home">

            <div class="Home__head">
                <div>
                    <label>HOY</label>
                    <h3>$ ${data.total_now}</h3>
                </div>
                <div>
                    <label>AYER: <strong>$ ${data.total_yesterday}</strong></label>
                    <label>ESTE MES: <strong>$ ${data.total_month}</strong></label>
                </div>
            </div>

            <div class="Home__metrics">
                <div class="Home__labels">
                    <div class="Home__label">
                        <label>Clientes</label>
                        <h3>${data.clients}</h3>
                    </div>
                    <div class="Home__label">
                        <label>Productos</label>
                        <h3>${data.products}</h3>
                    </div>
                    <div class="Home__label">
                        <label>Ventas</label>
                        <h3>${data.vouchers}</h3>
                    </div>
                </div>
            </div>
            
            <div class="Home__graphics">
                <div>
                    <div>
                        <h2>Ventas mensuales</h2>
                        <span>Comparación de ventas por cada mes</span>
                    </div>

                    <canvas id="content-donut"></canvas>
                </div>
                <div>
                    <div>
                        <h2>Productos más vendidos en este mes</h2>
                        <span>Productos con mayor volumen de venta</span>
                    </div>
                    <div class="Home__contentBars" id="content-list-bars">
                        ${bars}
                    </div>
                </div>
            </div>

        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);
    
    const content_donut=document.getElementById('content-donut');

    new Chart(content_donut, {
        type: 'line',
        data: {
            labels: [
              'ENE',
              'FEB',
              'MAR',
              'ABR',
              'MAY',
              'JUN',
              'JUL',
              'AGO',
              'SEP',
              'OCT',
              'NOV',
              'DIC'
            ],
            datasets: [{
              label: 'Ventas del mes',
              data: [0, 0, 22,0,0,0,0,0,0,0,0],
              backgroundColor: [
                'rgb(54, 162, 235)'
              ]
            }]
        },
        options: {
            responsive:true,
            scales: {
            y: {
                beginAtZero: true
            }
            }
        }
    });

    document.getElementById('body').removeChild(document.getElementById('loader'));
}