import firmarComprobante from "./useFactoLib.js";
import useRound from "./useRound.js";

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export default async function useSignXML({
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
}){
    //  6) Generamos el XML sin firmar
    let detalle_comprobante=[];

    let items=detail;

    let tarifa=0,codigo_impuesto=0,pagos="";

    info_pay.pay_way.map(pay=>{
        pagos+=`<pago>\n`;
            pagos+=`<formaPago>${pay.pay_way}</formaPago>\n`;
            pagos+=`<total>${pay.value}</total>\n`;
        pagos+=`</pago>\n`;
    });

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
                    xml+=`<codigoPorcentaje>0</codigoPorcentaje>\n`;
                    xml+=`<baseImponible>${info_pay.subtotal}</baseImponible>\n`;
                    xml+=`<valor>${info_pay.tax}</valor>\n`;
                xml+=`</totalImpuesto>\n`;
            xml+=`</totalConImpuestos>\n`;
            xml+=`<propina>0</propina>\n`;
            xml+=`<importeTotal>${info_pay.total}</importeTotal>\n`;
            xml+=`<moneda>DOLAR</moneda>\n`;

            // INFORMACIÓN PAGOS
            xml+=`<pagos>\n`;
                xml+=pagos;
            xml+=`</pagos>\n`;
        xml+=`</infoFactura>\n`;

        // ============================== RECORREMOS TODOS LOS PRODUCTOS ==============================
        xml+=`<detalles>\n`;

            items.map((product)=>{

                detalle_comprobante.push({
                    codigo:(product.codigo!==undefined) ? product.codigo : product.id,
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
                            xml+=`<codigoPorcentaje>0</codigoPorcentaje>\n`;
                            xml+=`<tarifa>0</tarifa>\n`;
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
            (nota!=="") 
            ? 
                xml+=`<campoAdicional nombre="Nota">${nota}</campoAdicional>\n`
            :   "";
            xml+=`<campoAdicional nombre="Telefono">${client_phone.trimStart().trimEnd()}</campoAdicional>\n`;
            xml+=`<campoAdicional nombre="Direccion">${client_dir.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").trimStart().trimEnd()}</campoAdicional>\n`;
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
    return [xml_firmado,detalle_comprobante];
}