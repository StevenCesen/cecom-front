export default function useGenerateQR({string,selector}) {
    let qrcode = new QRCode(selector, {
        text: `${string}`,
        width: 250, //default 128
        height: 250,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}