export default function CardProductSelect({id,image,name,price,content}){
    let imagen=`
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 21C4.45 21 3.97933 20.8043 3.588 20.413C3.19667 20.0217 3.00067 19.5507 3 19V5C3 4.45 3.196 3.97933 3.588 3.588C3.98 3.19667 4.45067 3.00067 5 3H19C19.55 3 20.021 3.196 20.413 3.588C20.805 3.98 21.0007 4.45067 21 5V19C21 19.55 20.8043 20.021 20.413 20.413C20.0217 20.805 19.5507 21.0007 19 21H5ZM6 17H18L14.25 12L11.25 16L9 13L6 17Z" fill="#AEAEAE"/>
        </svg>
    `;

    if(image!==""){
        imagen=image;
    }

    const template=`
        <a href="#/items/${id}" class="CardProductSelect">
            <div>
                ${imagen}
            </div>
            <p>${name}</p>
            <span><strong>$ ${price}</strong></span>
        </a>
    `;
    content.insertAdjacentHTML('beforeend',template);
}