import useGetP12 from "../hooks/useGetP12.js";

function sha1_base64(txt) {
    var md = forge.md.sha1.create();
    md.update(txt);
    //console.log('Buffer in: ', Buffer);
    //return new Buffer(md.digest().toHex(), 'hex').toString('base64');
    return new window.buffer.Buffer(md.digest().toHex(), 'hex').toString('base64');
}

function p_obtener_aleatorio() {
    return Math.floor(Math.random() * 999000) + 990;    
}

function dataURLtoFile(dataurl) {
    let bstr = atob(dataurl);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], "", {type:"application/x-pkcs12"});
}

export default async function firmarComprobante({contribuyente,comprobante}) {
    /*
    ===========================================================================================================
                                            PROCESO DE FIRMADO DIGITAL
    ===========================================================================================================
    */
    let contrib_cert=await useGetP12({file:dataURLtoFile(contribuyente.cert),mi_pwd_p12:contribuyente.x509_self});

    let comprobante_C1N=comprobante.replace('<?xml version="1.0" encoding="UTF-8"?>\n', '');
    let sha1_comprobante = sha1_base64(comprobante_C1N.trim());

    let xmlns = 'xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#"';
    
    //var Certificate_number = 1217155;//p_obtener_aleatorio(); //1562780 en el ejemplo del SRI
    let Certificate_number = p_obtener_aleatorio(); //1562780 en el ejemplo del SRI
    //var Signature_number = 1021879;//p_obtener_aleatorio(); //620397 en el ejemplo del SRI
    let Signature_number = p_obtener_aleatorio(); //620397 en el ejemplo del SRI
    //var SignedProperties_number = 1006287;//p_obtener_aleatorio(); //24123 en el ejemplo del SRI
    let SignedProperties_number = p_obtener_aleatorio(); //24123 en el ejemplo del SRI
    //numeros fuera de los hash:
    //var SignedInfo_number = 696603;//p_obtener_aleatorio(); //814463 en el ejemplo del SRI
    let SignedInfo_number = p_obtener_aleatorio(); //814463 en el ejemplo del SRI
    //var SignedPropertiesID_number = 77625;//p_obtener_aleatorio(); //157683 en el ejemplo del SRI
    let SignedPropertiesID_number = p_obtener_aleatorio(); //157683 en el ejemplo del SRI
    //var Reference_ID_number = 235824;//p_obtener_aleatorio(); //363558 en el ejemplo del SRI
    let Reference_ID_number = p_obtener_aleatorio(); //363558 en el ejemplo del SRI
    //var SignatureValue_number = 844709;//p_obtener_aleatorio(); //398963 en el ejemplo del SRI
    let SignatureValue_number = p_obtener_aleatorio(); //398963 en el ejemplo del SRI
    //var Object_number = 621794;//p_obtener_aleatorio(); //231987 en el ejemplo del SRI
    let Object_number = p_obtener_aleatorio(); //231987 en el ejemplo del SRI

    let SignedProperties = '';

    const currentDate=new Date();
    const isoDateTime=currentDate.toISOString().slice(0,19);

    SignedProperties += '<etsi:SignedProperties Id="Signature' + Signature_number + '-SignedProperties' + SignedProperties_number + '">';
        SignedProperties += '<etsi:SignedSignatureProperties>';
            SignedProperties += '<etsi:SigningTime>';

                SignedProperties += isoDateTime;

            SignedProperties += '</etsi:SigningTime>';
            SignedProperties += '<etsi:SigningCertificate>';
                SignedProperties += '<etsi:Cert>';
                    SignedProperties += '<etsi:CertDigest>';
                        SignedProperties += '<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
                        SignedProperties += '</ds:DigestMethod>';
                        SignedProperties += '<ds:DigestValue>';

                            SignedProperties += contribuyente.x509_der_hash;

                        SignedProperties += '</ds:DigestValue>';
                    SignedProperties += '</etsi:CertDigest>';
                    SignedProperties += '<etsi:IssuerSerial>';
                        SignedProperties += '<ds:X509IssuerName>';
                            SignedProperties += contribuyente.issuer_name;
                        SignedProperties += '</ds:X509IssuerName>';
                    SignedProperties += '<ds:X509SerialNumber>';
                        SignedProperties += contribuyente.x509_serial_number;
                    SignedProperties += '</ds:X509SerialNumber>';
                    SignedProperties += '</etsi:IssuerSerial>';
                SignedProperties += '</etsi:Cert>';
            SignedProperties += '</etsi:SigningCertificate>';
        SignedProperties += '</etsi:SignedSignatureProperties>';
        SignedProperties += '<etsi:SignedDataObjectProperties>';
            SignedProperties += '<etsi:DataObjectFormat ObjectReference="#Reference-ID-' + Reference_ID_number + '">';
                SignedProperties += '<etsi:Description>';

                    SignedProperties += 'contenido comprobante';                        

                SignedProperties += '</etsi:Description>';
                SignedProperties += '<etsi:MimeType>';
                    SignedProperties += 'text/xml';
                SignedProperties += '</etsi:MimeType>';
            SignedProperties += '</etsi:DataObjectFormat>';
        SignedProperties += '</etsi:SignedDataObjectProperties>';
    SignedProperties += '</etsi:SignedProperties>';

    let SignedProperties_para_hash = SignedProperties.replace('<etsi:SignedProperties', '<etsi:SignedProperties ' + xmlns);

    let sha1_SignedProperties = sha1_base64(SignedProperties_para_hash);        

    let KeyInfo = '';

    KeyInfo += '<ds:KeyInfo Id="Certificate' + Certificate_number + '">';
        KeyInfo += '\n<ds:X509Data>';
            KeyInfo += '\n<ds:X509Certificate>\n';

                //CERTIFICADO X509 CODIFICADO EN Base64 
                KeyInfo += contribuyente.certificate;

            KeyInfo += '\n</ds:X509Certificate>';
        KeyInfo += '\n</ds:X509Data>';
        KeyInfo += '\n<ds:KeyValue>';
            KeyInfo += '\n<ds:RSAKeyValue>';
                KeyInfo += '\n<ds:Modulus>\n';

                    //MODULO DEL CERTIFICADO X509
                    KeyInfo += contribuyente.module;

                KeyInfo += '\n</ds:Modulus>';
                KeyInfo += '\n<ds:Exponent>';

                    //KeyInfo += 'AQAB';
                    KeyInfo += contribuyente.exponent;

                KeyInfo += '</ds:Exponent>';
            KeyInfo += '\n</ds:RSAKeyValue>';
        KeyInfo += '\n</ds:KeyValue>';
    KeyInfo += '\n</ds:KeyInfo>';

    let KeyInfo_para_hash = KeyInfo.replace('<ds:KeyInfo', '<ds:KeyInfo ' + xmlns);
    let sha1_certificado = sha1_base64(KeyInfo_para_hash);

    let SignedInfo = '';

    SignedInfo += '<ds:SignedInfo Id="Signature-SignedInfo' + SignedInfo_number + '">';
        SignedInfo += '\n<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315">';
        SignedInfo += '</ds:CanonicalizationMethod>';
        SignedInfo += '\n<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1">';
        SignedInfo += '</ds:SignatureMethod>';
        SignedInfo += '\n<ds:Reference Id="SignedPropertiesID' + SignedPropertiesID_number + '" Type="http://uri.etsi.org/01903#SignedProperties" URI="#Signature' + Signature_number + '-SignedProperties' + SignedProperties_number + '">';
            SignedInfo += '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
            SignedInfo += '</ds:DigestMethod>';
            SignedInfo += '\n<ds:DigestValue>';

                //HASH O DIGEST DEL ELEMENTO <etsi:SignedProperties>';
                SignedInfo += sha1_SignedProperties;

            SignedInfo += '</ds:DigestValue>';
        SignedInfo += '\n</ds:Reference>';
        SignedInfo += '\n<ds:Reference URI="#Certificate' + Certificate_number + '">';
            SignedInfo += '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
            SignedInfo += '</ds:DigestMethod>';
            SignedInfo += '\n<ds:DigestValue>';

                //HASH O DIGEST DEL CERTIFICADO X509
                SignedInfo += sha1_certificado;

            SignedInfo += '</ds:DigestValue>';
        SignedInfo += '\n</ds:Reference>';
        SignedInfo += '\n<ds:Reference Id="Reference-ID-' + Reference_ID_number + '" URI="#comprobante">';
            SignedInfo += '\n<ds:Transforms>';
                SignedInfo += '\n<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature">';
                SignedInfo += '</ds:Transform>';
            SignedInfo += '\n</ds:Transforms>';
            SignedInfo += '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
            SignedInfo += '</ds:DigestMethod>';
            SignedInfo += '\n<ds:DigestValue>';

                //HASH O DIGEST DE TODO EL ARCHIVO XML IDENTIFICADO POR EL id="comprobante" 
                SignedInfo += sha1_comprobante;

            SignedInfo += '</ds:DigestValue>';
        SignedInfo += '\n</ds:Reference>';
    SignedInfo += '\n</ds:SignedInfo>';

    let SignedInfo_para_firma = SignedInfo.replace('<ds:SignedInfo', '<ds:SignedInfo ' + xmlns);

    let md = forge.md.sha1.create();
    md.update(SignedInfo_para_firma, 'utf8');
    
    let signature = btoa(contrib_cert.key_cert.sign(md)).match(/.{1,76}/g).join("\n");

    let xades_bes = '';

    //INICIO DE LA FIRMA DIGITAL 
    xades_bes += '<ds:Signature ' + xmlns + ' Id="Signature' + Signature_number + '">';
        xades_bes += '\n' + SignedInfo;

        xades_bes += '\n<ds:SignatureValue Id="SignatureValue' + SignatureValue_number + '">\n';

            //VALOR DE LA FIRMA (ENCRIPTADO CON LA LLAVE PRIVADA DEL CERTIFICADO DIGITAL) 
            xades_bes += signature;

        xades_bes += '\n</ds:SignatureValue>';

        xades_bes += '\n' + KeyInfo;

        xades_bes += '\n<ds:Object Id="Signature' + Signature_number + '-Object' + Object_number + '">';
            xades_bes += '<etsi:QualifyingProperties Target="#Signature' + Signature_number + '">';

                //ELEMENTO <etsi:SignedProperties>';
                xades_bes += SignedProperties;

            xades_bes += '</etsi:QualifyingProperties>';
        xades_bes += '</ds:Object>';
    xades_bes += '</ds:Signature>';
    // Devolvemos el comprobante para que sea enviado al SRI
    console.log(comprobante.replace(/(<[^<]+)$/, xades_bes + '$1'));

    return btoa(comprobante.replace(/(<[^<]+)$/, xades_bes + '$1'));
}