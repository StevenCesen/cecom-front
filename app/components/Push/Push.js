export default function Push({text}){
    if(!!document.getElementById('push')){
        document.getElementById('body').removeChild(document.getElementById('push'));
    }

    const push=`
                <div class="Push" id="push">
                    <p>${text}.</p>
                </div>
    `;
    document.getElementById('body').insertAdjacentHTML('beforeend',push);

    const PUSH_NOTF=document.getElementById('push');
    PUSH_NOTF.classList.add('push__active');
    
    let deletePush = new Promise((resolve, reject) => {
        setTimeout(function(){
            return resolve(PUSH_NOTF.style.visibility='hidden');
        }, 3000);
    }).then(push=>{
        document.getElementById('body').removeChild(PUSH_NOTF);
    }).catch(err=>console.log(err));
}