document.addEventListener("DOMContentLoaded", function () {
    const cartas = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'];
    const tablero = document.getElementById('tablero');
    const botonReiniciar = document.getElementById('botonReiniciar');
    let cartasVolteadas = [];
    let cartasCompletadas = [];

    // Inicializar
    function iniciarJuego() {
        cartasCompletadas = [];
        cartasVolteadas = [];
        dibujarTablero();
    }

    // Barajar
    function barajar(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Tablero
    function dibujarTablero() {
        tablero.innerHTML = '';
        const cartasBarajadas = barajar(cartas.concat(cartas));
        cartasBarajadas.forEach(function (carta, indice) {
            const cartaElemento = document.createElement('div');
            cartaElemento.classList.add('cartas');
            cartaElemento.dataset.indice = indice;
            cartaElemento.dataset.carta = carta;
            cartaElemento.textContent = '';
            cartaElemento.addEventListener('click', voltearCarta);
            tablero.appendChild(cartaElemento);
        });
    }

    // Volterar carta
    function voltearCarta() {
        const indiceCarta = this.dataset.indice;
        if (!cartasVolteadas.includes(indiceCarta) && !cartasCompletadas.includes(indiceCarta) && cartasVolteadas.length < 2) {
            cartasVolteadas.push(indiceCarta);
            this.textContent = this.dataset.carta;
            if (cartasVolteadas.length === 2) {
                setTimeout(verificarCoincidencia, 1000);
            }
        }
    }

    // Verificar coincidencia
    function verificarCoincidencia() {
        const [primeraCarta, segundaCarta] = cartasVolteadas;
        if (tablero.children[primeraCarta].dataset.carta === tablero.children[segundaCarta].dataset.carta) {
            cartasCompletadas.push(primeraCarta, segundaCarta);
            if (cartasCompletadas.length === cartas.length * 2) {
                alert('¡Felicidades Sos Un Animal!');
                localStorage.removeItem('juegoGuardado');
                iniciarJuego();
            }
        } else {
            tablero.children[primeraCarta].textContent = '';
            tablero.children[segundaCarta].textContent = '';
        }
        cartasVolteadas = [];
    }

    // Botón de reinicio
    botonReiniciar.addEventListener('click', function () {
        iniciarJuego();
    });

    // Iniciar o cargar guardado
    if (localStorage.getItem('juegoGuardado')) {
        const juegoGuardado = JSON.parse(localStorage.getItem('juegoGuardado'));
        cartas = juegoGuardado.cartas;
        cartasVolteadas = juegoGuardado.cartasVolteadas;
        cartasCompletadas = juegoGuardado.cartasCompletadas;
        dibujarTablero();
    } else {
        iniciarJuego();
    }

    // Guardar el juego cuando se cierre
    window.addEventListener('beforeunload', function () {
        const juegoGuardado = {
            cartas: cartas,
            cartasVolteadas: cartasVolteadas,
            cartasCompletadas: cartasCompletadas
        };
        localStorage.setItem('juegoGuardado', JSON.stringify(juegoGuardado));
    });
});