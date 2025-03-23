import { COMMERCIAL_TYPE } from "../../hooks/env.js";

export default function Nav({body}){

    let list="";

    if(localStorage.getItem('ur')!==undefined){
        if(localStorage.getItem('ur')==='AP-UA1'){
            list=`
                <div>
                    <a href="#/home">Inicio</a>
                </div>
                <div>
                    <a href="#/reportes">Reportes</a>
                </div>
                <div>
                    <a href="#/ventas">Ventas</a>
                </div>
                <div>
                    <a href="#/clientes">Clientes</a>
                </div>
                <div>
                    <a href="#/menus">Menús</a>
                </div>
                <div>
                    <a href="#/pedidos">Pedidos</a>
                </div>
                
                <div>
                    <a href="#/productos">Productos</a>
                </div>
                <div>
                    <a href="#/configuracion">Configuración</a>
                </div>
                <div>
                    <a href="#/logout">Cerrar sesión</a>
                </div>
            `;
        }else{
            list=`
                <div>
                    <a href="#/pedidos">Pedidos</a>
                </div>
                <div>
                    <a href="#/logout">Cerrar sesión</a>
                </div>
            `;
        }
    }

    const template=`
        <div class="Nav" id="menu">
            <div class="Nav__options">
                ${list}
            </div>
            <div class="Nav__footer">
                <span>${COMMERCIAL_TYPE} © 2025</span>
            </div>
        </div>
    `;

    body.insertAdjacentHTML('beforeend',template);

    document.getElementById('menu').addEventListener('click',(e)=>{
        if(e.target.matches('a')){
            document.getElementById('menu').classList.remove('Nav--active');
        }
    });

}