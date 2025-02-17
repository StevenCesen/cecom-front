import CardClient from "../../components/CardClient/CardClient.js";

export default async function Clients({app,data}) {
    const template=`
        <div class="Products">
            <div class="Products__nav">
                <h3>Clientes</h3>
                <input class="Products__search" type="search" placeholder="Nombre del item o código">
            </div>
            
            <span class="Products__subtitle">${data.total} items encontrados</span>

            <div class="Products__list" id="content-list">
                
            </div>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    const content=document.getElementById('content-list');
    
    data.data.map((client)=>{
        CardClient({
            id:client.id,
            client_name:client.name,
            client_identification:client.identification,
            client_email:client.email,
            client_direction:client.direction,
            content
        });
    });

    document.getElementById('body').removeChild(document.getElementById('loader'));
}