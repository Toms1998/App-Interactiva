const API_KEY = '8bdd5d23e63eb5b1bacdfb9f2ae5b669';
const url = 'https://api.themoviedb.org/3/trending/movie/day?api_key=8bdd5d23e63eb5b1bacdfb9f2ae5b669';
const moviesContainer = document.querySelector('.grid');

const navItems = document.querySelector('#nav__items');
const openNavItems = document.querySelector('#bmenu');
const openCart = document.querySelector('.cart');

const cart = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');

let peliculasCarrito = [];

document.addEventListener('DOMContentLoaded', consultarApi());

function consultarApi() {
    fetch(url)
        .then(response => response.json())
        .then(data => llamarPeliculas(data.results))

}

function llamarPeliculas(peliculas) {
    peliculas.forEach(pelicula => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
        <div class="img-container">
            <img src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}">
        </div>

        <div class="info-container">
            <h4>${pelicula.original_title}</h4>
            <p><strong>Release Date:</strong> ${pelicula.release_date}</p>
            <p><strong>Popularity:</strong> ${pelicula.popularity}<span class="person material-icons">&#xe7fd;</span></p>
            <p><strong>Original Language:</strong> ${pelicula.original_language}<span class="person material-icons">&#xe894;</span></p>
            <p>${pelicula.overview}</p>
            <p>Buy it for <strong class="precio">$15</strong><span class="material-icons">&#xef63;</span></p>
            <button class="añadir-carrito button" data-id="${pelicula.id}">Añadir al Carro</button>
        </div>
        `;
        moviesContainer.appendChild(movieCard);
    })
}


openCart.onclick = () => {
    if (cart.style.display === 'none') {
        cart.style.display = 'flex';
    } else {
        cart.style.display = 'none'
    }
}

openNavItems.addEventListener('click', () => {
    if (navItems.style.display === 'none') {
        navItems.style.display = 'flex';
    } else {
        navItems.style.display = 'none';
    }
});


// Carrito
cargarEventListeners();

function cargarEventListeners() {
    moviesContainer.addEventListener('click', agregarPelicula);
    carrito.addEventListener('click', eliminarPelicula);
    vaciarCarritoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        peliculasCarrito = []; // vaciamos el arreglo

        limpiarHTML();
    })
}

function agregarPelicula(e) {
    e.preventDefault();
    if (e.target.classList.contains('añadir-carrito')) {
        const peliculaSeleccionada = e.target.parentElement.parentElement;
        leerDatosPelicula(peliculaSeleccionada);
    }
}

// elimina una pelicula del carrito
function eliminarPelicula(e) {
    if (e.target.classList.contains('borrar-pelicula')) {
        const peliculaId = e.target.getAttribute('data-id');

        // elimina del arreglo de peliculasCarrito por el data-id
        peliculasCarrito = peliculasCarrito.filter( pelicula => pelicula.id !== peliculaId);

        carritoHTML();
    }
}

// Lee el contenido del HTML al que le dimos click y extrae la info
function leerDatosPelicula(pelicula) {

    // crear un objeto con el contenido de la pelicula actual
    const infoPelicula = {
        imagen: pelicula.querySelector('.img-container img').src,
        titulo: pelicula.querySelector('.info-container h4').textContent,
        precio: pelicula.querySelector('.info-container p .precio').textContent,
        id: pelicula.querySelector('.info-container button').getAttribute('data-id'),
        cantidad: 1

    }

    // revisa si un elemento ya existe en el carrit
    const existe = peliculasCarrito.some(pelicula => pelicula.id === infoPelicula.id)
    if (existe) {

        const peliculas = peliculasCarrito.map(pelicula => {
            if (pelicula.id === infoPelicula.id) {
                pelicula.cantidad++;
                return pelicula;
            } else {
                return pelicula;
            }
        })
        peliculasCarrito = [...peliculas];

    } else {

        // agrega elementos al arreglo de carrito
        peliculasCarrito = [...peliculasCarrito, infoPelicula];
    }


    carritoHTML();
}

// Muestra el carrito de compras en el HTML
function carritoHTML() {

    // limpiar el HTML previo
    limpiarHTML();

    peliculasCarrito.forEach(pelicula => {
        const box = document.createElement('tr');
        box.innerHTML = `
            <td>
                <img src="${pelicula.imagen}">
            </td>
            <td>${pelicula.titulo}</td>
            <td>${pelicula.precio}</td>
            <td>${pelicula.cantidad}</td>
            <td>
                <a href="#" class="borrar-pelicula" data-id="${pelicula.id}"> X </a>
            </td>
        `;

        // agrega el html del carrito en el TBODY
        contenedorCarrito.appendChild(box);
    })
}

function limpiarHTML() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}