/*
* Nombre: JESUS ANGEL RUIZ GONZALEZ
* Fecha: 05/11/2024 
* Modulo: DWEC
* UD2 
* Tarea: TE DWEC02 - Tarea de Evaluación - Página para cálculo de costos de viaje
*/

class gastoCombustible {
    constructor(vehicleType, date, kilometers, precioViaje) {
        this.vehicleType = vehicleType;
        this.date = date.toISOString();
        this.kilometers = kilometers;
        this.precioViaje = precioViaje;
    }

    convertToJSON(){
        return JSON.stringify(this);
    }
}

export default gastoCombustible;