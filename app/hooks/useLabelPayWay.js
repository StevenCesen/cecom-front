import usePayType from "./usePayType.js";
import usePayWays from "./usePayWays.js";

export default function useLabelPayWay(){
    return `
        <div class="LabelPayWay">
            <label>
                Valor
                <input type="number" id="value-pay">
            </label>
            <label>
                Forma de pago
                ${usePayWays()}
            </label>
            <label>
                Tipo de pago
                ${usePayType()}
            </label>
        </div>
    `;
}