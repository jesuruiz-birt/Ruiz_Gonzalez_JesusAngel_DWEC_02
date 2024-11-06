/*
* Nombre: JESUS ANGEL RUIZ GONZALEZ
* Fecha: 05/11/2024 
* Modulo: DWEC
* UD2 
* Tarea: TE DWEC02 - Tarea de Evaluación - Página para cálculo de costos de viaje
*/

"use strict";

// Importamos la clase
import gastoCombustible from "../components/gastoCombustible.js";

// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = './data/tarifasCombustible.json';
let gastosJSONpath = './data/gastosCombustible.json';

// Declaro el array como global para poder sumar los gastos recientes.
let aniosArray = null;
let gastosRecientes = '';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    // array asociativo con clave=año y valor=gasto total
    aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    }

    // Iteramos para agrupar por la fecha
    gastosJSON.forEach(element => {
        const anio = new Date(element.date).getFullYear();
        const valor = element.precioViaje;

        if(!aniosArray[anio]) {
            aniosArray[anio] = 0;
        }
        aniosArray[anio] += valor;

    });

    for (const anio in aniosArray) {

        document.getElementById(anio).innerHTML = `<li id=${anio}>El gasto para el año ${anio} es <span id="${aniosArray[anio].toFixed(2)}">${aniosArray[anio].toFixed(2)}</span></li>`;

    }
    
}

// guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault(); 

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value);
    const kilometros = parseFloat(document.getElementById('kilometers').value);

    let anio = new Date(fecha).getFullYear();

    let precioViaje = calcularPrecioViaje(tipoVehiculo,fecha,kilometros);

    let gasto = new gastoCombustible (tipoVehiculo, fecha, kilometros, precioViaje);
    
    let gastoJSON = gasto.convertToJSON();

    let precioViajeFloat = parseFloat(precioViaje)

    //Añado la cantidad al array para sumar los gastos recientes.
    añadirCantidad(anio, precioViajeFloat);
    
    console.log(typeof precioViajeFloat);

    gastosRecientes += document.getElementById('expense-list').innerHTML = `<li>${gastoJSON}</li>`;

    console.log(typeof gastosRecientes);
    
    document.getElementById('expense-list').innerHTML = gastosRecientes;

    for (const anio in aniosArray) {

        document.getElementById(anio).innerHTML = `<li id=${anio}>El gasto para el año ${anio} es <span id="${aniosArray[anio].toFixed(2)}">${aniosArray[anio].toFixed(2)}</span></li>`;

    }

    // Limpiar Formulario.
    document.getElementById('fuel-form').reset();
}

// Obtenemos el precio por Km dependiendo del año y el tipo de vehículo
function obtenerPrecioCombustible(anio, tipoVehiculo) {
    
    // Iteramos con un ForEach para recuperar el dato de tarifa para el vehiculo seleccionado:
    let tarifaAnual = null;

    tarifasJSON.tarifas.forEach(tarifa => {
        if (tarifa.anio === anio) {
            tarifaAnual = tarifa;
        }
    });
    
    if (!tarifaAnual) {
        console.log('No se encontraron tarifas para el año especificado.');
        return null;
    }

    const tarifaPorKm = tarifaAnual.vehiculos[tipoVehiculo];

    if (!tarifaPorKm) {
        console.log('No se encontraron tarifas para el tipo de vehículo especificado.');
        return null;
    }

    return tarifaPorKm;
}

// Calculamos el precio del viaje 
function calcularPrecioViaje(tipoVehiculo,fecha,kilometros) {
    const anio = new Date(fecha).getFullYear();
    const precioPorKm = obtenerPrecioCombustible(anio, tipoVehiculo);

    if (!precioPorKm) {
        console.log(`No se encontraron tarifas para el año o tipo de vehículo especificados: Año ${anio}, Vehículo ${tipoVehiculo}`);
        return null;
    }

    const precioTotal = kilometros * precioPorKm;
    return precioTotal.toFixed(2);
}

// Añade cada gasto de viaje introducido en el array aniosArray
function añadirCantidad(anio, cantidad) { 
    aniosArray[anio] += cantidad;
}