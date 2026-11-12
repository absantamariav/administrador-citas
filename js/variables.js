import AdminCitas from './AdminCitas.js';

export const citas = new AdminCitas();

export const citaObj = {
    id: Date.now(),
    paciente: '',
    propietario: '',
    email: '',
    fecha: '',
    sintomas: '',
}

export const state = {
    editando: false,
    DB: null
}