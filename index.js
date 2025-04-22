import CardProductSelect from "./app/components/CardProductSelect/CardProductSelect.js";
import loader from "./app/components/Loader/Loader.js";
import Push from "./app/components/Push/Push.js";
import useCreateItemcart from "./app/hooks/useCreateItemcart.js";
import useDeleteCartItem from "./app/hooks/useDeleteCartItem.js";
import useGetClients from "./app/hooks/useGetClients.js";
import useGetOrders from "./app/hooks/useGetOrders.js";
import useGetProducts from "./app/hooks/useGetProducts.js";
import useSearchProduct from "./app/hooks/useSearchProduct.js";
import useUpdateCart from "./app/hooks/useUpdateCart.js";
import useUpdateTotal from "./app/hooks/useUpdateTotal.js";
import Router from "./app/router.js";

document.addEventListener('DOMContentLoaded',async (e)=>{
    const body=document.getElementById('body');
    const title=document.getElementById('title');
    const app=document.getElementById('app');

    await Router({
        title,
        body,
        app
    });

});

document.addEventListener('click',async (e)=>{
    if(e.target.matches('.btn-drop')){
        if(e.target.nextElementSibling.matches('.CardDrop__contentSearch--active')){
            e.target.nextElementSibling.classList.remove('CardDrop__contentSearch--active');
        }else{
            e.target.nextElementSibling.classList.add('CardDrop__contentSearch--active');
        }
    }
    
    if(e.target.matches('.CardDrop__item')){
        const context=e.target.dataset.context;
        e.target.parentElement.parentElement.classList.remove('CardDrop__contentSearch--active');
        
        if(context==='products'){   //  Para agregar productos
            const name_product=e.target.parentElement.parentElement.parentElement.children[0];
            const size_product=document.getElementById('new-item-size');
            const price_product=document.getElementById('new-item-price');
            const dscto_product=document.getElementById('new-item-dscto');
            const iva_product=document.getElementById('new-item-iva');

            name_product.textContent=e.target.dataset.name;
            size_product.value=1;
            size_product.dataset.name=e.target.dataset.name;
            size_product.dataset.id=e.target.dataset.id;
            size_product.dataset.order=e.target.dataset.order;
            price_product.value=e.target.dataset.price;
            dscto_product.value=0;

        }else{  //  Para elegir el cliente
            const name_client=document.getElementById('name-client');
            const identification_client=document.getElementById('identification-client');
            const email_client=document.getElementById('email-client');
            const phone_client=document.getElementById('phone-client');
            const direction_client=document.getElementById('direction-client');
            const content_client=document.getElementById('content-dates-client');

            name_client.value=e.target.dataset.name;
            identification_client.value=e.target.dataset.identification;
            email_client.value=e.target.dataset.email;
            phone_client.value=e.target.dataset.phone;
            direction_client.value=e.target.dataset.direction;
            
            content_client.classList.add('CardPay__client--active');
        }
    }

    if(e.target.matches('#add-item-commander')){
        const size_product=document.getElementById('new-item-size');
        const price_product=document.getElementById('new-item-price');
        const dscto_product=document.getElementById('new-item-dscto');
        const iva_product=document.getElementById('new-item-iva');
        const content_details=document.getElementById('content-items');

        const data_new_item={
            "item_id":Number(size_product.dataset.id),
            "quantity":Number(size_product.value),
            "order_id":size_product.dataset.order,
            "notes":""
        };

        loader();

        const create=await useCreateItemcart({
            data:data_new_item
        });

        if(create.status===200){

            const producto=create.data;

            content_details.insertAdjacentHTML('afterbegin',`
                <div class="CardPay__listItem">
                    <label>
                        <input 
                        data-codigo="${producto.item_id}" 
                        data-id="${producto.id}" 
                        data-descuento="0" 
                        data-name="${producto.name}" 
                        data-description="${producto.description}" 
                        data-price="${producto.price}" 
                        data-quantity="${producto.quantity}" 
                        type="checkbox" 
                        class="check-item"
                        checked>
                        <label>${producto.name}</label>
                    </label>

                    <label>${producto.quantity}</label>

                    <input 
                        type="number"
                        class="product-price" 
                        value="${producto.price}"
                    >
                    <input type="number" class="product-price" value="0.00">
                    <input type="number" class="product-price" value="0.00">
                    <label>${Number(producto.quantity)*Number(producto.price)}</label>
                    <div>
                        ${(producto.quantity>1) 
                            ? 
                                `<button 
                                    class="product-desgloce" 
                                    data-codigo="${producto.item_id}" 
                                    data-id="${producto.id}" 
                                    data-descuento="0" 
                                    data-name="${producto.name}" 
                                    data-description="${producto.description}" 
                                    data-price="${producto.price}" 
                                    data-quantity="${producto.quantity}
                                ">Desglozar</button>` 
                            :   ""}
                        <button data-codigo="${producto.item_id}" data-id="${producto.id}" class="product-delete">Quitar</button>
                    </div>
                </div>
            `);
            
            Push({
                text:'Producto agregado.'
            });

            document.getElementById('new-item-size').value=1;
            document.getElementById('new-item-price').value=0;
            
        }else{
            Push({
                text:'No se pudo agregar el producto'
            });
        }

        document.getElementById('body').removeChild(document.getElementById('loader'));
    }

    // Delegación de evento para aumentar cantidad de un producto
    if(e.target.matches('.Cart__itemMore')){
        const input=e.target.previousElementSibling;
        const val_total=e.target.parentElement.parentElement.nextElementSibling;

        let new_value=Number(input.value)+1;
        input.value=new_value;

        val_total.textContent=`$ ${Number(new_value*e.target.dataset.price).toFixed(2)}`;
        useUpdateTotal();
        useUpdateCart();
    }

    // Delegación de evento para disminuir cantidad de un producto
    if(e.target.matches('.Cart__itemMinus')){
        const input=e.target.nextElementSibling;
        const val_total=e.target.parentElement.parentElement.nextElementSibling;

        if(input.value>1){
            let new_value=Number(input.value)-1;
            input.value=new_value;
            val_total.textContent=`$ ${Number(new_value*e.target.dataset.price).toFixed(2)}`;
            useUpdateTotal();
            useUpdateCart();
        }else{
            Push({
                text:'Elimina el producto.'
            });
        }
    }

    // Delegación de evento para eliminar un producto
    if(e.target.matches('.remove-to-commander')){
        const id=e.target.dataset.id;
        useDeleteCartItem({id});
        useUpdateTotal();
    }

});

document.addEventListener('keyup',async (e)=>{
    //  Para ocupar los DropDown de búsqueda de clientes y productos
    if(e.target.matches('.drop-search')){
        const context=e.target.dataset.context;
        let results=[],icon="";

        if(e.target.value!=="" & e.target.value.length>3){
            if(context==='products'){
                useGetClients
                results=await useSearchProduct({
                    contributor_id:localStorage.getItem('cc'),
                    name:e.target.value
                });

                icon=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.984 10C21.947 8.689 21.823 7.853 21.403 7.14C20.805 6.125 19.729 5.56 17.578 4.432L15.578 3.382C13.822 2.461 12.944 2 12 2C11.056 2 10.178 2.46 8.422 3.382L6.422 4.432C4.271 5.56 3.195 6.125 2.597 7.14C2 8.154 2 9.417 2 11.942V12.059C2 14.583 2 15.846 2.597 16.86C3.195 17.875 4.271 18.44 6.422 19.569L8.422 20.618C10.178 21.539 11.056 22 12 22C12.944 22 13.822 21.54 15.578 20.618L17.578 19.568C19.729 18.439 20.805 17.875 21.403 16.86C21.823 16.147 21.947 15.311 21.984 14M21 7.5L17 9.5M17 9.5L16.5 9.75L12 12M17 9.5V13M17 9.5L7.5 4.5M12 12L3 7.5M12 12V21.5" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>`;

            }else{
                results=await useGetClients({
                    contributor_id:localStorage.getItem('cc'),
                    filters:`identification=${e.target.value}`
                });

                icon=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C11.0111 2 10.0444 2.29324 9.22215 2.84265C8.3999 3.39206 7.75904 4.17295 7.3806 5.08658C7.00216 6.00021 6.90315 7.00555 7.09607 7.97545C7.289 8.94536 7.7652 9.83627 8.46447 10.5355C9.16373 11.2348 10.0546 11.711 11.0245 11.9039C11.9945 12.0969 12.9998 11.9978 13.9134 11.6194C14.827 11.241 15.6079 10.6001 16.1573 9.77785C16.7068 8.95561 17 7.98891 17 7C17 5.67392 16.4732 4.40215 15.5355 3.46447C14.5979 2.52678 13.3261 2 12 2ZM12 10C11.4067 10 10.8266 9.82405 10.3333 9.49441C9.83994 9.16476 9.45542 8.69623 9.22836 8.14805C9.0013 7.59987 8.94189 6.99667 9.05764 6.41473C9.1734 5.83279 9.45912 5.29824 9.87868 4.87868C10.2982 4.45912 10.8328 4.1734 11.4147 4.05764C11.9967 3.94189 12.5999 4.0013 13.1481 4.22836C13.6962 4.45542 14.1648 4.83994 14.4944 5.33329C14.8241 5.82664 15 6.40666 15 7C15 7.79565 14.6839 8.55871 14.1213 9.12132C13.5587 9.68393 12.7956 10 12 10ZM21 21V20C21 18.1435 20.2625 16.363 18.9497 15.0503C17.637 13.7375 15.8565 13 14 13H10C8.14348 13 6.36301 13.7375 5.05025 15.0503C3.7375 16.363 3 18.1435 3 20V21H5V20C5 18.6739 5.52678 17.4021 6.46447 16.4645C7.40215 15.5268 8.67392 15 10 15H14C15.3261 15 16.5979 15.5268 17.5355 16.4645C18.4732 17.4021 19 18.6739 19 20V21H21Z" fill="black"/>
                    </svg>`;
            }
        }else{
            if(context==='products'){
                useGetClients
                results=await useGetProducts({contributor_id:localStorage.getItem('cc'),filters:""})
    
                icon=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.984 10C21.947 8.689 21.823 7.853 21.403 7.14C20.805 6.125 19.729 5.56 17.578 4.432L15.578 3.382C13.822 2.461 12.944 2 12 2C11.056 2 10.178 2.46 8.422 3.382L6.422 4.432C4.271 5.56 3.195 6.125 2.597 7.14C2 8.154 2 9.417 2 11.942V12.059C2 14.583 2 15.846 2.597 16.86C3.195 17.875 4.271 18.44 6.422 19.569L8.422 20.618C10.178 21.539 11.056 22 12 22C12.944 22 13.822 21.54 15.578 20.618L17.578 19.568C19.729 18.439 20.805 17.875 21.403 16.86C21.823 16.147 21.947 15.311 21.984 14M21 7.5L17 9.5M17 9.5L16.5 9.75L12 12M17 9.5V13M17 9.5L7.5 4.5M12 12L3 7.5M12 12V21.5" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>`;
    
            }else{
                results=await useGetClients({
                    contributor_id:localStorage.getItem('cc'),
                    filters:""
                });
    
                icon=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C11.0111 2 10.0444 2.29324 9.22215 2.84265C8.3999 3.39206 7.75904 4.17295 7.3806 5.08658C7.00216 6.00021 6.90315 7.00555 7.09607 7.97545C7.289 8.94536 7.7652 9.83627 8.46447 10.5355C9.16373 11.2348 10.0546 11.711 11.0245 11.9039C11.9945 12.0969 12.9998 11.9978 13.9134 11.6194C14.827 11.241 15.6079 10.6001 16.1573 9.77785C16.7068 8.95561 17 7.98891 17 7C17 5.67392 16.4732 4.40215 15.5355 3.46447C14.5979 2.52678 13.3261 2 12 2ZM12 10C11.4067 10 10.8266 9.82405 10.3333 9.49441C9.83994 9.16476 9.45542 8.69623 9.22836 8.14805C9.0013 7.59987 8.94189 6.99667 9.05764 6.41473C9.1734 5.83279 9.45912 5.29824 9.87868 4.87868C10.2982 4.45912 10.8328 4.1734 11.4147 4.05764C11.9967 3.94189 12.5999 4.0013 13.1481 4.22836C13.6962 4.45542 14.1648 4.83994 14.4944 5.33329C14.8241 5.82664 15 6.40666 15 7C15 7.79565 14.6839 8.55871 14.1213 9.12132C13.5587 9.68393 12.7956 10 12 10ZM21 21V20C21 18.1435 20.2625 16.363 18.9497 15.0503C17.637 13.7375 15.8565 13 14 13H10C8.14348 13 6.36301 13.7375 5.05025 15.0503C3.7375 16.363 3 18.1435 3 20V21H5V20C5 18.6739 5.52678 17.4021 6.46447 16.4645C7.40215 15.5268 8.67392 15 10 15H14C15.3261 15 16.5979 15.5268 17.5355 16.4645C18.4732 17.4021 19 18.6739 19 20V21H21Z" fill="black"/>
                    </svg>`;
            }
        }

        e.target.parentElement.nextElementSibling.innerHTML="";
            
        results.data.map(item=>{
            e.target.parentElement.nextElementSibling.insertAdjacentHTML('beforeend',`
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
                            `
                        :   
                            `
                                data-name="${item.name}" 
                                data-identification="${item.identification}" 
                                data-email="${item.email}"
                                data-direction="${item.direction}"
                                data-phone="${item.phone}"
                            `
                    }
                    data-context=${context}
                    class="CardDrop__item"
                >
                    <label>
                        ${icon}
                        ${item.name}
                    </label>
                    <label>${('price' in item) ? `$ ${item.price}` : item.identification}</label>
                </button>
            `);
        });
    }

    if(e.target.matches('#search-client-commander')){
        const content=document.getElementById('content-orders');

        let orders_client={
            data:[]
        };

        if(e.target.value.length>2 & e.target.value!==""){
            const client_name=e.target.value;

            content.innerHTML="";

            orders_client=await useGetOrders({
                contributor_id:localStorage.getItem('cc'),
                filters:`client_name=${client_name}&user_id=${localStorage.getItem('ui')}`
            });

        }else if(e.target.value===""){

            content.innerHTML="";
            
            orders_client=await useGetOrders({
                contributor_id:localStorage.getItem('cc'),
                filters:`user_id=${localStorage.getItem('ui')}`
            });
        }

        document.getElementById('category').textContent=`Pendientes de hoy (${orders_client.data.length})`;

        orders_client.data.map(order=>{
            content.insertAdjacentHTML('beforeend',`
                <div class="OrderItem">
                    <h4>${order.client_name}</h4>
                    <p>${order.floor} | ${order.table}</p>
                    <p>${order.create_date}</p>
                    <p># ${order.order_number_day}</p>
                    <button data-id="${order.id}" class="CardOrder__view">Ver</button>
                    <button data-id="${order.id}" class="CardOrder__finish">Finalizar</button>
                </div> 
            `);
        });

    }

    if(e.target.matches('#search-item-commander')){
        const content=document.getElementById('content-items');
        let results={
            data:[]
        }

        if(e.target.value!=="" & e.target.value.length>4){
            results=await useSearchProduct({
                contributor_id:localStorage.getItem('cc'),
                name:e.target.value
            });
        }else{
            results=await useGetProducts({
                contributor_id:localStorage.getItem('cc'),
                filters:`type=${document.getElementById('category').dataset.type}`
            });
        }

        content.innerHTML="";
            
        results.data.map(item=>{
            CardProductSelect({
                id:item.id,
                image:"",
                name:item.name,
                price:item.price,
                content:content
            });
        });
    }

});

window.addEventListener('hashchange',async (e)=>{
    const body=document.getElementById('body');
    const title=document.getElementById('title');
    const app=document.getElementById('app');

    await Router({
        title,
        body,
        app
    });

});