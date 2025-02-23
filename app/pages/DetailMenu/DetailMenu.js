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

            <div id="content-menus" class="Menus__list">

            </div>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    document.getElementById('body').removeChild(document.getElementById('loader'));
}