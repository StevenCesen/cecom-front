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