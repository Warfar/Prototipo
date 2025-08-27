document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de Inventario cargada completamente.');

    // --- Funcionalidad del Modal ---
    const addProductoBtn = document.getElementById('addProductoBtn');
    const productoModal = document.getElementById('productoModal');
    const closeButton = productoModal.querySelector('.close-button');
    const modalTitle = document.getElementById('modalTitle');
    const productoForm = document.getElementById('productoForm');

    let currentEditingProductId = null; // Para saber si estamos editando o añadiendo

    // Abrir modal para añadir producto
    addProductoBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Añadir Nuevo Producto';
        productoForm.reset(); // Limpiar el formulario
        currentEditingProductId = null;
        productoModal.style.display = 'flex'; // Usar flex para centrado
    });

    // Cerrar modal
    closeButton.addEventListener('click', () => {
        productoModal.style.display = 'none';
    });

    // Cerrar modal si se hace click fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === productoModal) {
            productoModal.style.display = 'none';
        }
    });

    // --- Simulación de Datos y Funcionalidad CRUD ---
    let productos = [
        { id: 'P001', nombre: 'Arroz Blanco', categoria: 'alimentos', cantidad: 50, unidad: 'Kg', fechaCaducidad: '2025-12-31', estado: 'disponible' },
        { id: 'P002', nombre: 'Leche Entera', categoria: 'bebidas', cantidad: 120, unidad: 'Litros', fechaCaducidad: '2024-07-20', estado: 'disponible' },
        { id: 'P003', nombre: 'Pasta (Macarrones)', categoria: 'alimentos', cantidad: 0, unidad: 'Paquetes', fechaCaducidad: '2026-03-10', estado: 'agotado' },
        { id: 'P004', nombre: 'Jabón de Manos', categoria: 'higiene', cantidad: 30, unidad: 'Unidades', fechaCaducidad: '2027-01-01', estado: 'disponible' },
        { id: 'P005', nombre: 'Lentejas', categoria: 'alimentos', cantidad: 15, unidad: 'Kg', fechaCaducidad: '2024-06-15', estado: 'caducado' },
        { id: 'P006', nombre: 'Detergente Ropa', categoria: 'limpieza', cantidad: 10, unidad: 'Litros', fechaCaducidad: '2025-09-01', estado: 'disponible' },
    ];

    const inventarioTableBody = document.getElementById('inventarioTableBody');
    const filterCategoria = document.getElementById('filterCategoria');
    const filterEstado = document.getElementById('filterEstado');

    function renderProductos() {
        inventarioTableBody.innerHTML = ''; // Limpiar tabla

        const categoriaSeleccionada = filterCategoria.value;
        const estadoSeleccionado = filterEstado.value;

        const filteredProductos = productos.filter(producto => {
            const matchCategoria = categoriaSeleccionada === 'all' || producto.categoria === categoriaSeleccionada;
            const matchEstado = estadoSeleccionado === 'all' || producto.estado === estadoSeleccionado;
            return matchCategoria && matchEstado;
        });

        filteredProductos.forEach(producto => {
            const row = inventarioTableBody.insertRow();
            row.dataset.id = producto.id; // Para identificar la fila al editar/eliminar

            let statusClass = '';
            let statusText = '';
            switch (producto.estado) {
                case 'disponible':
                    statusClass = 'status-disponible';
                    statusText = 'Disponible';
                    break;
                case 'agotado':
                    statusClass = 'status-agotado';
                    statusText = 'Agotado';
                    break;
                case 'caducado':
                    statusClass = 'status-caducado';
                    statusText = 'Caducado';
                    break;
                default:
                    statusClass = '';
                    statusText = producto.estado;
            }

            row.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.categoria.charAt(0).toUpperCase() + producto.categoria.slice(1)}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.unidad}</td>
                <td>${producto.fechaCaducidad || 'N/A'}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td class="actions">
                    <button class="btn-icon edit-btn" data-id="${producto.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-btn" data-id="${producto.id}"><i class="fas fa-trash-alt"></i></button>
                    <button class="btn-icon view-btn" data-id="${producto.id}"><i class="fas fa-eye"></i></button>
                </td>
            `;
        });

        addEventListenersToTableButtons();
    }

    function addEventListenersToTableButtons() {
        // Editar
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                const producto = productos.find(p => p.id === id);
                if (producto) {
                    modalTitle.textContent = 'Editar Producto';
                    document.getElementById('nombreProducto').value = producto.nombre;
                    document.getElementById('categoriaProducto').value = producto.categoria;
                    document.getElementById('cantidadProducto').value = producto.cantidad;
                    document.getElementById('unidadProducto').value = producto.unidad;
                    document.getElementById('fechaCaducidad').value = producto.fechaCaducidad;
                    document.getElementById('estadoProducto').value = producto.estado;
                    currentEditingProductId = id;
                    productoModal.style.display = 'flex';
                }
            };
        });

        // Eliminar
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm('¿Estás seguro de que quieres eliminar este producto del inventario?')) {
                    productos = productos.filter(p => p.id !== id);
                    renderProductos();
                    console.log(`Producto con ID ${id} eliminado.`);
                }
            };
        });

        // Ver Detalles
        document.querySelectorAll('.view-btn').forEach(button => {
            button.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                const producto = productos.find(p => p.id === id);
                if (producto) {
                    alert(`Detalles del Producto:\nID: ${producto.id}\nNombre: ${producto.nombre}\nCategoría: ${producto.categoria}\nCantidad: ${producto.cantidad} ${producto.unidad}\nCaducidad: ${producto.fechaCaducidad || 'N/A'}\nEstado: ${producto.estado}`);
                }
            };
        });
    }

    // Manejar el envío del formulario del modal
    productoForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitar el envío por defecto del formulario

        const nombre = document.getElementById('nombreProducto').value;
        const categoria = document.getElementById('categoriaProducto').value;
        const cantidad = parseInt(document.getElementById('cantidadProducto').value);
        const unidad = document.getElementById('unidadProducto').value;
        const fechaCaducidad = document.getElementById('fechaCaducidad').value;
        const estado = document.getElementById('estadoProducto').value;

        if (currentEditingProductId) {
            // Editar producto existente
            const index = productos.findIndex(p => p.id === currentEditingProductId);
            if (index !== -1) {
                productos[index] = { ...productos[index], nombre, categoria, cantidad, unidad, fechaCaducidad, estado };
                console.log(`Producto con ID ${currentEditingProductId} actualizado.`);
            }
        } else {
            // Añadir nuevo producto
            const lastProductId = productos.length > 0 ? productos[productos.length - 1].id : 'P000';
            const newIdNum = parseInt(lastProductId.replace('P', '')) + 1;
            const newId = 'P' + newIdNum.toString().padStart(3, '0');
            const newProducto = { id: newId, nombre, categoria, cantidad, unidad, fechaCaducidad, estado };
            productos.push(newProducto);
            console.log('Nuevo producto añadido:', newProducto);
        }

        productoModal.style.display = 'none'; // Cerrar modal
        renderProductos(); // Volver a renderizar la tabla con los filtros actuales
    });

    // Eventos para filtrar productos
    filterCategoria.addEventListener('change', renderProductos);
    filterEstado.addEventListener('change', renderProductos);

    // Renderizar productos al cargar la página por primera vez
    renderProductos();

    // --- Mantener el elemento de navegación activo (generalizado del dashboard.js) ---
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const link = item.querySelector('a');
        if (link && link.getAttribute('href').includes(currentPath)) {
            item.classList.add('active');
        }
    });
});