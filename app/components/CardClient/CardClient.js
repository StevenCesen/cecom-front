export default function CardClient({id,client_name,client_identification,client_email,client_direction,content}){

    const template=`
        <div data-id="${id}" class="CardClient">
            <span><strong>${client_name}</strong></span>
            <span>${client_identification}</span>
            <span>${client_email}</span>
            <span>${client_direction}</span>
            <button data-id="${id}" class="CardClient__button">Ver</button>
        </div>
    `;

    content.insertAdjacentHTML('beforeend',template);
}