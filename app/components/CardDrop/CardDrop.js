export default async function CardDrop({title,subtitle,placeholder,icon,datalist,order_id,content}){

    let itemlist="",context="";

    datalist.data.map(item=>{
        context=('price' in item) ? "products" : "clients";

        itemlist+=`
            <button
                ${
                    ('price' in item)
                    ?
                        `
                        data-id="${item.id}"
                        data-name="${item.name}"
                        data-price="${item.price}"  
                        data-description="${item.description}" 
                        data-descuento="${0}"
                        data-subtotal="${0}"  
                        data-tax="${0}"
                        data-order="${order_id}"
                        `
                    :   
                        `
                            data-name="${item.name}" 
                            data-identification="${item.identification}" 
                            data-email="${item.email}"
                            data-direction="${item.direction}"
                            data-phone="${item.phone}"
                            data-order="${order_id}"
                        `
                }
                data-context=${context}
                class="CardDrop__item"
            >
                <span>
                    ${icon}
                    ${item.name}
                </span>
                <span>${('price' in item) ? `$ ${item.price}` : item.identification}</span>
            </button>
        `;
    });

    const template=`
        <div class="CardDrop">
            <p>${title}</p>
            <button class="CardDrop__button btn-drop">
                <span>${subtitle}</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.53569 15.2295C7.93702 15.2295 6.58202 14.6742 5.47069 13.5635C4.36002 12.4535 3.80469 11.0989 3.80469 9.49953C3.80469 7.9002 4.36002 6.5452 5.47069 5.43453C6.58135 4.32387 7.93635 3.76887 9.53569 3.76953C11.135 3.7702 12.4897 4.32553 13.5997 5.43553C14.7097 6.54553 15.265 7.9002 15.2657 9.49953C15.2657 10.1942 15.1427 10.8665 14.8967 11.5165C14.6507 12.1665 14.3274 12.7225 13.9267 13.1845L19.8357 19.0915C19.929 19.1849 19.979 19.2999 19.9857 19.4365C19.9917 19.5719 19.9417 19.6929 19.8357 19.7995C19.729 19.9062 19.611 19.9595 19.4817 19.9595C19.3524 19.9595 19.2344 19.9062 19.1277 19.7995L13.2197 13.8915C12.7197 14.3175 12.1447 14.6472 11.4947 14.8805C10.8447 15.1139 10.1914 15.2305 9.53469 15.2305M9.53469 14.2305C10.8614 14.2305 11.9817 13.7739 12.8957 12.8605C13.809 11.9472 14.2657 10.8269 14.2657 9.49953C14.2657 8.1722 13.8094 7.0522 12.8967 6.13953C11.984 5.22687 10.864 4.7702 9.53669 4.76953C8.20935 4.76953 7.08902 5.2262 6.17569 6.13953C5.26235 7.05287 4.80535 8.17286 4.80469 9.49953C4.80402 10.8262 5.26069 11.9462 6.17469 12.8595C7.08869 13.7729 8.20869 14.2295 9.53469 14.2295" fill="black"/>
                </svg>
            </button>

            <div class="CardDrop__contentSearch">
                <label class="CardDrop__search">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.53569 15.2295C7.93702 15.2295 6.58202 14.6742 5.47069 13.5635C4.36002 12.4535 3.80469 11.0989 3.80469 9.49953C3.80469 7.9002 4.36002 6.5452 5.47069 5.43453C6.58135 4.32387 7.93635 3.76887 9.53569 3.76953C11.135 3.7702 12.4897 4.32553 13.5997 5.43553C14.7097 6.54553 15.265 7.9002 15.2657 9.49953C15.2657 10.1942 15.1427 10.8665 14.8967 11.5165C14.6507 12.1665 14.3274 12.7225 13.9267 13.1845L19.8357 19.0915C19.929 19.1849 19.979 19.2999 19.9857 19.4365C19.9917 19.5719 19.9417 19.6929 19.8357 19.7995C19.729 19.9062 19.611 19.9595 19.4817 19.9595C19.3524 19.9595 19.2344 19.9062 19.1277 19.7995L13.2197 13.8915C12.7197 14.3175 12.1447 14.6472 11.4947 14.8805C10.8447 15.1139 10.1914 15.2305 9.53469 15.2305M9.53469 14.2305C10.8614 14.2305 11.9817 13.7739 12.8957 12.8605C13.809 11.9472 14.2657 10.8269 14.2657 9.49953C14.2657 8.1722 13.8094 7.0522 12.8967 6.13953C11.984 5.22687 10.864 4.7702 9.53669 4.76953C8.20935 4.76953 7.08902 5.2262 6.17569 6.13953C5.26235 7.05287 4.80535 8.17286 4.80469 9.49953C4.80402 10.8262 5.26069 11.9462 6.17469 12.8595C7.08869 13.7729 8.20869 14.2295 9.53469 14.2295" fill="black"/>
                    </svg>
                    <input type="search" placeholder="${placeholder}" data-context="${context}" class="drop-search">
                </label>
                <div class="CardDrop__results">
                    ${itemlist}
                </div>
            </div>
        </div>
    `;

    content.insertAdjacentHTML('beforeend',template);
}