import {
    pacienteInput,
    propietarioInput,
    emailInput,
    fechaInput,
    sintomasInput,
    formulario,
} from "./selectores.js";

import { datosCita, submitCita } from './funciones.js';
import { citas } from "./variables.js";

//eventos
pacienteInput.addEventListener('change', datosCita);
propietarioInput.addEventListener('change', datosCita);
emailInput.addEventListener('change', datosCita);
fechaInput.addEventListener('change', datosCita);
sintomasInput.addEventListener('change', datosCita);
formulario.addEventListener('submit', submitCita);
document.addEventListener('DOMContentLoaded', () => {
    citas.listaCitas = JSON.parse(localStorage.getItem('citas')) || [];
    citas.mostrarCitas();
})