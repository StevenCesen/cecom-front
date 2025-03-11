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
            <div class="" id="content-report">
                
            </div>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);



}