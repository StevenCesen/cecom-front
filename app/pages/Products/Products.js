import CardModal from "../../components/CardModal/CardModal.js";
import CardNewProduct from "../../components/CardNewProduct/CardNewProduct.js";
import CardProduct from "../../components/CardProduct/CardProduct.js";

export default async function Products({app,data}) {
    const template=`
        <div class="Products">
            <div class="Products__nav">
                <h3>Productos</h3>
                <input class="Products__search" type="search" placeholder="Nombre del item o código">
            </div>
            
            <span class="Products__subtitle">${data.total} items encontrados</span>

            <div class="Products__list" id="content-list">
                
            </div>
            
            <button class="Orders__button" id="new-product">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M12 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    const content=document.getElementById('content-list');
    const btn_new_product=document.getElementById('new-product')

    data.data.map((product)=>{
        CardProduct({
            id:product.id,
            image:product.image_path,
            name:product.name,
            description:product.description,
            price:product.price,
            iva:product.tax,
            content:content
        });
    });

    btn_new_product.addEventListener('click',async (e)=>{
        CardModal({
            template:await CardNewProduct(),
            content:document.getElementById('body')
        });
    });

    document.getElementById('body').removeChild(document.getElementById('loader'));
}