export default function loader(){
    const template=`
        <div id="loader" class="loader__content">
            <div class="loader"></div>
        </div>
    `;
    document.getElementById('body').insertAdjacentHTML('beforeend',template);
}