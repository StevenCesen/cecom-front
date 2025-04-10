import Nav from "../components/Nav/Nav.js";
import Push from "../components/Push/Push.js";
import { URL_BASE } from "./env.js";
import useSaveSession from "./useSaveSession.js";

export default async function useLogin({username,password}) {
    if(username!==""){
        if(password!==""){
            
            const request=await fetch(`${URL_BASE}login`,{
                method:'POST',
                headers: {
                    Accept: 'application/json'
                },
                body:new URLSearchParams({
                    email:username,
                    password:password
                })
            });
            
            if(request.status===401){
                Push({
                    text: 'El usuario y la contrasela no coinciden. Inténtalo de nuevo.'
                });
            }else{
                const response=await request.json();

                useSaveSession({
                    data:response
                });
                
                if(localStorage.getItem('ur')==='AP-UA1'){
                    location.hash='#/home';
                }else{
                    location.hash='#/pedidos';
                }

                Nav({
                    body:document.getElementById('body')
                });
            }

        }else{
            Push({
                text:'Por favor, ingrese la contraseña.'
            });
        }
    }else{
        Push({
            text:'Por favor, ingrese un usuario.'
        });
    }

    document.getElementById('body').removeChild(document.getElementById('loader'));
}