import {
    formulario,
    pacienteInput,
    propietarioInput,
    emailInput,
    fechaInput,
    sintomasInput
} from "./selectores.js";

import { citaObj, state, citas } from "./variables.js";
import Notificacion from './Notificacion.js';

export function datosCita(e) {
    if (e.target.name !== 'fecha') {
        e.target.value = e.target.value.trim();
    }
    citaObj[e.target.name] = e.target.value;
}

export function submitCita(e) {
    e.preventDefault();
    if (Object.values(citaObj).some(valor => valor === '')) {
        new Notificacion({
            texto: 'Todos los campos son obligatorios',
            tipo: 'error'
        })
        return;
    }

    if (state.editando) {
        citas.editarCita();
        new Notificacion({
            texto: 'Cita Actualizada correctamente',
            tipo: 'exito'
        })
        state.editando = false;
        formulario.querySelector('input[type="submit"]').value = "Registrar Paciente";
    } else {
        citas.agregarCita();
        new Notificacion({
            texto: 'Paciente registrado',
            tipo: 'exito'
        })
    }

    formulario.reset();
    reiniciarCitaObj();
}

export function reiniciarCitaObj() {
    Object.keys(citaObj).forEach(key => {
        citaObj[key] = "";
    })
    citaObj.id = Date.now();
}

export function cargarEdicionCita(cita) {

    Object.assign(citaObj, cita);

    const { paciente, propietario, email, fecha, sintomas } = cita;
    pacienteInput.value = paciente;
    propietarioInput.value = propietario;
    emailInput.value = email;
    fechaInput.value = fecha;
    sintomasInput.value = sintomas;

    state.editando = true;

    formulario.querySelector('input[type="submit"]').value = "Actualizar Datos";
}

export function eliminarCita(citaId) {
    citas.eliminarCita(citaId);
    new Notificacion({
        texto: 'Registro Eliminado',
        tipo: 'exito'
    })
}

export function crearDB() {
    const crearDB = window.indexedDB.open('citasDB', 1);

    crearDB.onerror = function (e) {
        console.log('Error en la petición para crear la base de datos', e.target.error);
    }

    crearDB.onsuccess = function (e) {
        state.DB = crearDB.result;
        citas.mostrarCitas();
    }

    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result;

        // Definir la 'tabla' - almacen de objetos
        const almacenObjetos = db.createObjectStore('citasTabla', {
            keyPath: 'id',
            autoIncrement: true
        });

        // Definir las 'columnas' de la tabla citasTabla - indices
        almacenObjetos.createIndex('id', 'id', { unique: true });
        almacenObjetos.createIndex('paciente', 'paciente', { unique: false });
        almacenObjetos.createIndex('propietario', 'propietario', { unique: false });
        almacenObjetos.createIndex('email', 'email', { unique: false });
        almacenObjetos.createIndex('fecha', 'fecha', { unique: false });
        almacenObjetos.createIndex('sintomas', 'sintomas', { unique: false });
    }
}