
let carritoDeCompras = []
let stockproductos = []
let basededatos = []
const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');

const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');

const selecTalles = document.getElementById('selecTalles')
const buscador = document.getElementById('search')



//filtro
selecTalles.addEventListener('change', () => {
    console.log(selecTalles.value)
    if (selecTalles.value == 'all') {
        mostrarProductos(basededatos)
    } else {
        mostrarProductos(basededatos.filter(el => el.tipo == selecTalles.value))
        console.log(basededatos.filter(el => el.tipo == selecTalles.value))
    }
})

//Buscador
buscador.addEventListener('input', () => {
    if (buscador.value == "") {
        mostrarProductos(basededatos)
    } else {
        mostrarProductos(basededatos.filter(el => el.nombre.toLowerCase().includes(buscador.value.toLowerCase())))
    }
})


//logica Ecommerce


window.addEventListener("load", async () => {
    const peticion = await fetch("stock.json")
    const data = await peticion.json()

    for (let i = 0; i < data.length; i++) {
        basededatos.push(data[i])
    }
    mostrarProductos(basededatos)
    console.log(basededatos);
})

function mostrarProductos(array) {
    contenedorProductos.innerHTML = '';
    for (const producto of array) {
        let div = document.createElement('div');
        div.className = 'producto';
        div.innerHTML += `<div class="card">
                            <div class="card-image">
                                <img src=${producto.img}>
                                <span class="card-title">${producto.nombre}</span>
                                <a id="botonAgregar${producto.id}" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add_shopping_cart</i></a>
                            </div>
                            <div class="card-content">
                                <p>${producto.desc}</p>
                                <p>Km: ${producto.km}</p>
                                <p> $${producto.precio}</p>
                            </div>
                        </div> `

        contenedorProductos.appendChild(div);


        let btnAgregar = document.getElementById(`botonAgregar${producto.id}`)
        // console.log(btnAgregar)

        btnAgregar.addEventListener('click', () => {

            agregarAlCarrito(producto.id)
        })
    }

}


function agregarAlCarrito(id) {
    let repetido = carritoDeCompras.find(item => item.id == id)
    if (repetido) {
        console.log(repetido);
        repetido.cantidad = repetido.cantidad + 1
        document.getElementById(`cantidad${repetido.id}`).innerHTML = `<p id= cantidad${repetido.id}>Cantidad:${repetido.cantidad}</p>`
        actualizarCarrito()
    } else {

        let productoAgregar = basededatos.find(elemento => elemento.id == id)
        // console.log(productoAgregar)
        carritoDeCompras.push(productoAgregar)
        actualizarCarrito()
        let div = document.createElement('div')
        div.className = 'productoEnCarrito'
        div.innerHTML = `
                        <p>${productoAgregar.nombre}</p>
                        <p>Precio: $${productoAgregar.precio}</p>
                        <p id= cantidad${productoAgregar.id}>Cantidad:${productoAgregar.cantidad}</p>
                        <button id=botonEliminar${productoAgregar.id} class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `
        contenedorCarrito.appendChild(div)

        let btnEliminar = document.getElementById(`botonEliminar${productoAgregar.id}`)
        btnEliminar.addEventListener('click', () => {
            console.log(productoAgregar.id);
            btnEliminar.parentElement.remove()
            carritoDeCompras = carritoDeCompras.filter(elemento => elemento.id != productoAgregar.id)
            actualizarCarrito()
            localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
        })
    }

    localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
}




function actualizarCarrito() {
    contadorCarrito.innerText = carritoDeCompras.reduce((acc, el) => acc + el.cantidad, 0)
    precioTotal.innerText = carritoDeCompras.reduce((acc, el) => acc + (el.precio * el.cantidad), 0)
}


function recuperar() {
    let recuperarLS = JSON.parse(localStorage.getItem('carrito'))
    console.log(recuperarLS);
    if (recuperarLS) {
        recuperarLS.forEach(element => {
            agregarAlCarrito(element.id)
        });
    }
}

recuperar()

function mostrar(){
    alert ('compra finalizada')
    
}
