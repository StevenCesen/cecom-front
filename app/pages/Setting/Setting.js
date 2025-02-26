import loader from "../../components/Loader/Loader.js";
import Push from "../../components/Push/Push.js";
import {URL_BASE, URL_ROOT } from "../../hooks/env.js";
import useReadCert from "../../hooks/useReadCert.js";

export default async function Setting({app,data_contributor}) {
    
    let imagen=`
        <svg id="content-logo" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 21C4.45 21 3.97933 20.8043 3.588 20.413C3.19667 20.0217 3.00067 19.5507 3 19V5C3 4.45 3.196 3.97933 3.588 3.588C3.98 3.19667 4.45067 3.00067 5 3H19C19.55 3 20.021 3.196 20.413 3.588C20.805 3.98 21.0007 4.45067 21 5V19C21 19.55 20.8043 20.021 20.413 20.413C20.0217 20.805 19.5507 21.0007 19 21H5ZM6 17H18L14.25 12L11.25 16L9 13L6 17Z" fill="#AEAEAE"/>
        </svg>
    `;

    console.log(data_contributor)

    if(data_contributor.contributor.logo_path!==null){
        imagen=`
            <img src="${URL_ROOT}public/logos/${data_contributor.contributor.logo_path}">
        `;
    }

    const template=`
        <div class="Setting">
            <div class="Vouchers__nav">
                <h3>Configuración</h3>
            </div>

            <div class="Setting__me">
                <h3>Mi perfil</h3>
                <form>
                    <label class="Setting__labelInput">
                        Nombre
                        <p>${data_contributor.name}</p>
                    </label>
                    <label class="Setting__labelInput">
                        Correo electrónico
                        <p>${data_contributor.email}</p>
                    </label>
                    <label class="Setting__labelInput">
                        Contraseña
                        <input type="password" id="new-password" placeholder="******">
                    </label>
                    <button id="update-password">Actualizar</button>
                </form>
            </div>

            <div class="Setting__me">
                <h3>Logo</h3>
                <form>
                    <div id="content-logo">
                        ${imagen}
                    </div>
                    <label for="file-logo" class="Setting__labelFile">
                        Cambiar logo
                        <input id="file-logo" type="file">
                    </label>
                </form>
            </div>

            <div class="Setting__me">
                <h3>Firma electrónica</h3>
    
                <form>
                    <p id="validez-cert">Fecha vencimiento: ${(data_contributor.contributor.validity_date !== null) ? data_contributor.contributor.validity_date : ""}</p>
                    <p id="entidad-cert">Entidad: ${(data_contributor.contributor.issuer_name!==null) ? data_contributor.contributor.issuer_name : ""}</p>

                    <label class="Setting__labelInput">
                        Contraseña de la firma
                        <input type="password" id="cert-password" placeholder="******">
                    </label>

                    <label for="file-cert" class="Setting__labelFile">
                        Cambiar firma
                        <input id="file-cert" type="file">
                    </label>
                </form>
            </div>

            <div class="Setting__me">
                <h3>Secuenciales</h3>
                <form>
                    <label class="Setting__labelInputLine">
                        Factura
                        <input id="nro-facturas" type="number" value="${(data_contributor.establishment!==null) ? data_contributor.establishment.nro_invoices : 0}">
                    </label>
                    <label class="Setting__labelInputLine">
                        Liquidación
                        <input id="nro-liquidacion" type="number" value="${(data_contributor.establishment!==null) ? data_contributor.establishment.nro_liquidations : 0}">
                    </label>
                    <label class="Setting__labelInputLine">
                        Nota de crédito
                        <input id="nro-ntcredito" type="number" value="${(data_contributor.establishment!==null) ? data_contributor.establishment.nro_credit_note : 0}">
                    </label>
                    <label class="Setting__labelInputLine">
                        Nota de débito
                        <input id="nro-ntdebido" type="number" value="${(data_contributor.establishment!==null) ? data_contributor.establishment.nro_debit_note : 0}">
                    </label>
                    <label class="Setting__labelInputLine">
                        Guía de remisión
                        <input id="nro-guia" type="number" value="${(data_contributor.establishment!==null) ? data_contributor.establishment.nro_guides : 0}">
                    </label>
                    <label class="Setting__labelInputLine">
                        Comprobante de retención
                        <input id="nro-ctretencion" type="number" value="${(data_contributor.establishment!==null) ? data_contributor.establishment.nro_retains : 0}">
                    </label>
                    <button id="update-estab">Actualizar</button>
                </form>
            </div>
            <div class="Setting__me">
                <h3>Configuración de impresión</h3>
                <form>
                    <label class="Setting__labelInputLine">
                        IP Pública VPN
                        <input id="public-ip" type="text" placeholder="10.XXX.XXX.XXX" value="${data_contributor.contributor.public_ip}">
                    </label>
                    <label class="Setting__labelInputLine">
                        IP Impresora ZONA 1
                        <input id="ip-zona1" type="text" placeholder="172.XXX.XXX.XXX" value="${data_contributor.contributor.zone1_ip}">
                    </label>
                    <label class="Setting__labelInputLine">
                        IP Impresora ZONA 2
                        <input id="ip-zona12" type="text" placeholder="172.XXX.XXX.XXX" value="${data_contributor.contributor.zone2_ip}">
                    </label>
                    <label class="Setting__labelInputLine">
                        IP Impresora ZONA 3
                        <input id="ip-zona3" type="text" placeholder="172.XXX.XXX.XXX" value="${data_contributor.contributor.zone3_ip}">
                    </label>
                    <label class="Setting__labelInputLine">
                        Nro. Impresiones (se aplica a las 3 zonas)
                        <input id="nro-impresiones" type="number" placeholder="1" value="${data_contributor.contributor.nro_prints}">
                    </label>
                    <button id="update-impresion">Actualizar</button>
                </form>
            </div>
        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);
    document.getElementById('body').removeChild(document.getElementById('loader'));

    const btn_update_password=document.getElementById('update-password');
    const new_password=document.getElementById('new-password');
    const update_logo=document.getElementById('file-logo');
    const update_cert=document.getElementById('file-cert');
    const password_cert=document.getElementById('cert-password');
    const message_validez=document.getElementById('validez-cert');
    const message_entidad=document.getElementById('entidad-cert');
    const btn_update_estab=document.getElementById('update-estab');

    /**
     *  Para actualizar el certificado de firma electrónica
     */
    update_cert.addEventListener('change',async (e)=>{
        e.preventDefault();

        loader();

        if(password_cert.value===""){

            Push({
                text:"Por favor, introduce la contraseña de la firma."
            });

        }else{
            const data_cert=await useReadCert({
                file:e.target.files[0],
                password:password_cert.value
            });

            console.log(data_cert)
            
            if(data_cert.status===200){
                let validity=new Date(data_cert.validity);
                validity=validity.getTime();

                let fecha_actual=new Date().getTime();

                if((validity-fecha_actual)>0){
                    Push({
                        text:'Certificado validado correctamente.'
                    });

                    // Actualizamos los datos en el contribuyente

                    message_validez.textContent=`Válido hasta: ${data_cert.validity}`;
                    message_entidad.textContent=`Entidad: ${data_cert.IssuerName}`;

                    const request_update=await fetch(`${URL_BASE}contributors/${localStorage.getItem('cc')}`,{
                        method:'PUT',
                        headers: {
                            Accept: 'application/json'
                        },
                        body:new URLSearchParams(data_cert)
                    });

                    const response_update=await request_update.json();

                    //  Subimos la firma electrónica
                    const data=new FormData();
                    data.append('sign_path',data_cert.sign_path);
                    data.append('file',e.target.files[0]);

                    const request=await fetch(`${URL_ROOT}services/uploadCerts.php`,{
                        method:'POST',
                        headers: {
                            Accept: 'application/json'
                        },
                        body:data
                    });

                    const response=await request.json();

                }else{
                    Push({
                        text:'Este certificado ya expiró, carga uno nuevo.'
                    });
                }

            }else{
                Push({
                    text:data_cert.message
                });
            }
        }

        document.getElementById('body').removeChild(document.getElementById('loader'));
    });

    /**
     *  Para actualizar la contraseña de la cuenta
     */
    btn_update_password.addEventListener('click',async (e)=>{
        e.preventDefault();
        loader();
        if(new_password.value===""){
            Push({
                text:'Introduce una contraseña.'
            });
        }else{
            const request_update=await fetch(`${URL_BASE}users/${localStorage.getItem('ui')}`,{
                method:'PUT',
                headers: {
                    Accept: 'application/json'
                },
                body:new URLSearchParams({
                    password:new_password.value
                })
            });

            const response_update=await request_update.json();
            if(request_update.status===200){
                Push({
                    text:'Contraseña actualizada.'
                });
            }
        }
        document.getElementById('body').removeChild(document.getElementById('loader'));
    });


    btn_update_estab.addEventListener('click',async (e)=>{
        loader();
        const data={
            'nro_estab':'001',
            'name':`${data_contributor.contributor.commercial_name} - MATRIZ`,
            'nro_invoices':document.getElementById('nro-facturas').value,
            'nro_liquidations':document.getElementById('nro-liquidacion').value,
            'nro_credit_note':document.getElementById('nro-ntcredito').value,
            'nro_debit_note':document.getElementById('nro-ntdebido').value,
            'nro_guides':document.getElementById('nro-guia').value,
            'nro_retains':document.getElementById('nro-ctretencion').value,
            'user_id':localStorage.getItem('ui'),
            'contributor_id':localStorage.getItem('cc')
        };

        const request=await fetch(`${URL_BASE}establisments`,{
            method:'POST',
            headers: {
                Accept: 'application/json'
            },
            body:new URLSearchParams(data)
        });

        const response=await request.json();
        console.log(response)
        document.getElementById('body').removeChild(document.getElementById('loader'));
    });

    /**
     *  Para actualizar el logo del comercial
     */
    update_logo.addEventListener('change',async (e)=>{
        e.preventDefault();
        loader();
        document.getElementById('content-logo').innerHTML="";
        const path=`${data_contributor.contributor.identification}.${e.target.files[0].type.split('/')[1]}`
        
        const request_update=await fetch(`${URL_BASE}contributors/general/${localStorage.getItem('cc')}`,{
            method:'PUT',
            headers: {
                Accept: 'application/json'
            },
            body:new URLSearchParams({
                "logo_path":path
            })
        });

        const response_update=await request_update.json();
        console.log(response_update)

        //  Subimos la firma electrónica
        const data=new FormData();
        data.append('logo_path',path);
        data.append('logo',e.target.files[0]);

        const request=await fetch(`${URL_ROOT}services/uploadLogos.php`,{
            method:'POST',
            headers: {
                Accept: 'application/json'
            },
            body:data
        });

        const response=await request.json();

        console.log(response);
        document.getElementById('content-logo').insertAdjacentHTML('beforeend',`<img src="${URL.createObjectURL(e.target.files[0])}">`);

        Push({
            text:'Logo actualizado correctamente.'
        });

        document.getElementById('body').removeChild(document.getElementById('loader'));
    });

}