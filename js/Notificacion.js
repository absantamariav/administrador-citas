import { formulario } from './selectores.js'

export default class Notificacion {
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