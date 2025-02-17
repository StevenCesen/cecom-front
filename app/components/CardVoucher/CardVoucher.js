export default function CardVoucher({id,client_name,client_ci,pay_type,date,total,status,content}){
    const template=`
        <div data-id="${id}" class="CardVoucher">
            <div>
                <h4>${client_name}</h4>
                <span>${pay_type}</span>
            </div>
            <span>${client_ci}</span>
            <span>${date}</span>
            <span ${(status==='AUTORIZADO') ? 'class="CardVoucher__span--income"' : ""}><strong>$ ${total}</strong></span>
            <span>${status}</span>
            <button data-id="${id}" class="CardVoucher__button">Ver</button>
        </div>
    `;
    content.insertAdjacentHTML('beforeend',template);
}