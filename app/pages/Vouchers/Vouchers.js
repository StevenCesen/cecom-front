import CardDetailVoucher from "../../components/CardDetailVoucher/CardDetailVoucher.js";
import CardModal from "../../components/CardModal/CardModal.js";
import CardVoucher from "../../components/CardVoucher/CardVoucher.js";
import Cart from "../../components/Cart/Cart.js";
import loader from "../../components/Loader/Loader.js";
import useGetVoucher from "../../hooks/useGetVoucher.js";

export default async function Vouchers({app,data}) {

    console.log(data);

    const template=`
        <div class="Vouchers">
            <div class="Vouchers__nav">
                <h3>Ventas</h3>
                <div class="Vouchers__actions">
                    <input class="Vouchers__search" type="search" placeholder="Nombre del cliente o cédula">
                    <div>
                        <button class="Vouchers__btnIni"></button>
                        <button class="Vouchers__btnPrev"></button>
                        <label class="Vouchers__page">1</label>
                        <button class="Vouchers__btnNext"></button>
                        <button class="Vouchers__btnEnd"></button>
                    </div>
                </div>
            </div>
            
            <span class="Vouchers__subtitle">${data.total} items encontrados</span>

            <div class="Vouchers__list" id="content-list">
                
            </div>

            <button class="Orders__button" id="new-commander">
                <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.49671 18.0003C7.89454 18.0003 8.27607 18.1584 8.55737 18.4397C8.83868 18.721 8.99671 19.1025 8.99671 19.5003C8.99671 19.8982 8.83868 20.2797 8.55737 20.561C8.27607 20.8423 7.89454 21.0003 7.49671 21.0003C7.09889 21.0003 6.71736 20.8423 6.43605 20.561C6.15475 20.2797 5.99671 19.8982 5.99671 19.5003C5.99671 19.1025 6.15475 18.721 6.43605 18.4397C6.71736 18.1584 7.09889 18.0003 7.49671 18.0003ZM16.4967 18.0003C16.8945 18.0003 17.2761 18.1584 17.5574 18.4397C17.8387 18.721 17.9967 19.1025 17.9967 19.5003C17.9967 19.8982 17.8387 20.2797 17.5574 20.561C17.2761 20.8423 16.8945 21.0003 16.4967 21.0003C16.0989 21.0003 15.7174 20.8423 15.4361 20.561C15.1547 20.2797 14.9967 19.8982 14.9967 19.5003C14.9967 19.1025 15.1547 18.721 15.4361 18.4397C15.7174 18.1584 16.0989 18.0003 16.4967 18.0003ZM2.08071 2.75134C2.14665 2.56372 2.2844 2.40997 2.46367 2.32389C2.64295 2.23782 2.84907 2.22647 3.03671 2.29234L3.33871 2.39834C3.95471 2.61534 4.47871 2.79934 4.89071 3.00134C5.33071 3.21834 5.70971 3.48434 5.99371 3.90034C6.27571 4.31234 6.39171 4.76534 6.44571 5.26234C6.46905 5.48434 6.48338 5.73034 6.48871 6.00034H8.14671L9.80171 15.3773C7.77671 15.3593 6.66171 15.2423 5.92571 14.4673C5.05971 13.5513 4.99671 12.5813 4.99671 9.64034V7.03834C4.99671 6.29834 4.99671 5.80334 4.95571 5.42334C4.91571 5.06034 4.84571 4.87834 4.75571 4.74634C4.66771 4.61734 4.53471 4.49634 4.23071 4.34834C3.90871 4.19034 3.46971 4.03434 2.80171 3.79934L2.54071 3.70834C2.4477 3.6757 2.36203 3.62504 2.28861 3.55926C2.21519 3.49348 2.15545 3.41387 2.11282 3.32499C2.07019 3.23611 2.0455 3.13969 2.04016 3.04126C2.03483 2.94283 2.04794 2.84431 2.08071 2.75134ZM11.3257 15.3803H14.1677L15.8237 6.00034H9.66971L11.3257 15.3803ZM17.3467 6.00034C18.9427 6.00134 20.3487 6.02534 20.7727 6.57734C21.2167 7.15434 21.0427 8.02434 20.6967 9.76334L20.1967 12.1883C19.8817 13.7163 19.7237 14.4813 19.1717 14.9303C18.6207 15.3803 17.8397 15.3803 16.2787 15.3803H15.6907L17.3467 6.00034Z" fill="white"/>
                </svg>
            </button>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);

    const content=document.getElementById('content-list');
    const btn_new_command=document.getElementById('new-commander');

    data.data.map((voucher)=>{
        CardVoucher({
            id:voucher.id,
            client_name:voucher.client.name,
            client_ci:voucher.client.identification,
            pay_type:"",
            date:voucher.create_date,
            total:voucher.total_amount,
            status:voucher.status,
            content:content
        });
    });

    btn_new_command.addEventListener('click',(e)=>{
        CardModal({
            template:Cart({mode:'with-search'}),
            content:document.getElementById('body')
        });
    });

    content.addEventListener('click',async (e)=>{
        if(e.target.matches('.CardVoucher__button')){
            loader();
            const voucher=await useGetVoucher({id:e.target.dataset.id});
    
            CardDetailVoucher({
                id:voucher.id,
                client:voucher.client,
                contributor:voucher.contributor_identification,
                ride_path:voucher.ride_path,
                xml_path:voucher.xml_path,
                total:voucher.total_amount,
                access_key:voucher.access_key,
                date:voucher.create_date,
                sequential:voucher.sequential,
                app
            });
        }
    });

    document.getElementById('body').removeChild(document.getElementById('loader'));

}