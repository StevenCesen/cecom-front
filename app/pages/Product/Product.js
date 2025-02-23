import loader from "../../components/Loader/Loader.js";
import Push from "../../components/Push/Push.js";
import { URL_BASE } from "../../hooks/env.js";
import useGetCategories from "../../hooks/useGetCategories.js";
import useGetProduct from "../../hooks/useGetProduct.js";

export default async function Product({id,app}) {

    loader();

    const data=await useGetProduct({id});

    let imagen=`
        <svg width="300" height="300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 21C4.45 21 3.97933 20.8043 3.588 20.413C3.19667 20.0217 3.00067 19.5507 3 19V5C3 4.45 3.196 3.97933 3.588 3.588C3.98 3.19667 4.45067 3.00067 5 3H19C19.55 3 20.021 3.196 20.413 3.588C20.805 3.98 21.0007 4.45067 21 5V19C21 19.55 20.8043 20.021 20.413 20.413C20.0217 20.805 19.5507 21.0007 19 21H5ZM6 17H18L14.25 12L11.25 16L9 13L6 17Z" fill="#AEAEAE"/>
        </svg>
    `;

    let categories="";
    let data_categories=await useGetCategories({
        contributor_id:localStorage.getItem('cc')
    });

    data_categories.map(type=>{
        if(type.id===data.type_id){
            categories+=`
                <option selected value="${type.id}">${type.name}</option>
            `;
        }else{
            categories+=`
                <option value="${type.id}">${type.name}</option>
            `;
        }
    });

    const template=`
        <div class="Product">
            <div class="Product__image">
                ${imagen}
            </div>

            <input type="text" id="name-product" value="${data.name}">

            <p class="Product_price">
                $
                <input type="number" id="price-product" value="${data.price}">
            </p>

            <label>
                Descripción
                <textarea id="description-product">${data.description}</textarea>
            </label>

            <div class="CardNewProduct__dates">
                <label>
                    Cantidad
                    <input type="number" value="${data.quantity}" id="size-product" required>
                </label>
                <label>
                    Precio (con impuesto)
                    <input type="number" id="price-product" value="${data.price}" required>
                </label>
            </div>

            <div class="CardNewProduct__datesBarcode">
                <svg id="barcode"></svg>
                <label>
                    Código externo
                    <input type="text" value="${data.code_aux}" id="code-product">
                </label>
            </div>

            <div class="CardNewProduct__dates">
                <label>
                    Categoría
                    <select id="category-product" value="${data.type_id}">
                        <option value="">-- Seleccionar --</option>
                        ${categories}
                    </select>
                </label>
                <label>
                    Complemento
                    <select id="complement-product" value="">
                        <option value="">-- Seleccionar --</option>
                        <option value="cat">Con categoría</option>
                        <option value="products">Con productos</option>
                        <option value="view">Ver complementos</option>
                    </select>
                </label>
            </div>

            <div class="CardNewProduct__dates">
                <label>
                    Impuesto
                    <select id="tax-product" value="${data.tax}">
                        <option value="">-- Seleccionar --</option>
                        <option value="IVA_0" ${(data.tax==='IVA_0') ? 'selected' : ''}>IVA_0</option>
                        <option value="APLICA_IVA" ${(data.tax==='APLICA_IVA') ? 'selected' : ''}>APLICA_IVA</option>
                    </select>
                </label>
                <label>
                    Estado
                    <select id="state-product">
                        <option value="">-- Seleccionar --</option>
                        <option value="ACTIVO" ${(data.state==='ACTIVO') ? 'selected' : ''}>ACTIVO</option>
                        <option value="INACTIVO" ${(data.state==='INACTIVO') ? 'selected' : ''}>INACTIVO</option>
                    </select>
                </label>
            </div>
        
            <div class="Product__footer">
                <button class="Product__button" id="update-product">Actualizar</button>
            </div>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);
    document.getElementById('body').removeChild(document.getElementById('loader'));

    const btn_update_product=document.getElementById('update-product');
    const select_complements=document.getElementById('complement-product');

    JsBarcode("#barcode",data.name);

    btn_update_product.addEventListener('click',async (e)=>{
        loader();
        
        const name_product=document.getElementById('name-product').value;
        const description_product=document.getElementById('description-product').value;
        const size_product=document.getElementById('size-product').value;
        const price_product=document.getElementById('price-product').value;
        const code_product=document.getElementById('code-product').value;
        const category_product=document.getElementById('category-product').value;
        const tax_product=document.getElementById('tax-product').value;
        const state_product=document.getElementById('state-product').value;

        //  Validamos los datos
        if(
            name_product!=="" &
            description_product!=="" &
            size_product!=="" &
            price_product!=="" &
            (category_product!=="") &
            tax_product!=="" &
            state_product!==""
        ){  
            const data={
                'name':name_product,
                'code_aux':code_product,
                'quantity':size_product,
                'tax':tax_product,
                'description':description_product,
                'image_path':"",
                'price':price_product,
                'state':state_product,
                'type_id':category_product
            };
            
            //  Creamos el producto
            const request_product=await fetch(`${URL_BASE}products/${id}`,{
                method:'PUT',
                headers: {
                    Accept: 'application/json'
                },
                body:new URLSearchParams(data)
            });
        
            const response_product=await request_product.json();
            if(response_product.status===200){
                Push({
                    text: 'Producto actualizado correctamente.'
                });
            }else{
                Push({
                    text: 'Algo salió mal, inténtalo de nuevo.'
                });
            }
        }else{
            Push({
                text: 'Por favor, llene los datos del producto.'
            });
        }

        document.getElementById('body').removeChild(document.getElementById('loader'));
    });

}