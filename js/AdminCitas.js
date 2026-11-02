import { contenedorCitas } from "./selectores.js";
import { cargarEdicionCita, sincronizarStorage } from "./funciones.js";

export default class AdminCitas {
    constructor() {
        this.listaCitas = []
    }

    agregarCita(citaObj) {
        this.listaCitas.push({ ...citaObj });
        this.mostrarCitas();
        sincronizarStorage();
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
        sincronizarStorage();
    }

    eliminarCita(idCita) {
        this.listaCitas = this.listaCitas.filter(cita => cita.id !== idCita);
        this.mostrarCitas();
        sincronizarStorage();
    }
}