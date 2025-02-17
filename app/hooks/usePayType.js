export default function usePayType(){
    const select=`
        <select id="pay-type">
            <option value="01">EFECTIVO</option>
            <option value="02">TRANSFERENCIA</option>
            <option value="03">DEPÓSITO</option>
            <option value="04">OTROS</option>
        </select>
    `;

    return select;
}