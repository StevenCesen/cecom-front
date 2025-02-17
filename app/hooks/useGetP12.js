function sha1_base64(txt) {
    let md = forge.md.sha1.create();
    md.update(txt);
    return new window.buffer.Buffer(md.digest().toHex(), 'hex').toString('base64');
}

function hexToBase64(str) {
    let hex = ('00' + str).slice(0 - str.length - str.length % 2);
    
    return btoa(String.fromCharCode.apply(null,
        hex.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
}

function bigint2base64(bigint){
    var base64 = '';
    base64 = btoa(bigint.toString(16).match(/\w{2}/g).map(function(a){return String.fromCharCode(parseInt(a, 16));} ).join(""));
    
    base64 = base64.match(/.{1,76}/g).join("\n");
    
    return base64;
}

export default async function useGetP12({file,mi_pwd_p12}){

    const array_buff=await file.arrayBuffer();

    let arrayUint8 = new Uint8Array(array_buff);
    let p12B64 = forge.util.binary.base64.encode(arrayUint8);
    let p12Der = forge.util.decode64(p12B64);
    let p12Asn1 = forge.asn1.fromDer(p12Der);

    try {
        let p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, mi_pwd_p12);
        let certBags = p12.getBags({bagType:forge.pki.oids.certBag})

        const certBag = certBags[forge.oids.certBag]; 

        // const friendlyName = certBag[1].attributes.friendlyName[0];
        const cert = certBag.reduce ((prev, curr) => {
            const attributes = curr.cert.extensions; 
            // Devuelvo el certificado
            return attributes.length > prev.cert.extensions.length ? curr : prev;
        });
        
        let pkcs8bags = p12.getBags({bagType:forge.pki.oids.pkcs8ShroudedKeyBag});
        let pkcs8="";
        let certificate=cert.cert;
        let validity=new Date(cert.cert.validity.notAfter).toLocaleDateString();
        let IssuerName="";

        if(certBag.length>1 & certBag[1]){
            if('friendlyName' in certBag[1].attributes){
                console.log(certBag[1]);
                console.log(certificate)
                const friendlyName = certBag[1].attributes.friendlyName[0]; 
                // IssuerName = 'CN='+certificate.issuer.getField('CN').value+",OU="+certificate.issuer.getField('OU').value+",O="+certificate.issuer.getField('O').value +",C="+certificate.issuer.getField('C').value ;
                // Seleccionamos el IssuerName de cada entidad emisora de firmas digitales
                if (/BANCO CENTRAL/i.test(friendlyName)) {  
                    let keys = pkcs8bags[forge.oids.pkcs8ShroudedKeyBag]; 

                    for (let i = 0; i < keys.length; i++) { 
                        const element = keys[i]; 
                        let frlendlyName1 = element.attributes.friendlyName[0]; 
                        if(/Signing Key/i.test(frlendlyName1)) { 
                            pkcs8 = pkcs8bags[forge.oids.pkcs8ShroudedKeyBag][i];
                            IssuerName = 'CN=AC BANCO CENTRAL DEL ECUADOR,L=QUITO,OU=ENTIDAD DE CERTIFICACION DE INFORMACION-ECIBCE,O=BANCO CENTRAL DEL ECUADOR,C=EC';
                        }  
                    }
                }

                if (/SECURITY DATA/i.test(friendlyName)) { 
                    pkcs8 = pkcs8bags[forge.oids.pkcs8ShroudedKeyBag][0];
                    IssuerName = 'CN='+certificate.issuer.getField('CN').value+",OU="+certificate.issuer.getField('OU').value+",O="+certificate.issuer.getField('O').value+",C="+certificate.issuer.getField('C').value ;
                }
            }else if('friendlyName' in certBag[0].attributes){
                console.log(certBag[0]);
                console.log(certificate)
                const friendlyName = certBag[0].attributes.friendlyName[0];
                IssuerName = 'CN='+certificate.issuer.getField('CN').value+",OU="+certificate.issuer.getField('OU').value+",O="+certificate.issuer.getField('O').value+",C="+certificate.issuer.getField('C').value ;
                pkcs8 = pkcs8bags[forge.oids.pkcs8ShroudedKeyBag][0];
                // CN=ANF High Assurance Ecuador Intermediate CA,OU=ANF Autoridad intermedia EC,O=ANFAC AUTORIDAD DE CERTIFICACION ECUADOR C.A.,C=EC,2.5.4.5=#130d31373932363031323135303031"
                // CN=ANF High Assurance Ecuador Intermediate CA,OU=ANF Autoridad intermedia EC,O=ANFAC AUTORIDAD DE CERTIFICACION ECUADOR C.A.,C=EC
            }
        }else{
            pkcs8 = pkcs8bags[forge.oids.pkcs8ShroudedKeyBag][0];
            IssuerName='2.5.4.97=#0c0f56415445532d413636373231343939,CN=UANATACA CA2 2016,OU=TSP-UANATACA,O=UANATACA S.A.,L=Barcelona (see current address at www.uanataca.com/address),C=ES';
        }

        let key = pkcs8.key ?? pkcs8.asn1;

        let certificateX509_pem = forge.pki.certificateToPem(certificate);

        let certificateX509 = certificateX509_pem;
        certificateX509 = certificateX509.substr( certificateX509.indexOf('\n') );
        certificateX509 = certificateX509.substr( 0, certificateX509.indexOf('\n-----END CERTIFICATE-----') );

        certificateX509 = certificateX509.replace(/\r?\n|\r/g, '').replace(/([^\0]{76})/g, '$1\n');

        //Pasar certificado a formato DER y sacar su hash:
        let certificateX509_asn1 = forge.pki.certificateToAsn1(certificate);
        let certificateX509_der = forge.asn1.toDer(certificateX509_asn1).getBytes();
        let certificateX509_der_hash = sha1_base64(certificateX509_der);
        
        //Serial Number
        let X509SerialNumber = parseInt(certificate.serialNumber, 16);

        let exponent = hexToBase64(key.e.data[0].toString(16));            
        let modulus = bigint2base64(key.n);
        
        return {
            status:200,
            X509SerialNumber:certificate.serialNumber,
            certificateX509:certificateX509,
            certificateX509_der_hash:certificateX509_der_hash,
            exponent:exponent,
            modulus:modulus,
            IssuerName:IssuerName,
            key_cert:key,
            file:file,
            sign_path:file.name,
            validity:validity,
            message:"Validación correcta",
            x509_self:mi_pwd_p12
        }   
        
    } catch (error) {

        return {
            status:400,
            message:"Contraseña incorrecta"
        }
    }
}