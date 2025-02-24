export default function CartItemMenu({id,name,quantity,price,content}){

    let imagen=`
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 21C4.45 21 3.97933 20.8043 3.588 20.413C3.19667 20.0217 3.00067 19.5507 3 19V5C3 4.45 3.196 3.97933 3.588 3.588C3.98 3.19667 4.45067 3.00067 5 3H19C19.55 3 20.021 3.196 20.413 3.588C20.805 3.98 21.0007 4.45067 21 5V19C21 19.55 20.8043 20.021 20.413 20.413C20.0217 20.805 19.5507 21.0007 19 21H5ZM6 17H18L14.25 12L11.25 16L9 13L6 17Z" fill="#AEAEAE"/>
        </svg>
    `;

    const template=`
        <div class="CardItemMenu" data-id="${id}" data-price="${price}">
            <div class="CardItemMenu__image">
                ${imagen}
            </div>
            <div class="CardItemMenu__dates">
                <p>${name}</p>
                <div>
                    <button data-price="${price}" class="CardItemMenu__itemMinus">-</button>
                    <input 
                        class="CardItemMenu__ITEM"
                        data-id="${id}" 
                        data-price="${price}" 
                        data-name="${name}"
                        value="${quantity}"
                        type="number"
                    >
                    <button data-price="${price}" class="CardItemMenu__itemMore">+</button>
                </div>
            </div>
            <input type="number" value="${price}" class="CardItemMenu__price">
        </div>
    `;

    content.insertAdjacentHTML('beforeend',template);
}