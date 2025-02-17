//  import cardPrevRide from "../components/cardPrevRide/cardPrevRide.js";
import Push from "../components/Push/Push.js";
import { AMBIENTE, CONTABILIDAD, URL_BASE } from "./env.js";
import useAuthSRI from "./useAuthSRI.js";
// import useAuthSRI from "./useAuthSRI.js";
import useCheckMod11 from "./useCheckMod11.js";
import firmarComprobante from "./useFactoLib.js";
import usePadDate from "./usePadDate.js";
import useReceiveSRI from "./useReceiveSRI.js";
// import useReceiveSRI from "./useReceiveSRI.js";
import useRound from "./useRound.js";

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

export default async function useGenerate({contributor,info_estab,info_doc,date,client,detail,info_pay,btn}){
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

    console.log(`MOD_11: ${mod11}`);

    clave_acceso+=mod11;

    console.log(`CLAVE_ACCESS: ${clave_acceso}`);

    //  6) Generamos el XML sin firmar
    let detalle_comprobante=[];

    let items=detail;

    let xml='<?xml version="1.0" encoding="UTF-8"?>\n';
    xml+='<factura id="comprobante" version="2.1.0">\n';
        // Información tributaria
        xml+='<infoTributaria>\n';
            xml+=`<ambiente>${ambiente}</ambiente>\n`;
            xml+=`<tipoEmision>1</tipoEmision>\n`;
            xml+=`<razonSocial>${razon_social}</razonSocial>\n`;
            xml+=`<nombreComercial>${nombre_comercial}</nombreComercial>\n`;
            xml+=`<ruc>${ruc}</ruc>\n`;
            xml+=`<claveAcceso>${clave_acceso}</claveAcceso>\n`;
            xml+=`<codDoc>${type_doc}</codDoc>\n`;
            xml+=`<estab>${estab}</estab>\n`;
            xml+=`<ptoEmi>${info_estab.pto_emi}</ptoEmi>\n`;
            xml+=`<secuencial>${pad(info_estab.nro+1,9)}</secuencial>\n`;
            xml+=`<dirMatriz>${dir}</dirMatriz>\n`;
        xml+='</infoTributaria>\n';
        // Información de la factura
        xml+='<infoFactura>\n';
            xml+=`<fechaEmision>${date}</fechaEmision>\n`;
            xml+=`<dirEstablecimiento>${dir}</dirEstablecimiento>\n`;
            xml+=`<obligadoContabilidad>${contabilidad}</obligadoContabilidad>\n`;
            xml+=`<tipoIdentificacionComprador>${tipo_identificador}</tipoIdentificacionComprador>\n`;
            xml+=`<razonSocialComprador>${client_razon_social.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").trimStart().trimEnd()}</razonSocialComprador>\n`;
            xml+=`<identificacionComprador>${identificacion.trimStart().trimEnd()}</identificacionComprador>\n`;

            xml+=`<totalSinImpuestos>${info_pay.subtotal}</totalSinImpuestos>\n`;
            xml+=`<totalDescuento>${info_pay.descuento}</totalDescuento>\n`;
            xml+=`<totalConImpuestos>\n`;
                xml+=`<totalImpuesto>\n`;
                    xml+=`<codigo>2</codigo>\n`;
                    xml+=`<codigoPorcentaje>4</codigoPorcentaje>\n`;
                    xml+=`<baseImponible>${info_pay.subtotal}</baseImponible>\n`;
                    xml+=`<valor>${info_pay.tax}</valor>\n`;
                xml+=`</totalImpuesto>\n`;
            xml+=`</totalConImpuestos>\n`;
            xml+=`<propina>0</propina>\n`;
            xml+=`<importeTotal>${info_pay.total}</importeTotal>\n`;
            xml+=`<moneda>DOLAR</moneda>\n`;
            xml+=`<pagos>\n`;
                xml+=`<pago>\n`;
                    xml+=`<formaPago>${forma_pago}</formaPago>\n`;
                    xml+=`<total>${info_pay.total}</total>\n`;
                xml+=`</pago>\n`;
            xml+=`</pagos>\n`;
        xml+=`</infoFactura>\n`;

        // ============================== RECORREMOS TODOS LOS PRODUCTOS ==============================
        xml+=`<detalles>\n`;

            items.map((product)=>{

                detalle_comprobante.push({
                    codigo:product.id,
                    nombre:product.name.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").trimStart().trimEnd(),
                    descripcion:product.description.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").trimStart().trimEnd(),
                    cantidad:product.quantity,
                    precio_unitario:product.price,
                    descuento:product.descuento,
                    importe:product.subtotal,
                    iva:product.tax
                });

                xml+=`<detalle>\n`;
                    xml+=`<codigoPrincipal>${product.id}</codigoPrincipal>\n`;
                    xml+=`<codigoAuxiliar>${product.id}</codigoAuxiliar>\n`;
                    xml+=`<descripcion>${product.name.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").trimStart().trimEnd()}</descripcion>\n`;
                    xml+=`<cantidad>${product.quantity}</cantidad>\n`;
                    xml+=`<precioUnitario>${product.price}</precioUnitario>\n`;
                    xml+=`<descuento>${product.descuento}</descuento>\n`;
                    xml+=`<precioTotalSinImpuesto>${product.subtotal}</precioTotalSinImpuesto>\n`;
                    xml+=`<impuestos>\n`;
                        xml+=`<impuesto>\n`;
                            xml+=`<codigo>2</codigo>\n`;
                            xml+=`<codigoPorcentaje>4</codigoPorcentaje>\n`;
                            xml+=`<tarifa>15</tarifa>\n`;
                            xml+=`<baseImponible>${product.subtotal}</baseImponible>\n`;
                            xml+=`<valor>${useRound({value:Number(product.tax)})}</valor>\n`;
                        xml+=`</impuesto>\n`;
                    xml+=`</impuestos>\n`;
                xml+=`</detalle>\n`;
            });

        xml+=`</detalles>\n`;
        
        // Información adicional
        xml+=`<infoAdicional>\n`;
            xml+=`<campoAdicional nombre="Email">${client_email.trimStart().trimEnd()}</campoAdicional>\n`;
            xml+=`<campoAdicional nombre="Telefono">${client_phone.trimStart().trimEnd()}</campoAdicional>\n`;
            xml+=`<campoAdicional nombre="Direccion">${client_dir.trimStart().trimEnd()}</campoAdicional>\n`;
        xml+=`</infoAdicional>\n`;

    xml+=`</factura>\n`;

    console.log("XML: ");
    console.log(xml);

    // 7) Firmamos el XML digitalmente
    const xml_firmado=await firmarComprobante({
        comprobante:xml,
        contribuyente:contributor
    });
    
    console.log("XML FIRMADO: ");
    console.log(xml_firmado);

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
                    'xml_path':`${clave_acceso}.pdf`,
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
                    'nro_estab':info_estab.estab
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

                console.log(response_voucher);
            
            }else{
                if('RespuestaAutorizacionComprobante' in auth_SRI.response){
                    if('autorizaciones' in reception_SRI.response.RespuestaAutorizacionComprobante){
                        const message=reception_SRI.response.RespuestaAutorizacionComprobante.autorizaciones.autorizacion.mensajes.mensaje.mensaje;
                        const adicional=reception_SRI.response.RespuestaAutorizacionComprobante.autorizaciones.autorizacion.mensajes.mensaje.informacionAdicional;
        
                        console.log(message)
                        console.log(adicional)
                        Push({
                            text:message
                        });
                    }
                }
            }

        }else{
            if('RespuestaRecepcionComprobante' in reception_SRI.response){

                if('comprobantes' in reception_SRI.response.RespuestaRecepcionComprobante){
                    const message=reception_SRI.response.RespuestaRecepcionComprobante.comprobantes.comprobante.mensajes.mensaje.mensaje;
                    const adicional=reception_SRI.response.RespuestaRecepcionComprobante.comprobantes.comprobante.mensajes.mensaje.informacionAdicional;
                    
                    console.log(message)
                    console.log(adicional)

                    Push({
                        text:message
                    });
                }

            }
        }

    }catch (error) {
        console.log(error);
        console.log("ERR: Sin comunicación con SRI");
    }

    document.getElementById('body').removeChild(document.getElementById('loader'));
}