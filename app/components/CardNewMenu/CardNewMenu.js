import useGetProducts from "../../hooks/useGetProducts.js";

export default async function CardNewMenu({contributor_id}){

    const template=`
        <div class="Menu" id="new-menu">
            <label class="Menu__search">
                Buscar productos
                <input type="search" id="search-product" placeholder="Nombre">
                <div class="Menu__searchList" id="content-list-products">
                    
                </div>
            </label>

            <h3 class="Menu__title">Información del menú</h3>
            
            <label class="Menu__label">
                Nombre del menú
                <input type="text" id="name-menu" placeholder="Escribe aquí...">
            </label>
            
            <div id="content-items-menu" class="Menu__items">
            
            </div>

            <div class="Menu__footer">
                <button id="save-menu">Guardar menú</button>
            </div>
        </div>
    `;

    return template;
}