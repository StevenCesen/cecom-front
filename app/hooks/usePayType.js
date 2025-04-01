export default function usePayType(){
    const select=`
        <select class="pay-type" id="pay-type">
            <option value="">-- Seleccionar --</option>
            <option value="EFECTIVO">EFECTIVO</option>
            <option value="AHORITA">AHORITA - BANCO DE LOJA</option>
            <option value="DE UNA">DE UNA - BANCO PICHINCHA</option>
            <option value="TARJETA CREDITO">TARJETA DE CRÉDITO - DATAFAST</option>
            <option value="TARJETA DEBITO">TARJETA DE DEBITO - DATAFAST</option>
        </select>
    `;

    return select;
}