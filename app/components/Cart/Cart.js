import usePayType from "../../hooks/usePayType.js";
import usePayWays from "../../hooks/usePayWays.js";

export default function Cart({mode}){
    let search_product="";
    let client="";
    let pay="";

    let footer=`
        <button id="generate-commander">Generar comanda</button>
    `;

    let note=`
        <label class="Item__notes">
            Agrega una nota
            <textarea placeholder="Añade una nota"></textarea>
        </label>
    `;

    let total=`
        <strong>Total:</strong>
        $ 12.00
    `;

    if(mode!=='only-cart'){
        client+=`
            <div class="Cart__search">
                <label>
                    Buscar cliente
                    <input type="search" id="search-client" placeholder="Nombre o identificación">
                </label>
                <div class="Cart__searchList" id="content-list-clients">

                </div>
                <div class="Cart__searchClient">
                    <label>
                        Nombre
                        <input type="text" id="name-client">
                    </label>
                    <label>
                        C.I./R.U.C
                        <input type="text" id="identification-client">
                    </label>
                    <label>
                        Correo electrónico
                        <input type="text" id="email-client">
                    </label>
                    <label>
                        Teléfono
                        <input type="text" id="phone-client">
                    </label>
                    <label>
                        Dirección
                        <input type="text" id="direction-client">
                    </label>
                    <label>
                        Fecha de emisión
                        <input type="date" id="date">
                    </label>
                </div>
            </div>
        `;

        search_product+=`
            <div class="Cart__search">
                <label>
                    Buscar productos
                    <input type="search" id="search-product" placeholder="¿Qué buscaremos hoy?">
                </label>
                <div class="Cart__searchList" id="content-list-products">

                </div>
            </div>
        `;

        pay=`
            <div class="Cart__pay">
                <label>
                    Forma de pago
                    ${usePayWays()}
                </label>
                <label>
                    Tipo de pago
                    ${usePayType()}
                </label>
                <div class="" id="Cart__payAditional">
                </div>
            </div>
        `;

        footer=`
            <button id="generate-invoice">Vender</button>
        ` ;
        note="";
        total="";

    }else{  // Debo consultar de la BD el pedido de la comanda para renderizar los productos

    }

    const template=`
        <div class="Cart">
            ${client}
            ${search_product}
            <h3 class="Cart__title">Detalle</h3>

            <div class="Cart__list" id="cart-list">
                
            </div>

            <label class="Cart__total" id="total">
                ${total}
            </label>
            
            ${note}

            ${pay}

            <div class="Cart__footer">
                ${footer}
            </div>
        </div>
    `;

    return template;
}