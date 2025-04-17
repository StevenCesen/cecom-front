import Header from "./components/Header/Header.js";
import loader from "./components/Loader/Loader.js";
import Nav from "./components/Nav/Nav.js";
import useGetClients from "./hooks/useGetClients.js";
import useGetContributor from "./hooks/useGetContributor.js";
import useGetProduct from "./hooks/useGetProduct.js";
import useGetProducts from "./hooks/useGetProducts.js";
import useGetVouchers from "./hooks/useGetVouchers.js";
import useSession from "./hooks/useSession.js";
import Clients from "./pages/Clients/Clients.js";
import Commander from "./pages/Commander/Commander.js";
import DetailMenu from "./pages/DetailMenu/DetailMenu.js";
import Home from "./pages/Home/Home.js";
import Item from "./pages/Item/Item.js";
import Login from "./pages/Login/Login.js";
import Menus from "./pages/Menu/Menu.js";
import Orders from "./pages/Orders/Orders.js";
import Product from "./pages/Product/Product.js";
import Products from "./pages/Products/Products.js";
import Reporte from "./pages/Reporte/Reporte.js";
import Setting from "./pages/Setting/Setting.js";
import Ticket from "./pages/Ticket/Ticket.js";
import Tickets from "./pages/Tickets/Tickets.js";
import TicketView from "./pages/TicketView/TicketView.js";
import Tracking from "./pages/Tracking/Tracking.js";
import Vouchers from "./pages/Vouchers/Vouchers.js";

export default async function Router({title,body,app}){
    const hash=location.hash;
    Header({body});

    app.innerHTML="";

    if((hash==='' | hash==='#/' | hash==='#/login') & useSession()===false){
        title.textContent="Inicio de sesión";

        Login({app});

    }else if(hash==='#/home' & useSession()){
        
        title.textContent="Inicio";
        Nav({body});
        Home({contributor_id:localStorage.getItem('cc'),app});

    }else if(hash==='#/ventas' & useSession()){

        title.textContent="Ventas";
        loader();
        Nav({body});

        const data=await useGetVouchers({
            contributor_id:localStorage.getItem('cc')
        });

        await Vouchers({app,data});
        
    }else if(hash==='#/clientes' & useSession()){
        title.textContent="Clientes";

        loader();
        Nav({body});

        const data=await useGetClients({
            contributor_id:localStorage.getItem('cc'),
            filters:""
        });

        await Clients({app,data});

    }else if(hash==='#/productos' & useSession()){

        title.textContent="Productos";
        loader();

        Nav({body});

        const data=await useGetProducts({
            contributor_id:localStorage.getItem('cc'),
            filters:""
        });
        await Products({app,data});

    }else if(hash==='#/pedidos' & useSession()){
        
        title.textContent="Pedidos";
        loader();
        Nav({body});
        
        /** 
         * ADMINISTRADOR: AP-UA1
         * MESERO:        AP-UM2
        */

        if(localStorage.getItem('ur')==='AP-UA1'){
            Orders({app});
        }else if(localStorage.getItem('ur')==='AP-UM2'){
            Commander({app});
        }
    }else if(hash==="#/tickets" & useSession()){

        title.textContent="Tickets";
        loader();
        Nav({body});
        Tickets({app});

    }else if(hash==="#/tracking" & useSession()){
        
        title.textContent="Seguimiento de envíos";
        // loader();
        Nav({body});
        Tracking({app});

    }else if(hash.split('/')[1]==="tickets" & useSession()){

        title.textContent="Ticket";
        const id=hash.split('/')[2];
        loader();
        Nav({body});

        if(id==="view"){
            await TicketView({
                id:hash.split('/')[3],
                app
            });
        }else{
            await Ticket({id,app});
        }        

    }else if(hash.split('/')[1]==="menus" & useSession()){

        title.textContent="Menús";
        const id=hash.split('/')[2];
        Nav({body});

        if(id===undefined){
            Menus({contributor_id:localStorage.getItem('cc'),app});
        }else{
            DetailMenu({id,app});
        }

    }else if(hash.split('/')[1]==="items" & useSession()){
        title.textContent="Item seleccionado";
        
        loader();
        Nav({body});

        const id=hash.split('/')[2];
        const data_product=await useGetProduct({id});

        Item({
            id:data_product.id,
            name:data_product.name,
            price:data_product.price,
            app
        });

    }else if(hash.split('/')[1]==="item" & useSession()){
        title.textContent="Item seleccionado";

        const id=hash.split('/')[2];
        Nav({body});

        Product({
            id,
            app
        });

    }else if(hash==='#/reportes' & useSession()){
        
        title.textContent="Balance";
        Nav({body});
        Reporte({app});

    }else if(hash==='#/usuarios' & useSession()){

        title.textContent="Usuarios";
        Nav({body});
        //  Faltaaaaa hacer

    }else if(hash==='#/configuracion' & useSession()){

        title.textContent="Configuración";
        Nav({body});
        loader();
        const data_contributor=await useGetContributor({
            contributor_id:localStorage.getItem('cc')
        });
        Setting({app,data_contributor});

    }else if(hash==='#/logout'){
        localStorage.removeItem('tk');
        localStorage.removeItem('cc');
        localStorage.removeItem('cname');
        localStorage.removeItem('tmail');
        localStorage.removeItem('ui');   
        localStorage.removeItem('ur');
        location.hash="#/";

        document.getElementById('body').removeChild(document.getElementById('menu'));

    }else{
        Nav({body});
        location.hash="#/";
    }
}