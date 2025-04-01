export default function CardInformationAdditional({content}){
    const template=`
        <div class="CardInformationAdditional">
            <label>
                Nombre del campo
                <input type="text" value="NOTA">
            </label>
            <label>
                Información
                <textarea></textarea>
            </label>
        </div>
    `;

    content.insertAdjacentHTML('beforeend',template);
}