import { URL_BASE } from "../../hooks/env.js";
import useCreateMenu from "../../hooks/useCreateMenu.js";
import useCreateOrder from "../../hooks/useCreateOrder.js";
import useDeleteCartItem from "../../hooks/useDeleteCartItem.js";
import useGenerate from "../../hooks/useGenerate.js";
import useGetContributor from "../../hooks/useGetContributor.js";
import useGetTypeIdentification from "../../hooks/useGetTypeIdentification.js";
import useRound from "../../hooks/useRound.js";
import useSearchProduct from "../../hooks/useSearchProduct.js";
import useUpdateCart from "../../hooks/useUpdateCart.js";
import useUpdateTotal from "../../hooks/useUpdateTotal.js";
import CartItemMenu from "../CardItemMenu/CardItemMenu.js";
import CartItem from "../CartItem/CartItem.js";
import loader from "../Loader/Loader.js";
import Push from "../Push/Push.js";

export default function CardModal({template,content}){
    const temp=`
        <div class="CardModal" id="modal">
            <button id="btn-close-modal">Volver</button>
            <div class="CardModal__content" id="modal-content">

            </div>
        </div>
    `;

    content.insertAdjacentHTML('beforeend',temp);

    const btn_close_modal=document.getElementById('btn-close-modal');
    const content_modal=document.getElementById('modal-content');
    const modal=document.getElementById('modal');

    content_modal.insertAdjacentHTML('beforeend',template);

    // Aquí ya se renderizan los elementos del template
    if(!!document.getElementById('save-product')){
        const btn_save_product=document.getElementById('save-product');
        btn_save_product.addEventListener('click',async (e)=>{

            loader();

            const name_product=document.getElementById('name-product').value;
            const image_product=document.getElementById('image-product');
            const description_product=document.getElementById('description-product').value;
            const size_product=document.getElementById('size-product').value;
            const price_product=document.getElementById('price-product').value;
            const barras=document.getElementById('render-barras');
            const code_product=document.getElementById('code-product').value;
            const category_product=document.getElementById('category-product').value;
            const new_category=document.getElementById('new-category').value;
            const tax_product=document.getElementById('tax-product').value;
            const state_product=document.getElementById('state-product').value;

            //  Validamos los datos
            if(
                name_product!=="" &
                description_product!=="" &
                size_product!=="" &
                price_product!=="" &
                (category_product!=="" | new_category!=="") &
                tax_product!=="" &
                state_product!==""
            ){  
                const data={
                    'name':name_product,
                    'code_aux':code_product,
                    'quantity':size_product,
                    'tax':tax_product,
                    'description':description_product,
                    'image_path':"",
                    'price':price_product,
                    'state':state_product,
                    'contributor_id':localStorage.getItem('cc'),
                    'type_id':category_product
                };
                
                //  Comprobamos si se ingreso una nueva categoría
                if(new_category!==""){
                    const request=await fetch(`${URL_BASE}types`,{
                        method:'POST',
                        headers: {
                            Accept: 'application/json'
                        },
                        body:new URLSearchParams({
                            name:new_category,
                            contributor_id:localStorage.getItem('cc')
                        })
                    });
                
                    const response=await request.json();
                    
                    data.type_id=response.data.id;
                }

                //  Creamos el producto
                const request_product=await fetch(`${URL_BASE}products`,{
                    method:'POST',
                    headers: {
                        Accept: 'application/json'
                    },
                    body:new URLSearchParams(data)
                });
            
                const response_product=await request_product.json();
                if(response_product.status===200){
                    Push({
                        text: 'Producto agregado correctamente.'
                    });
                }else{
                    Push({
                        text: 'Algo salió mal, inténtalo de nuevo.'
                    });
                }
            }else{
                Push({
                    text: 'Por favor, llene los datos del producto.'
                });
            }
            document.getElementById('body').removeChild(document.getElementById('loader'));
        });
    }else if(!!document.getElementById('generate-invoice')){
        const search_product=document.getElementById('search-product');
        const content_list_products=document.getElementById('content-list-products');
        const content_list=document.getElementById('cart-list');

        search_product.addEventListener('change',async (e)=>{
            if(e.target.value!==""){
                const results=await useSearchProduct({
                    contributor_id:localStorage.getItem('cc'),
                    name:e.target.value
                });

                content_list_products.innerHTML="";
                
                results.data.map(item=>{
                    content_list_products.insertAdjacentHTML('beforeend',`
                        <button 
                            data-id="${item.id}"
                            data-name="${item.name}"
                            data-price="${item.price}"  
                            data-description="${item.description}" 
                            data-descuento="${0}"
                            data-subtotal="${0}"  
                            data-tax="${0}"
                            class="Cart__resultItem"
                        >${item.name}</button>
                    `);
                });
            }else{
                content_list_products.innerHTML="";
            }
        });

        content_list_products.addEventListener('click',(e)=>{
            // Delegación de evento para agregar un producto al listado
            if(e.target.matches('.Cart__resultItem')){
                CartItem({
                    id:e.target.dataset.id,
                    name:e.target.dataset.name,
                    description:e.target.dataset.description,
                    price:e.target.dataset.price,
                    content:content_list
                });

                content_list_products.innerHTML="";
                useUpdateTotal();
            }
        });

        content_list.addEventListener('click',(e)=>{
            // Delegación de evento para aumentar cantidad de un producto
            if(e.target.matches('.Cart__itemMore')){
                const input=e.target.previousElementSibling;
                const val_total=e.target.parentElement.parentElement.nextElementSibling;

                let new_value=Number(input.value)+1;
                input.value=new_value;
                val_total.textContent=`$ ${Number(new_value*e.target.dataset.price)}`;
                useUpdateTotal();
            }

            // Delegación de evento para disminuir cantidad de un producto
            if(e.target.matches('.Cart__itemMinus')){
                const input=e.target.nextElementSibling;
                const val_total=e.target.parentElement.parentElement.nextElementSibling;

                if(input.value>1){
                    let new_value=Number(input.value)-1;
                    input.value=new_value;
                    val_total.textContent=`$ ${Number(new_value)*Number(e.target.dataset.price)}`;
                    useUpdateTotal();
                }else{
                    Push({
                        text:'Elimina el producto.'
                    });
                }
            }

            // Delegación de evento para eliminar un producto
            
        });

        //  Para generar la factura
        const btn_confirm_voucher=document.getElementById('generate-invoice');

        btn_confirm_voucher.addEventListener('click',async (e)=>{
            
            loader();
            
            const data_contributor   =   await useGetContributor({contributor_id:localStorage.getItem('cc')});

            const contributor   =data_contributor.contributor;
            contributor.cert=data_contributor.cert;
            
            if(contributor.cert!==""){
                const info_estab    =   {
                    estab:data_contributor.establishment.nro_estab,   //    Numeración del establecimiento
                    pto_emi:"001", //    Numeración del punto de emisión
                    nro:data_contributor.establishment.nro_invoices      //    Secuencial del documento a generar (Número de factura)
                };

                const info_doc      =   {
                    type:'01',
                };

                const date          =   document.getElementById('date').value;

                const client        =   {
                    identification_type:(document.getElementById('identification-client').value!=="") ? useGetTypeIdentification({identification:document.getElementById('identification-client').value}) : "",  
                    name:document.getElementById('name-client').value,
                    identification:document.getElementById('identification-client').value,
                    email:document.getElementById('email-client').value,
                    phone:document.getElementById('phone-client').value,
                    dir:document.getElementById('direction-client').value
                };

                const detail        =   [];

                const btn           =   e.target;

                //  Llenamos el listado de productos
                let items=document.getElementsByClassName('Cart__itemITEM');
                items=[].slice.call(items);

                let subtotal=0,iva=0,total=0;

                items.map(item=>{
                    let pre_total=Number(item.dataset.price)/1.15;
                    let sub_total=pre_total*Number(item.value);
                    let tax_total=sub_total*0.15;
                    let i_total=Number(item.dataset.price)*Number(item.value)

                    detail.push({
                        id:item.dataset.id,
                        name:item.dataset.name,
                        description:item.dataset.description,
                        quantity:item.value,
                        price:useRound({value:pre_total}),
                        descuento:item.dataset.descuento,
                        subtotal:useRound({value:sub_total}),
                        tax:useRound({value:tax_total}),
                    });

                    total+=Number(i_total);
                    subtotal+=Number(sub_total);
                    iva+=Number(tax_total);
                });

                const info_pay      =   {
                    pay_way:document.getElementById('pay-way').value,
                    subtotal:useRound({value:subtotal}),
                    descuento:0,
                    tax:useRound({value:iva}),
                    total:useRound({value:total})
                };

                //  Validamos los datos ingresados
            
                if(
                    client.identification_type!=="" & 
                    client.name!=="" & 
                    (client.identification!=="" & client.identification.length>=10) & 
                    client.email!=="" & 
                    client.phone!=="" & 
                    client.dir!=="" &
                    date!==""
                ){ //    Válidamos que estén todos los datos del cliente
    
                    if(detail.length>0){   //  Validamos que existen productos
    
                        if(
                            info_pay.pay_way!=="" 
                        ){   //  Validamos la información del pago
    
                            /**
                             * ====================> Enviamos a facturar
                             */
    
                            console.log(detail)
                            console.log(info_pay)
    
                            const voucher=await useGenerate({
                                contributor,
                                info_estab,
                                info_doc,
                                date,
                                client,
                                detail,
                                info_pay,
                                btn
                            });
    
                            console.log(voucher);
    
                        }else{
                            Push({
                                text:'Por favor, ingrese la forma de pago.'
                            });
                        }
    
                    }else{
                        Push({
                            text:'Por favor, agregue productos.'
                        });
                    }
    
                }else{
                    Push({
                        text:'Por favor, revise o ingrese todos los datos correctos del cliente.'
                    });
                    document.getElementById('body').removeChild(document.getElementById('loader'));
                }
            }else{
                Push({
                    text:'Por favor, agregue su firma digital.'
                });
                document.getElementById('body').removeChild(document.getElementById('loader'));
            }
        });

    }else if(!!document.getElementById('new-menu')){
        const search=document.getElementById('search-product');
        const content_result=document.getElementById('content-list-products');
        const content_item=document.getElementById('content-items-menu');
        const btn_save_menu=document.getElementById('save-menu');

        search.addEventListener('change',async (e)=>{
            if(e.target.value!==""){
                const results=await useSearchProduct({
                    contributor_id:localStorage.getItem('cc'),
                    name:e.target.value
                });

                content_result.innerHTML="";
                
                results.data.map(item=>{
                    content_result.insertAdjacentHTML('beforeend',`
                        <button 
                            data-id="${item.id}"
                            data-name="${item.name}"
                            data-price="${item.price}"  
                            data-description="${item.description}" 
                            data-descuento="${0}"
                            data-subtotal="${0}"  
                            data-tax="${0}"
                            class="Cart__resultItem"
                        >${item.name}</button>
                    `);
                });
            }else{
                content_result.innerHTML="";
            }
        });

        content_result.addEventListener('click',(e)=>{
            if(e.target.matches('.Cart__resultItem')){
                CartItemMenu({
                    id:e.target.dataset.id,
                    name:e.target.dataset.name,
                    quantity:1,
                    description:e.target.dataset.description,
                    price:e.target.dataset.price,
                    content:content_item
                });

                content_result.innerHTML="";
            }
        });

        content_item.addEventListener('click',(e)=>{
            // Delegación de evento para aumentar cantidad de un producto
            if(e.target.matches('.CardItemMenu__itemMore')){
                const input=e.target.previousElementSibling;
                const val_total=e.target.parentElement.parentElement.nextElementSibling;

                let new_value=Number(input.value)+1;
                input.value=new_value;
                val_total.textContent=`$ ${Number(new_value*e.target.dataset.price)}`;
            }

            // Delegación de evento para disminuir cantidad de un producto
            if(e.target.matches('.CardItemMenu__itemMinus')){
                const input=e.target.nextElementSibling;
                const val_total=e.target.parentElement.parentElement.nextElementSibling;

                if(input.value>1){
                    let new_value=Number(input.value)-1;
                    input.value=new_value;
                    val_total.textContent=`$ ${Number(new_value)*Number(e.target.dataset.price)}`;
                }else{
                    Push({
                        text:'Elimina el producto'
                    });
                }
            }
        });

        btn_save_menu.addEventListener('click',async (e)=>{
            const name=document.getElementById('name-menu');
            let products=document.getElementsByClassName('CardItemMenu');
            products=[].slice.call(products);
            
            let listado=[];

            products.map((product)=>{
                listado.push({
                    id:product.dataset.id,
                    price:product.children[2].value,
                    price_original:product.dataset.price,
                    quantity:product.children[1].children[1].children[1].value
                });
            });

            console.log(listado)

            if(name.value===""){
                Push({
                    text:'Por favor, introduzca un nombre para el menú'
                });
            }else if(listado.length==0){
                Push({
                    text:'Por favor, agregue productos al menú'
                });
            }else{
                const create=await useCreateMenu({
                    data:{
                        name:name.value,
                        productos:JSON.stringify(listado),
                        contributor_id:localStorage.getItem('cc'),
                        status:document.getElementById('state-menu').value
                    }
                });
                
                console.log(create)
            }
        });
    }else if(!!document.getElementById('generate-commander')){
        const content_list=document.getElementById('cart-list');
        const btn_generate_command=document.getElementById('generate-commander');

        content_list.addEventListener('click',(e)=>{
            // Delegación de evento para aumentar cantidad de un producto
            if(e.target.matches('.Cart__itemMore')){
                const input=e.target.previousElementSibling;
                const val_total=e.target.parentElement.parentElement.nextElementSibling;

                let new_value=Number(input.value)+1;
                input.value=new_value;
                val_total.textContent=`$ ${Number(new_value*e.target.dataset.price)}`;
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
                    val_total.textContent=`$ ${Number(new_value)*Number(e.target.dataset.price)}`;
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

        btn_generate_command.addEventListener('click',async (e)=>{
            const client_name=document.getElementById('client_name');
            const client_piso=document.getElementById('client_piso');
            const client_mesa=document.getElementById('client_mesa');
            let items=[].slice.call(document.getElementsByClassName('Cart__item'));

            if(client_name.value!==""){
                if(items.length>0){
                    loader();
                    let item_list=[];

                    items.map((item)=>{
                        item_list.push({
                            id:item.dataset.id,
                            name:item.dataset.name,
                            price:item.dataset.price,
                            imagen:'',
                            quantity:item.children[1].children[1].children[1].value,
                            notes:''
                        });
                    });

                    const data={
                        client_name:client_name.value,
                        client_piso:client_piso.value,
                        client_mesa:client_mesa.value,
                        items:JSON.stringify(item_list),
                        contributor_id:localStorage.getItem('cc'),
                        user_id:localStorage.getItem('ui')
                    };

                    console.log(data);
                    const response=await useCreateOrder({data});
                    console.log(response);
                    document.getElementById('body').removeChild(document.getElementById('loader'));

                }else{
                    Push({
                        text:'Agregue productos'
                    });
                }
            }else{
                Push({
                    text:'Ingrese el nombre y apellido del cliente'
                });
            }

        });
    }

    btn_close_modal.addEventListener('click',(e)=>{
        content.removeChild(modal);
    });

}