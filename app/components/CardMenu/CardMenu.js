export default function CardMenu({id,name,nro_products,value,status,content}){
    const template=`
        <a href="#/menus/${id}" class="CardMenu">
            <div class="CardMenu__title">
                <h3>${name}</h3>
                <p>${nro_products} productos</p>
            </div>
            <div class="CardMenu__status">
                <p>${status}</p>
                <p>$ ${value}</p>
            </div>
        </a>
    `;

    content.insertAdjacentHTML('beforeend',template);
}