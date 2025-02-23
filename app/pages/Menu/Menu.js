import CardMenu from "../../components/CardMenu/CardMenu.js";
import CardModal from "../../components/CardModal/CardModal.js";
import CardNewMenu from "../../components/CardNewMenu/CardNewMenu.js";
import loader from "../../components/Loader/Loader.js";
import Push from "../../components/Push/Push.js";
import { URL_BASE } from "../../hooks/env.js";
import useGetMenus from "../../hooks/useGetMenus.js";

export default async function Menus({contributor_id,app}) {

    loader();

    const menus=await useGetMenus({contributor_id});

    const template=`
        <div class="Products">
            <div class="Products__nav">
                <h3>Menús</h3>
                <input class="Products__search" type="search" placeholder="Nombre del menú">
            </div>

            <div id="content-menus" class="Menus__list">

            </div>

            <button class="Orders__button" id="new-menu">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M12 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    const content_menus=document.getElementById('content-menus');
    const btn_new_menu=document.getElementById('new-menu');

    btn_new_menu.addEventListener('click',async (e)=>{
        CardModal({
            template:await CardNewMenu({contributor_id}),
            content:document.getElementById('body')
        });
    });

    console.log(menus)

    menus.data.map((menu)=>{
        CardMenu({
            id:menu.id,
            name:menu.name,
            nro_products:menu.items.length,
            value:menu.import,
            status:menu.status,
            content:content_menus
        });
    });

    document.getElementById('body').removeChild(document.getElementById('loader'));
}