import usePayType from "../../hooks/usePayType.js";
import usePayWays from "../../hooks/usePayWays.js";

export default function Cart({mode}){
    let search_product="";
    let client="";
    let pay="";
    let items="";

    let footer=`
        <button id="generate-commander">Generar comanda</button>
    `;

    let note=``;

    let total=``;

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
        const cart=(localStorage.getItem('cart')!==null) ? JSON.parse(localStorage.getItem('cart')) : [];
        let total_value=0;

        client=`
            <div class="Cart__client">
                <label>
                    Cliente
                    <input id="client_name" type="text" placeholder="Nombre y apellido">
                </label>
                <label>
                    Piso
                    <select id="client_piso">
                        <option value="">-- Seleccionar --</option>
                        <option value="PB">Planta Baja</option>
                        <option value="P1">Primer Piso</option>
                        <option value="P2">Segundo Piso</option>
                    </select>
                </label>
                <label>
                    Mesa
                    <select id="client_mesa">
                        <option value="">-- Seleccionar --</option>
                        <option value="M1">Mesa 1</option>
                        <option value="M2">Mesa 2</option>
                        <option value="M3">Mesa 3</option>
                        <option value="M4">Mesa 4</option>
                        <option value="M5">Mesa 5</option>
                        <option value="M6">Mesa 6</option>
                        <option value="M7">Mesa 7</option>
                        <option value="M8">Mesa 8</option>
                        <option value="M9">Mesa 9</option>
                        <option value="M10">Mesa 10</option>
                        <option value="M11">Mesa 11</option>
                        <option value="M12">Mesa 12</option>
                        <option value="M13">Mesa 13</option>
                        <option value="M14">Mesa 14</option>
                        <option value="M15">Mesa 15</option>
                    </select>
                </label>
            </div>
        `;

        cart.map(item=>{ 
            total_value+=Number(item.price)*Number(item.quantity);
            items+=`
                <div class="Cart__item" data-id="${item.id}" data-price="${item.price}" data-name="${item.name}" >
                    <div class="Cart__itemImage">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 21C4.45 21 3.97933 20.8043 3.588 20.413C3.19667 20.0217 3.00067 19.5507 3 19V5C3 4.45 3.196 3.97933 3.588 3.588C3.98 3.19667 4.45067 3.00067 5 3H19C19.55 3 20.021 3.196 20.413 3.588C20.805 3.98 21.0007 4.45067 21 5V19C21 19.55 20.8043 20.021 20.413 20.413C20.0217 20.805 19.5507 21.0007 19 21H5ZM6 17H18L14.25 12L11.25 16L9 13L6 17Z" fill="#AEAEAE"/>
                        </svg>
                    </div>
                    <div class="Cart__itemDates">
                        <p>${item.name}</p>
                        <div>
                            <button data-price="${item.price}" class="Cart__itemMinus">-</button>
                            <input 
                                class="Cart__itemITEM"
                                data-id="${item.id}" 
                                data-price="${item.price}" 
                                data-name="${item.name}" 
                                data-description="" 
                                data-descuento="${0}"
                                data-subtotal="${0}"  
                                data-tax="${0}"
                                value="${item.quantity}"
                                type="number"
                            >
                            <button data-price="${item.price}" class="Cart__itemMore">+</button>
                        </div>
                    </div>
                    <label class="Cart__price">$ ${Number(item.price)*Number(item.quantity).toFixed(2)}</label>

                    <button data-id="${item.id}"  class="Cart__button--delete remove-to-commander">
                        <svg data-id="${item.id}"  class="remove-to-commander" width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path data-id="${item.id}"  class="remove-to-commander" d="M6 20.0005V6.00047H5V5.00047H9V4.23047H15V5.00047H19V6.00047H18V20.0005H6ZM7 19.0005H17V6.00047H7V19.0005ZM9.808 17.0005H10.808V8.00047H9.808V17.0005ZM13.192 17.0005H14.192V8.00047H13.192V17.0005Z" fill="#FF5152"/>
                        </svg>
                    </button>
                    <div></div>
                    <textarea class="Cart__itemNote" placeholder="Nueva nota"></textarea>
                </div>
            `;
        });

        total=`
            <strong>Total:</strong>
            $ ${total_value}
        `;
    }

    const template=`
        <div class="Cart">
            ${client}
            ${search_product}
            <h3 class="Cart__title">Detalle</h3>

            <div class="Cart__list" id="cart-list">
                ${items}
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