import loader from "../../components/Loader/Loader.js";
import useLogin from "../../hooks/useLogin.js";

export default async function Login({app}) {
    const template=`
        <div class="Login">
            <div class="Login__logo">
            </div>
            <form class="Login__form">
                <h2>Inicio de sesión</h2>
                <label class="Login__attribute">
                    Usuario:
                    <input type="text" placeholder="Usuario" id="username" required>
                </label>
                <label class="Login__attribute">
                    Contraseña:
                    <input type="password" placeholder="Contraseña" id="password" required>
                </label>
                <button class="Login__button" id="login" type="submit">Iniciar sesión</button>
            </form>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    const username=document.getElementById('username');
    const password=document.getElementById('password');
    const btn_login=document.getElementById('login');

    btn_login.addEventListener('click',async e=>{
        e.preventDefault();
        loader();
        await useLogin({
            username:username.value,
            password:password.value
        });
    }); 
}