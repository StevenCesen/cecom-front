import CardProductSelect from "../../components/CardProductSelect/CardProductSelect.js";
import useGetProducts from "../../hooks/useGetProducts.js";

export default async function Item({id,name,price,app}) {

    let imagen=`
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 21C4.45 21 3.97933 20.8043 3.588 20.413C3.19667 20.0217 3.00067 19.5507 3 19V5C3 4.45 3.196 3.97933 3.588 3.588C3.98 3.19667 4.45067 3.00067 5 3H19C19.55 3 20.021 3.196 20.413 3.588C20.805 3.98 21.0007 4.45067 21 5V19C21 19.55 20.8043 20.021 20.413 20.413C20.0217 20.805 19.5507 21.0007 19 21H5ZM6 17H18L14.25 12L11.25 16L9 13L6 17Z" fill="#AEAEAE"/>
        </svg>
    `;
    
    const data_products=await useGetProducts({
        contributor_id:localStorage.getItem('cc'),
        filters:""
    });

    const template=`
        <div class="Item">
            <div class="Item__image">
                ${imagen}
            </div>

            <h2 class="Item__title">${name}</h2>
            <p class="Item_price">$ ${price}</p>

            <h3 class="Item__subtitle">Agranda tu orden con</h3>
            <div class="Item__slides">
                <div id="content-complements">

                </div>
            </div>
            
            <h3 class="Item__subtitle">¿Desea agregar una bebida?</h3>
            <div class="Item__slides" style="margin-bottom:100px">
                <div id="content-drinks">
                    
                </div>
            </div>

            <div class="Item__footer">
                <div>
                    <button data-id="${id}">-</button>
                    <input data-id="${id}" type="number">
                    <button data-id="${id}">+</button>
                </div>
                <button data-id="${id}">Agregar</button>
            </div>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    const content_complements=document.getElementById('content-complements');
    const content_drinks=document.getElementById('content-drinks');

    data_products.data.map((item)=>{
        CardProductSelect({
            id:item.id,
            image:"",
            name:item.name,
            price:item.price,
            content:content_complements
        });
    });

    document.getElementById('body').removeChild(document.getElementById('loader'));
}