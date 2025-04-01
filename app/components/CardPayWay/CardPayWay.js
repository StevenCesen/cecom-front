export default function CardPayWay({content}){
    const template=`
        <div class="CardPayWay">
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
        </div>
    `;

    content.insertAdjacentHTML('beforeend',template);
}