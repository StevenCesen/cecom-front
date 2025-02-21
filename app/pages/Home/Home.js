import loader from "../../components/Loader/Loader.js";
import Push from "../../components/Push/Push.js";
import { URL_BASE } from "../../hooks/env.js";

export default async function Home({contributor_id,app}) {

    //loader();

    const template=`
        <div class="Home">
            <div class="Home__head">
                <div>
                    <label>HOY</label>
                    <h3>$ 117.10</h3>
                </div>
                <div>
                    <label>AYER: <strong>$ 200.00</strong></label>
                    <label>ESTE MES: <strong>$ 2000.00</strong></label>
                </div>
            </div>
            <div class="Home__metrics">
                <div class="Home__labels">
                    <div class="Home__label">
                        <label>Clientes</label>
                        <h3>120</h3>
                    </div>
                    <div class="Home__label">
                        <label>Productos</label>
                        <h3>50</h3>
                    </div>
                    <div class="Home__label">
                        <label>Ventas</label>
                        <h3>10</h3>
                    </div>
                </div>
                <canvas id="content-donut"></canvas>
            </div>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    const content_metric=document.getElementById('content-metric');
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

    new Chart(content_metric, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
            datasets: [{
            label: 'Ingresos mensuales',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10000, 5000, 2000, 1000, 30,0,0,0,0,0,0],
            borderWidth: 1
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
}