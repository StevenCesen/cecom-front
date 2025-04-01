import Push from "../components/Push/Push.js";

export default async function useClickToCopy(element){
    try {
        await navigator.clipboard.writeText(element);

        Push({
            text:'Copiado en el portapapeles'
        });

    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}