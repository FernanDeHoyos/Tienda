document.addEventListener('DOMContentLoaded', () => {
    const carrito = document.querySelector('#lista-carrito tbody');
    const btnVaciarCarrito = document.querySelector('#vaciar-carrito');
    const btnComprar = document.querySelector('#comprar');
    const linkCompras = document.querySelector('#link-compras');

    // Cargar productos almacenados al iniciar la página
    cargarProductosCarrito();

    // Eventos
    document.querySelectorAll('.btn-2').forEach(btn => {
        btn.addEventListener('click', agregarProducto);
    });

    btnVaciarCarrito.addEventListener('click', vaciarCarrito);
    btnComprar.addEventListener('click', comprarProductos);
    linkCompras.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarCompras();
    });

    function agregarProducto(e) {
        e.preventDefault();
        const producto = e.target.closest('.general-txt');
        const infoProducto = {
            imagen: producto.querySelector('img').src,
            nombre: producto.querySelector('h3').textContent,
            precio: producto.querySelector('.prices span').textContent,
        };
        console.log('Producto a agregar:', infoProducto);
        insertarCarrito(infoProducto);
    }

    function insertarCarrito(producto) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${producto.imagen}" width="50"></td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td><a href="#" class="borrar-producto">X</a></td>
        `;
        carrito.appendChild(row);
        guardarProductoLocalStorage(producto);
    }

    function vaciarCarrito() {
        while (carrito.firstChild) {
            carrito.removeChild(carrito.firstChild);
        }
        localStorage.removeItem('productos');
    }

    function guardarProductoLocalStorage(producto) {
        let productos = obtenerProductosLocalStorage();
        productos.push(producto);
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    function obtenerProductosLocalStorage() {
        let productos;
        if (localStorage.getItem('productos') === null) {
            productos = [];
        } else {
            productos = JSON.parse(localStorage.getItem('productos'));
        }
        return productos;
    }

    function cargarProductosCarrito() {
        // Limpiar el carrito antes de cargar productos del localStorage
        carrito.innerHTML = '';

        const productos = obtenerProductosLocalStorage();
        productos.forEach(producto => {
            insertarCarrito(producto);
        });
    }

    function comprarProductos() {
        const carritoItems = [];
        const carritoRows = document.querySelectorAll('#lista-carrito tbody tr');

        carritoRows.forEach(row => {
            const imagen = row.querySelector('td:nth-child(1) img').src;
            const nombre = row.querySelector('td:nth-child(2)').textContent;
            const precio = row.querySelector('td:nth-child(3)').textContent;

            carritoItems.push({ imagen, nombre, precio });
        });

        fetch('/guardar-compra', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carritoItems)
        })
        .then(response => response.text())
        .then(data => {
            console.log('Compra guardada exitosamente:', data);
            alert('Compra realizada exitosamente');
            vaciarCarrito();
        })
        .catch(error => {
            console.error('Error al realizar la compra:', error);
            alert('Hubo un error al realizar la compra');
        });
    }

    function mostrarCompras() {
        fetch('/obtener-compras')
        .then(response => response.json())
        .then(compras => {
            const comprasTableBody = document.querySelector('#lista-compras tbody');
            comprasTableBody.innerHTML = '';
            compras.forEach(compra => {
                compra.forEach(producto => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><img src="${producto.imagen}" width="50"></td>
                        <td>${producto.nombre}</td>
                        <td>${producto.precio}</td>
                    `;
                    comprasTableBody.appendChild(row);
                });
            });
            const modalCompras = new bootstrap.Modal(document.getElementById('modalCompras'));
            modalCompras.show();
        })
        .catch(error => {
            console.error('Error al obtener las compras:', error);
            alert('Hubo un error al obtener las compras');
        });
    }
});
