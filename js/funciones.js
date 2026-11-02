import {
    formulario,
    pacienteInput,
    propietarioInput,
    emailInput,
    fechaInput,
    sintomasInput
} from "./selectores.js";

import { citaObj, state, citas } from "./variables.js";
import Notificacion from './Notificacion.js'

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
        citas.editarCita({ ...citaObj });
        new Notificacion({
            texto: 'Cita Actualizada correctamente',
            tipo: 'exito'
        })
        state.editando = false;
        formulario.querySelector('input[type="submit"]').value = "Registrar Paciente";
    } else {
        citas.agregarCita({ ...citaObj });
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

export function sincronizarStorage() {
    if (citas.listaCitas.length === 0) {
        localStorage.clear();
    } else {
        localStorage.setItem('citas', JSON.stringify(citas.listaCitas));
    }
}