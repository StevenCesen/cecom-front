export default async function CardNewTicket(){
    const template=`
        <div class="CardNewProduct">
            <h3 class="CardNewProduct__title">Información del ticket</h3>

            <div class="CardNewProduct__principal">
                <label>
                    Motivo
                    <input type="text" placeholder="Escribe aquí..." id="name-ticket">
                </label>

                <label>
                    Fecha de entrega
                    <input type="date">
                </label>

                <label>
                    Descripción de inicio
                    <textarea placeholder="Añade una descripción para inicio del ticket"></textarea>
                </label>
            </div>

            <h4>¿El equipo lo entregan con?</h4>

            <div class="CardNewProduct__dates">
                <label>
                    <input type="number" value="0" id="size-product" required>
                    <button>Agregar</button>
                </label>
            </div>

            <h4>¿Qué se va a cobrar?</h4>

            <label>
                Buscar producto o servicio
                <input type="search" id="code-product">
            </label>

            <div>
                
            </div>

            <label>
                <h4>Subtotal: </h4>
                <h4></h4>
            </label>

            <label>
                <h4>IVA: </h4>
                <h4></h4>
            </label>

            <label>
                <h4>Total: </h4>
                <h4></h4>
            </label>

            <div class="CardNewProduct__footer">
                <button id="save-ticket">Generar ticket</button>
            </div>
        </div>
    `;

    return template;
}