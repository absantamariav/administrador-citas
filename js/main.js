//selectores
const pacienteInput = document.querySelector('#paciente');
const propietarioInput = document.querySelector('#propietario');
const emailInput = document.querySelector('#email');
const fechaInput = document.querySelector('#fecha');
const sintomasInput = document.querySelector('#sintomas');
const formulario = document.querySelector('#formulario-cita');
const contenedorCitas = document.querySelector('#citas')

//eventos
pacienteInput.addEventListener('change', datosCita);
propietarioInput.addEventListener('change', datosCita);
emailInput.addEventListener('change', datosCita);
fechaInput.addEventListener('change', datosCita);
sintomasInput.addEventListener('change', datosCita);
formulario.addEventListener('submit', submitCita);

//objetos
const citaObj = {
    id: Date.now(),
    paciente: '',
    propietario: '',
    email: '',
    fecha: '',
    sintomas: '',
}

//clases
class Notificacion {
    constructor({ texto, tipo }) {
        this.texto = texto
        this.tipo = tipo

        this.mostrarAlerta();
    }
    mostrarAlerta() {
        const existeAlerta = formulario.parentElement.querySelector('div[data-type="alerta"]');
        existeAlerta?.remove();

        const alerta = document.createElement('div');
        alerta.classList.add('text-center', 'w-full', 'p-3', 'text-white',
            'my-5', 'alert', 'uppercase', 'font-bold', 'text-sm');

        this.tipo === 'error' ? alerta.classList.add('bg-red-500') : alerta.classList.add('bg-green-500');

        alerta.textContent = this.texto;
        alerta.dataset.type = 'alerta';
        formulario.parentElement.insertBefore(alerta, formulario);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

class AdminCitas {
    constructor() {
        this.listaCitas = []
    }

    agregarCita(citaObj) {
        this.listaCitas.push({ ...citaObj });
        this.mostrarCitas();
    }

    mostrarCitas() {
        while (contenedorCitas.firstElementChild) {
            contenedorCitas.firstElementChild.remove();
        }
        if (this.listaCitas.length === 0) {
            const p = document.createElement('P');
            p.classList.add('text-xl', 'mt-5', 'mb-10', 'text-center');
            p.textContent = 'No Hay Pacientes';
            contenedorCitas.appendChild(p);
            return
        }
        this.listaCitas.forEach(cita => {
            const divCita = document.createElement('DIV');
            divCita.classList.add('mx-5', 'my-10', 'bg-white', 'shadow-md', 'px-5', 'py-10', 'rounded-xl');

            function crearParrafo(etiqueta) {
                const parrafo = document.createElement('P');
                parrafo.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case');
                parrafo.innerHTML = `<span class="font-bold uppercase">${etiqueta}: </span> ${cita[etiqueta]}`;
                return parrafo;
            }

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('py-2', 'px-10', 'bg-indigo-600', 'hover:bg-indigo-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
            btnEditar.innerHTML = 'Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
            btnEditar.onclick = () => cargarEdicionCita({ ...cita });

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('py-2', 'px-10', 'bg-red-600', 'hover:bg-red-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
            btnEliminar.onclick = () => this.eliminarCita(cita.id);

            const contenedorBotones = document.createElement('DIV');
            contenedorBotones.classList.add('flex', 'justify-between', 'mt-10');

            contenedorBotones.appendChild(btnEditar);
            contenedorBotones.appendChild(btnEliminar);

            divCita.appendChild(crearParrafo('paciente'));
            divCita.appendChild(crearParrafo('propietario'));
            divCita.appendChild(crearParrafo('email'));
            divCita.appendChild(crearParrafo('fecha'));
            divCita.appendChild(crearParrafo('sintomas'));
            divCita.appendChild(contenedorBotones);

            contenedorCitas.appendChild(divCita);
        })
    }

    editarCita(citaActualizada) {
        this.listaCitas = this.listaCitas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
        this.mostrarCitas();
    }

    eliminarCita(idCita) {
        this.listaCitas = this.listaCitas.filter(cita => cita.id !== idCita);
        this.mostrarCitas();
    }
}

//funciones
function datosCita(e) {
    if (e.target.name !== 'fecha') {
        e.target.value = e.target.value.trim();
    }
    citaObj[e.target.name] = e.target.value;
}

function submitCita(e) {
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

function reiniciarCitaObj() {
    Object.keys(citaObj).forEach(key => {
        citaObj[key] = "";
    })
    citaObj.id = Date.now();
}

function cargarEdicionCita(cita) {

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

//instancias
const citas = new AdminCitas();

const state = {
    editando: false
}