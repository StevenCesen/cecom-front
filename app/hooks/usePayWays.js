export default function usePayWays(){
    const select=`
        <select id="pay-way">
            <option value="01">EFECTIVO - SIN UTILIZACIÓN DEL SISTEMA FINANCIERO</option>
            <option value="15">COMPENSACIÓN DE DEUDAS</option>
            <option value="16">TARJETA DE DÉBITO</option>
            <option value="17">DINERO ELECTRÓNICO</option>
            <option value="18">TARJETA PREPAGO</option>
            <option value="19">TARJETA DE CRÉDITO</option>
            <option value="20">OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO</option>
            <option value="21">ENDOSO DE TÍTULOS</option>
        </select>
    `;

    return select;
}