export default function CardTicket({id,client_name,table,floor,status,date,total,content}){

    let status_order=`
        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 6V12L16 14" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

    if(status==="EN MESA"){
        status_order=`
            <svg width="35" height="35" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1980_627)">
                    <path d="M1.24553 0.847687C0.960595 1.28228 0.890346 1.81612 1.00044 2.43262C1.13169 3.16781 1.52888 3.99631 2.10294 4.77638C3.25113 6.33653 5.1045 7.68519 6.75335 7.88966L6.8686 7.90434L6.94281 7.99322L13.0102 15.3174C13.6149 15.4619 14.0054 15.372 14.2084 15.1709C14.413 14.9682 14.5073 14.577 14.3558 13.9561L1.2456 0.847656L1.24553 0.847687ZM12.9663 0.919937L9.57566 4.31056C9.20066 4.6855 9.19741 5.09806 9.39103 5.54884L9.47113 5.73541L9.32463 5.87603L8.18597 6.96194L9.11078 7.88672L10.1918 6.74509L10.3325 6.59666L10.519 6.67772C10.9929 6.88194 11.4423 6.87356 11.7905 6.52537L15.1811 3.13475L14.7407 2.69431L12.5356 4.89844L12.1235 4.48541L14.3275 2.28134L13.8578 1.8115L11.6538 4.01562L11.2407 3.60256L13.4447 1.3985L12.9663 0.919937ZM6.59022 8.48441L0.796283 14.0127C0.653314 14.6049 0.744908 14.9748 0.937908 15.166C1.13097 15.3572 1.50441 15.445 2.08928 15.3037L7.50241 9.58597L6.59022 8.48441Z" fill="black"/>
                </g>
                <defs>
                    <clipPath id="clip0_1980_627">
                    <rect width="16" height="16" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
        `;
    }

    const template=`
        <div data-id="${id}" class="CardOrder">
            <div>
                ${status_order}
            </div>
            <div>
                <span>${client_name}</span>
                <span>Fecha inicio: ${table} - Fecha fin: ${floor}</span>
            </div>
            <span>${date}</span>
            <span><strong>${total}</strong></span>
            <span>${status}</span>
            <a href="#/tickets/${id}" data-id="${id}" class="CardOrder__button">Ver</button>
        </div>
    `;

    content.insertAdjacentHTML('beforeend',template);
}