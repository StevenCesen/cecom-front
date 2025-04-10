import { COMMERCIAL_TYPE } from "../../hooks/env.js";
import Nav from "../Nav/Nav.js";

export default function Header({body}){
    const template=`
        <header class="Header" id="header">
            <button id="nav" class="Header__menu">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="#00CABD"/>
                </svg>
            </button>
            <h2>${COMMERCIAL_TYPE}</h2>
        </header>
    `;
    
    if(!!document.getElementById('header')){
        body.removeChild(document.getElementById('header'));   
    }

    body.insertAdjacentHTML('afterbegin',template);

    // Nav({body});

    const btn_menu=document.getElementById('nav');

    btn_menu.addEventListener('click',(e)=>{
        document.getElementById('menu').classList.toggle('Nav--active');
    });
}