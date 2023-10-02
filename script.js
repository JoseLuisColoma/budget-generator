document.addEventListener('DOMContentLoaded', function () {
    // Obtener la fecha actual y establecerla en el elemento con id "fecha-actual"
    const fechaActualElement = document.getElementById('fecha-actual');
    const fechaActual = new Date().toLocaleDateString('es-ES');
    fechaActualElement.textContent = fechaActual;
});

function agregarFila() {
    const tbody = document.querySelector('tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td style="text-align: left;" class="tabla-principal-descripcion" contenteditable="true">Nuevo elemento</td>
        <td class="tabla-principal-uds" contenteditable="true">0</td>
        <td class="tabla-principal-precioUd" contenteditable="true">0.00</td>
        <td class="tabla-principal-precioTotal" contenteditable="true">0.00 €</td>
    `;
    tbody.appendChild(newRow);

    // Recalcular los totales cuando se agrega una fila
    calcularTotales();
}

// Event listener para calcular precios totales al editar
document.addEventListener('input', function (e) {
    if (e.target.classList.contains('tabla-principal-uds') || e.target.classList.contains('tabla-principal-precioUd')) {
        calcularPrecioTotal(e.target.parentElement);
    }
});

function calcularPrecioTotal(row) {
    const uds = parseFloat(row.querySelector('.tabla-principal-uds').textContent) || 0;
    const precioUd = parseFloat(row.querySelector('.tabla-principal-precioUd').textContent.replace(',', '.')) || 0;
    const precioTotal = uds * precioUd;
    row.querySelector('.tabla-principal-precioTotal').textContent = `${precioTotal.toFixed(2)} €`;

    // Recalcular totales globales
    calcularTotales();
}

function calcularTotales() {
    const filas = document.querySelectorAll('tbody tr');
    let subtotal = 0;

    filas.forEach((fila) => {
        const precioTotal = parseFloat(fila.querySelector('.tabla-principal-precioTotal').textContent.replace(' €', '')) || 0;
        subtotal += precioTotal;
    });

    const iva = subtotal * 0.21;

    // Actualizar el valor del subtotal en el HTML
    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)} €`;

    // Actualizar los valores de IVA y total
    document.getElementById('iva').textContent = `${iva.toFixed(2)} €`;
    const total = subtotal + iva;
    document.getElementById('total').textContent = `${total.toFixed(2)} €`;

    // Actualizar el valor del 50% del total en tiempo real
    const cincuentaPorCientoTotal = obtener50PorCientoPrecioTotal();

    if (cincuentaPorCientoTotal !== '0.00') {
        // Actualizar el valor en las posiciones requeridas
        document.querySelectorAll('.dato-pago-cliente-derecha-50 p').forEach((p) => {
            p.textContent = `${cincuentaPorCientoTotal} €`;
        });
    }
}

// Llamar a calcularTotales al cargar la página
window.addEventListener('load', () => {
    calcularTotales();
});


// Llamar a calcularTotales al cargar la página
window.addEventListener('load', () => {
    calcularTotales();
});



function actualizarGastosDeEnvio(subtotal) {
    const gastosDeEnvioRow = document.querySelector('.tabla-principal-gastos-de-envio');
    if (gastosDeEnvioRow) {
        const gastosDeEnvio = parseFloat(gastosDeEnvioRow.querySelector('.tabla-principal-precioTotal').textContent.replace(' €', '')) || 0;
        const nuevoPrecioTotal = gastosDeEnvio + subtotal;
        gastosDeEnvioRow.querySelector('.tabla-principal-precioTotal').textContent = `${nuevoPrecioTotal.toFixed(2)} €`;
    }
}

// Función para obtener el 50% del total
function obtener50PorCientoPrecioTotal() {
    const totalElement = document.getElementById('total');
    const totalText = totalElement.textContent;
    const totalAmount = parseFloat(totalText.replace(' €', ''));
    const resultado = '0.00';

    if (!isNaN(totalAmount)) {
        const cincuentaPorCiento = totalAmount * 0.5;
        let resultado = cincuentaPorCiento.toFixed(2);
        return resultado;
    }

    return resultado;
}

function activarDatosPagoCliente() {
    const datosPagoCliente = document.querySelector('.datos-pago-cliente');
    const activarButton = document.querySelector('.activar-datos-pago-cliente');

    if (datosPagoCliente.style.display === 'none' || datosPagoCliente.style.display === '') {
        datosPagoCliente.style.display = 'flex';
        activarButton.style.display = 'none'; // Ocultar el botón al activar

        // Mostrar "PAGO 1" y "PAGO 2"
        document.querySelectorAll('.dato-pago-cliente-derecha-50 p').forEach((p) => {
            p.style.display = 'block';
        });
    }
}

