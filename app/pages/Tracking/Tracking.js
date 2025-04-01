export default async function Tracking({app}){
    const template=`
        <div class="Products">
            <div class="Products__nav">
                <h3>Seguimiento de envíos</h3>
                <label>
                    Estado
                    <select>
                        <option>-- Seleccionar --</option>
                        <option>Por confirmar</option>
                        <option>Despachado</option>
                        <option>En tránsito</option>
                        <option>Recibidos</option>
                    </select>
                </label>
            </div>
            
            <span class="Products__subtitle"> items encontrados</span>
        
            <div class="Tracking__list">
                <div class="Tracking__item">
                    <div class="Tracking__itemHead">
                        <h2>Envío ENV-1</h2>
                        <p>En tránsito</p>
                    </div>

                    <div class="Tracking__itemLine">
                    
                    </div>

                    <div class="Tracking__itemDetails">
                        <h3>Detalles</h3>
                        <span>Información detallada sobre el envío del paquete</span>

                        <div class="Tracking__itemDIrection">
                            <h3>Destino</h3>
                            <div>
                                <label>Ciudad de entrega:</label>
                                <label>LOJA</label>
                            </div>
                            <div>
                                <label>Dirección de entrega:</label>
                                <label>AV. Manuel Agustín Aguirre y Maximiliano Rodríguez</label>
                            </div>
                            <div>
                                <label>Teléfono:</label>
                                <label>+593978950498</label>
                            </div>
                        </div>

                        <div class="Tracking__itemHistorial">
                            <h3>Historial de eventos</h3>
                            <div>
                                <strong>Paquete en ruta a centro logístico</strong>
                                <p>25/03/2025, 10:30</p>
                            </div>
                            <div>
                                <strong>Paquete despachado</strong>
                                <p>24/03/2025, 20:30</p>
                            </div>
                            <div>
                                <strong>Paquete confirmado por el proveedor</strong>
                                <p>24/03/2025, 10:30</p>
                            </div>
                            <div>
                                <strong>Pedido registrado</strong>
                                <p>23/03/2025, 19:30</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="Tracking__item">
                    <div class="Tracking__itemHead">
                        <h2>Envío ENV-1</h2>
                        <p>En tránsito</p>
                    </div>

                    <div class="Tracking__itemLine">
                    
                    </div>

                    <div class="Tracking__itemDetails">
                        <h3>Detalles</h3>
                        <span>Información detallada sobre el envío del paquete</span>

                        <div class="Tracking__itemDIrection">
                            <h3>Destino</h3>
                            <div>
                                <label>Ciudad de entrega:</label>
                                <label>LOJA</label>
                            </div>
                            <div>
                                <label>Dirección de entrega:</label>
                                <label>AV. Manuel Agustín Aguirre y Maximiliano Rodríguez</label>
                            </div>
                            <div>
                                <label>Teléfono:</label>
                                <label>+593978950498</label>
                            </div>
                        </div>

                        <div class="Tracking__itemHistorial">
                            <h3>Historial de eventos</h3>
                            <div>
                                <strong>Paquete en ruta a centro logístico</strong>
                                <p>25/03/2025, 10:30</p>
                            </div>
                            <div>
                                <strong>Paquete despachado</strong>
                                <p>24/03/2025, 20:30</p>
                            </div>
                            <div>
                                <strong>Paquete confirmado por el proveedor</strong>
                                <p>24/03/2025, 10:30</p>
                            </div>
                            <div>
                                <strong>Pedido registrado</strong>
                                <p>23/03/2025, 19:30</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    `;

    app.insertAdjacentHTML('beforeend',template);
}