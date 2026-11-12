import { contenedorCitas } from "./selectores.js";
import { cargarEdicionCita, eliminarCita } from "./funciones.js";
import { state, citaObj } from "./variables.js";

export default class AdminCitas {
    agregarCita() {
        // Insertar registro en indexeddb
        const transaction = state.DB.transaction(['citasTabla'], 'readwrite');
        const objectStore = transaction.objectStore('citasTabla');
        objectStore.add(citaObj);

        transaction.oncomplete = function () {
            console.log('Transaccion exitosa. Datos guardados');
        }
        transaction.onerror = function () {
            console.log('Transaccion abortada.');
        }
        this.mostrarCitas();
    }

    mostrarCitas() {
        while (contenedorCitas.firstElementChild) {
            contenedorCitas.firstElementChild.remove();
        }

        // Leer contenido de la base de datos
        const transaccion = state.DB.transaction(['citasTabla'], 'readonly');
        const objectStore = transaccion.objectStore('citasTabla');
        const request = objectStore.openCursor(null, "prev");

        request.onerror = function () {
            console.log('error al buscar registros o no hay registros');
        }

        request.onsuccess = function (e) {
            const cursor = e.target.result;

            if (cursor) {
                const divCita = document.createElement('DIV');
                divCita.classList.add('mx-5', 'my-10', 'bg-white', 'shadow-md', 'px-5', 'py-10', 'rounded-xl');

                function crearParrafo(etiqueta) {
                    const parrafo = document.createElement('P');
                    parrafo.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case');
                    parrafo.innerHTML = `<span class="font-bold uppercase">${etiqueta}: </span> ${cursor.value[etiqueta]}`;
                    return parrafo;
                }

                const btnEditar = document.createElement('button');
                btnEditar.classList.add('py-2', 'px-10', 'bg-indigo-600', 'hover:bg-indigo-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
                btnEditar.innerHTML = 'Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
                const citaActualizar = cursor.value;
                btnEditar.onclick = () => cargarEdicionCita(citaActualizar);

                const btnEliminar = document.createElement('button');
                btnEliminar.classList.add('py-2', 'px-10', 'bg-red-600', 'hover:bg-red-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
                btnEliminar.innerHTML = 'Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
                const citaId = cursor.key;
                btnEliminar.onclick = () => eliminarCita(citaId);

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

                cursor.continue();
            } else if (!contenedorCitas.firstElementChild) {
                const p = document.createElement('P');
                p.classList.add('text-xl', 'mt-5', 'mb-10', 'text-center');
                p.textContent = 'No Hay Pacientes';
                contenedorCitas.appendChild(p);
            }
        }
    }

    editarCita() {
        const transaccion = state.DB.transaction(['citasTabla'], 'readwrite');
        const store = transaccion.objectStore('citasTabla');
        store.put(citaObj)

        transaccion.oncomplete = function () {
            console.log('Transaccion exitosa. Registro actualizado');
        }
        transaccion.onerror = function () {
            console.log('Transaccion abortada');
        }
        this.mostrarCitas();
    }

    eliminarCita(idCita) {
        const transaccion = state.DB.transaction(['citasTabla'], 'readwrite');
        const store = transaccion.objectStore('citasTabla');
        store.delete(idCita);

        transaccion.oncomplete = function () {
            console.log('Transaccion exitosa. Registro Eliminado');
        }
        transaccion.onerror = function () {
            console.log('Transaccion abortada');
        }
        this.mostrarCitas();
    }
}