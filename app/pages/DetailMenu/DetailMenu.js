import CartItemMenu from "../../components/CardItemMenu/CardItemMenu.js";
import CardModal from "../../components/CardModal/CardModal.js";
import CardNewMenu from "../../components/CardNewMenu/CardNewMenu.js";
import loader from "../../components/Loader/Loader.js";
import Push from "../../components/Push/Push.js";
import { URL_BASE } from "../../hooks/env.js";
import useGetMenu from "../../hooks/useGetMenu.js";

export default async function DetailMenu({id,app}) {

    loader();

    const menu=await useGetMenu({id});
    console.log(menu);

    const template=`
        <div class="Products">
            <div class="Products__nav">
                <h3>Menús</h3>
                <input class="Products__search" type="search" placeholder="Nombre del menú">
            </div>

            <div class="DetailMenu__inputs">
                <label>
                    Nombre
                    <input type="text" value="${menu.data.name}">
                </label>
                <label>
                    Visibilidad
                    <select>
                        <option ${(menu.data.status==='ACTIVO') ? 'selected' : ''} value="ACTIVO">ACTIVO</option>
                        <option ${(menu.data.status==='INACTIVO') ? 'selected' : ''} value="INACTIVO">INACTIVO</option>
                    </select>
                </label>
            </div>

            <div id="content-menu" class="Menus__list">

            </div>

            <button class="DetailMenu__button" id="update-menu">Actualizar menú</button>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    const content_menu=document.getElementById('content-menu');

    menu.data.items.map((item)=>{
        CartItemMenu({
            id:0,
            name:item.name,
            quantity:item.quantity_menu,
            price:item.price_menu,
            content:content_menu
        });
    });

    document.getElementById('body').removeChild(document.getElementById('loader'));
}