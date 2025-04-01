//  import cardPrevRide from "../components/cardPrevRide/cardPrevRide.js";
import Push from "../components/Push/Push.js";
import { AMBIENTE, CONTABILIDAD, URL_BASE } from "./env.js";
import useAuthSRI from "./useAuthSRI.js";
// import useAuthSRI from "./useAuthSRI.js";
import useCheckMod11 from "./useCheckMod11.js";
import usePadDate from "./usePadDate.js";
import useReceiveSRI from "./useReceiveSRI.js";
// import useReceiveSRI from "./useReceiveSRI.js";
import useSignXML from "./useSignXML.js";

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function padDate(value){
    if(Number(value)<10){
        return `0${value}`;
    }else{
        return value;
    }
}

export default async function useGenerate({contributor,info_estab,info_doc,date,nota,client,detail,info_pay,btn,context,order}){
    btn.textContent="Generando...";

    //  1) Ambiente y régimen de facturación
    const ambiente      =   AMBIENTE;
    const contabilidad  =   CONTABILIDAD;


    //  2) Información del contribuyente
    const razon_social      =   contributor.name;
    const nombre_comercial  =   contributor.commercial_name;
    const ruc               =   contributor.identification;
    const dir               =   contributor.direction;

    //  3) Información del cliente
    const tipo_identificador    =   client.identification_type;
    const client_razon_social   =   client.name;
    const identificacion        =   client.identification;
    const client_email          =   client.email;
    const client_phone          =   client.phone;
    const client_dir            =   client.dir;

    //  4) Información del documento
    const forma_pago    =   info_pay.pay_way;
    const type_doc      =   info_doc.type;
    const estab         =   info_estab.estab;
    const pto_emi       =   '001';
    const date_actual   =   date.split('-');
    const day           =   usePadDate(date_actual[2]);
    const month         =   usePadDate(date_actual[1]);
    const year          =   date_actual[0];

    const date_emision=`${day}${month}${year}`;
    date=`${day}/${month}/${year}`;

    //  5) Generamos la clave de acceso
    let clave_acceso=date_emision+type_doc+ruc+ambiente+estab+info_estab.pto_emi+pad((info_estab.nro+1),9)+'122456781';

    let mod11=await useCheckMod11({
        clave_acceso:clave_acceso
    });

    clave_acceso+=mod11;

    let [xml_firmado,detalle_comprobante]=await useSignXML({
        contributor,
        detail,
        ambiente,
        razon_social,
        nombre_comercial,
        ruc,
        clave_acceso,
        type_doc,
        estab,
        info_estab,
        date,
        dir,
        contabilidad,
        tipo_identificador,
        client_razon_social,
        identificacion,
        info_pay,
        forma_pago,
        client_email,
        client_phone,
        client_dir,
        nota
    });

    try {
        //  8) Enviamos el XML a recepción del SRI
        const reception_SRI=await useReceiveSRI({
            ambiente,
            codificado:xml_firmado,
            ruc:contributor.identification,
            clave_acceso
        });
        
        console.log(reception_SRI);

        if(reception_SRI.status===200){
            //  9) Enviamos el documento a autorización en el SRI
            const auth_SRI=await useAuthSRI({
                ambiente,
                codificado:xml_firmado,
                ruc:contributor.identification,
                clave_acceso
            });

            if(auth_SRI.estado==='AUTORIZADO' || auth_SRI.estado==='EN PROCESO'){
                
                // 10) Guardamos el comprobante
                const comprobante={
                    'sequential':pad(info_estab.nro+1,9),
                    'access_key':clave_acceso,
                    'doc_type':info_doc.type,
                    'issue_date':date_emision,
                    'create_date':auth_SRI.fecha_auth,
                    'subtotal_amount':info_pay.subtotal,
                    'tax_value':info_pay.tax,
                    'total_amount':info_pay.total,
                    'ride_path':`${clave_acceso}.pdf`,
                    'xml_path':`${clave_acceso}.xml`,
                    'status':auth_SRI.estado,
                    'contributor_id':contributor.id,
                    'client_id':"",
                    'order_id':"",
                    'xml':xml_firmado,
                    'contributor_identification':contributor.identification,
                    'client_name':client.name,
                    'client_identification':client.identification,
                    'client_direction':client.dir,
                    'client_phone':client.phone,
                    'client_email':client.email,
                    'detail':JSON.stringify(detalle_comprobante),
                    'nro_estab':info_estab.estab,
                    'concept':`CONSUMO EN ESTABLECIMIENTO ${contributor.commercial_name}`,
                    'contributor_name':contributor.name,
                    'context':context,
                    'order':order,
                    //Información pagos
                    'info_pay':JSON.stringify(info_pay),
                    'nota':nota
                };
                
                console.log(comprobante);

                const save_voucher=await fetch(`${URL_BASE}vouchers`,{
                    method:'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body:new URLSearchParams(comprobante)
                });

                const response_voucher=await save_voucher.json();
                
                if(response_voucher.status===200){
                    Push({
                        text:response_voucher.message
                    });

                    return response_voucher;
                }else{
                    Push({
                        text:response_voucher.message
                    });
                }
            
            }else{
                console.log(auth_SRI)
                if('RespuestaAutorizacionComprobante' in auth_SRI.response){
                    if('autorizaciones' in auth_SRI.response.RespuestaAutorizacionComprobante){
                        const message=auth_SRI.response.RespuestaAutorizacionComprobante.autorizaciones.autorizacion.mensajes.mensaje.mensaje;
                        const adicional=auth_SRI.response.RespuestaAutorizacionComprobante.autorizaciones.autorizacion.mensajes.mensaje.informacionAdicional;
                        
                        console.log(message)
                        console.log(adicional)
                        Push({
                            text:message+adicional
                        });
                    }
                }
            }

        }else{
            if('RespuestaRecepcionComprobante' in reception_SRI.response){

                if('comprobantes' in reception_SRI.response.RespuestaRecepcionComprobante){
                    const message=reception_SRI.response.RespuestaRecepcionComprobante.comprobantes.comprobante.mensajes.mensaje.mensaje;
                    const adicional=reception_SRI.response.RespuestaRecepcionComprobante.comprobantes.comprobante.mensajes.mensaje.informacionAdicional;
                    
                    if(message==='CLAVE ACCESO REGISTRADA' || message==='LIMITE DE INTENTOS NO AUTORIZADOS POR DIA'){
                        //  Enviamos a autorizar
                        const auth_SRI=await useAuthSRI({
                            ambiente,
                            codificado:xml_firmado,
                            ruc:contributor.identification,
                            clave_acceso
                        });
            
                        if(auth_SRI.estado==='AUTORIZADO' || auth_SRI.estado==='EN PROCESO'){
                            
                            // 10) Guardamos el comprobante
                            const comprobante={
                                'sequential':pad(info_estab.nro+1,9),
                                'access_key':clave_acceso,
                                'doc_type':info_doc.type,
                                'issue_date':date_emision,
                                'create_date':auth_SRI.fecha_auth,
                                'subtotal_amount':info_pay.subtotal,
                                'tax_value':info_pay.tax,
                                'total_amount':info_pay.total,
                                'ride_path':`${clave_acceso}.pdf`,
                                'xml_path':`${clave_acceso}.xml`,
                                'status':auth_SRI.estado,
                                'contributor_id':contributor.id,
                                'client_id':"",
                                'order_id':"",
                                'xml':xml_firmado,
                                'contributor_identification':contributor.identification,
                                'client_name':client.name,
                                'client_identification':client.identification,
                                'client_direction':client.dir,
                                'client_phone':client.phone,
                                'client_email':client.email,
                                'detail':JSON.stringify(detalle_comprobante),
                                'nro_estab':info_estab.estab,
                                'concept':`CONSUMO EN ESTABLECIMIENTO ${contributor.commercial_name}`,
                                'contributor_name':contributor.name,
                                'context':context,
                                'order':order,
                                //Información pagos
                                'info_pay':JSON.stringify(info_pay),
                                'nota':nota
                            };
            
                            console.log(comprobante)
            
                            const save_voucher=await fetch(`${URL_BASE}vouchers`,{
                                method:'POST',
                                headers: {
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                },
                                body:new URLSearchParams(comprobante)
                            });
            
                            const response_voucher=await save_voucher.json();
                            
                            if(response_voucher.status===200){
                                Push({
                                    text:response_voucher.message
                                });
                                document.getElementById('modal').parentElement.removeChild(document.getElementById('modal'));
                            }else{
                                Push({
                                    text:response_voucher.message
                                });
                            }
                        
                        }else{
                            if('RespuestaAutorizacionComprobante' in auth_SRI.response){
                                console.log(auth_SRI)
                                if('autorizaciones' in auth_SRI.response.RespuestaAutorizacionComprobante){
                                    const message=auth_SRI.response.RespuestaAutorizacionComprobante.autorizaciones.autorizacion.mensajes.mensaje.mensaje;
                                    const adicional=auth_SRI.response.RespuestaAutorizacionComprobante.autorizaciones.autorizacion.mensajes.mensaje.informacionAdicional;
                                    
                                    console.log(message)
                                    console.log(adicional)
                                    Push({
                                        text:message
                                    });
                                }
                            }
                        }
                    }else{
                        console.log(message)
                        console.log(adicional)

                        Push({
                            text:message
                        });
                    }
                }

            }else{
                Push({
                    text:reception_SRI.message
                });
            }
        }

    }catch (error) {
        console.log(error);
        console.log("ERR: Sin comunicación con SRI");
    }

    document.getElementById('body').removeChild(document.getElementById('loader'));
}