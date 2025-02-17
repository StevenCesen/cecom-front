import useGetCategories from "../../hooks/useGetCategories.js";

export default async function CardNewProduct(){
    let imagen=`
        <svg width="250" height="250" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 21C4.45 21 3.97933 20.8043 3.588 20.413C3.19667 20.0217 3.00067 19.5507 3 19V5C3 4.45 3.196 3.97933 3.588 3.588C3.98 3.19667 4.45067 3.00067 5 3H19C19.55 3 20.021 3.196 20.413 3.588C20.805 3.98 21.0007 4.45067 21 5V19C21 19.55 20.8043 20.021 20.413 20.413C20.0217 20.805 19.5507 21.0007 19 21H5ZM6 17H18L14.25 12L11.25 16L9 13L6 17Z" fill="#AEAEAE"/>
        </svg>
    `;

    let categories="";

    let data_categories=await useGetCategories({
        contributor_id:localStorage.getItem('cc')
    });

    data_categories.map(type=>{
        categories+=`
            <option value="${type.id}">${type.name}</option>
        `;
    });

    const template=`
        <div class="CardNewProduct">
            <h3 class="CardNewProduct__title">Información del producto</h3>

            <div class="CardNewProduct__principal">
                <label>
                    Nombre del producto
                    <input type="text" placeholder="Escribe aquí..." id="name-product">
                </label>

                <div>
                    ${imagen}
                    <label for="image-product">
                        Cambiar foto
                        <input type="file" id="image-product">
                    </label>
                </div>

                <label>
                    Descripción
                    <textarea placeholder="Añade una descripción" id="description-product"></textarea>
                </label>
            </div>

            <div class="CardNewProduct__dates">
                <label>
                    Cantidad
                    <input type="number" value="0" id="size-product" required>
                </label>
                <label>
                    Precio (con impuesto)
                    <input type="number" id="price-product" value="0.00" required>
                </label>
            </div>

            <div class="CardNewProduct__dates">
                <img id="render-barras" src="">
                <label>
                    Código externo
                    <input type="text" id="code-product">
                </label>
            </div>

            <div class="CardNewProduct__datesNew">
                Categoría
                <label>
                    <select id="category-product">
                        <option value="">-- Seleccionar --</option>
                        ${categories}
                    </select>
                    <span>ó</span>
                    <input type="text" id="new-category" placeholder="Nueva...">
                </label>
            </div>

            <div class="CardNewProduct__dates">
                <label>
                    Impuesto
                    <select id="tax-product">
                        <option value="">-- Seleccionar --</option>
                        <option value="IVA_0">IVA_0</option>
                        <option value="APLICA_IVA">APLICA_IVA</option>
                    </select>
                </label>
                <label>
                    Estado
                    <select id="state-product">
                        <option value="">-- Seleccionar --</option>
                        <option value="ACTIVO">ACTIVO</option>
                        <option value="INACTIVO">INACTIVO</option>
                    </select>
                </label>
            </div>

            <div class="CardNewProduct__footer">
                <button id="save-product">Guardar producto</button>
            </div>
        </div>
    `;

    return template;
}