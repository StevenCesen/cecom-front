import loader from "../../components/Loader/Loader.js";
import Push from "../../components/Push/Push.js";
import { URL_BASE } from "../../hooks/env.js";
import useGetResumeContributor from "../../hooks/useGetResumeContributor.js";

export default async function Home({contributor_id,app}) {

    loader();

    const data=await useGetResumeContributor({contributor_id});

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
                <canvas id="content-donut"></canvas>
            </div>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);
    
    const content_donut=document.getElementById('content-donut');

    new Chart(content_donut, {
        type: 'doughnut',
        data: {
            labels: [
              'Pendientes',
              'Procesados',
              'Finalizados'
            ],
            datasets: [{
              label: 'Pedidos de hoy',
              data: [300, 50, 100],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
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