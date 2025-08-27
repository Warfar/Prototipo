document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de Menús cargada completamente.');

    // --- Funcionalidad del Modal ---
    const addMenuBtn = document.getElementById('addMenuBtn');
    const menuModal = document.getElementById('menuModal');
    const closeButton = menuModal.querySelector('.close-button');
    const modalTitle = document.getElementById('modalTitle');
    const menuForm = document.getElementById('menuForm');

    let currentEditingMenuId = null; // Para saber si estamos editando o añadiendo

    // Abrir modal para añadir menú
    addMenuBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Añadir Nuevo Menú';
        menuForm.reset(); // Limpiar el formulario
        currentEditingMenuId = null;
        menuModal.style.display = 'flex';
    });

    // Cerrar modal
    closeButton.addEventListener('click', () => {
        menuModal.style.display = 'none';
    });

    // Cerrar modal si se hace click fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === menuModal) {
            menuModal.style.display = 'none';
        }
    });

    // --- Simulación de Datos y Funcionalidad CRUD ---
    let menus = [
        { id: 'M001', nombre: 'Menú Semanal Lunes', tipoComida: 'almuerzo', fecha: '2024-05-20', platosPrincipales: 'Lentejas con verduras, Pollo asado', ingredientesAdicionales: 'Pan, Fruta', estado: 'activo' },
        { id: 'M002', nombre: 'Cena Especial Martes', tipoComida: 'cena', fecha: '2024-05-21', platosPrincipales: 'Crema de calabaza, Pescado a la plancha', ingredientesAdicionales: 'Arroz, Ensalada', estado: 'pendiente' },
        { id: 'M003', nombre: 'Desayuno Básico', tipoComida: 'desayuno', fecha: '2024-05-22', platosPrincipales: 'Tostadas, Café, Zumo', ingredientesAdicionales: 'Mermelada, Leche', estado: 'activo' },
        { id: 'M004', nombre: 'Almuerzo Vegetariano', tipoComida: 'almuerzo', fecha: '2024-05-23', platosPrincipales: 'Paella de verduras, Ensalada mixta', ingredientesAdicionales: 'Agua, Yogur', estado: 'activo' },
        { id: 'M005', nombre: 'Menú Fin de Semana', tipoComida: 'especial', fecha: '2024-05-25', platosPrincipales: 'Cocido Madrileño', ingredientesAdicionales: 'Postre casero', estado: 'archivado' }
    ];

    const menusTableBody = document.getElementById('menusTableBody');
    const filterTipoComida = document.getElementById('filterTipoComida');
    const filterEstadoMenu = document.getElementById('filterEstadoMenu');

    function renderMenus() {
        menusTableBody.innerHTML = ''; // Limpiar tabla

        const tipoSeleccionado = filterTipoComida.value;
        const estadoSeleccionado = filterEstadoMenu.value;

        const filteredMenus = menus.filter(menu => {
            const matchTipo = tipoSeleccionado === 'all' || menu.tipoComida === tipoSeleccionado;
            const matchEstado = estadoSeleccionado === 'all' || menu.estado === estadoSeleccionado;
            return matchTipo && matchEstado;
        });

        filteredMenus.forEach(menu => {
            const row = menusTableBody.insertRow();
            row.dataset.id = menu.id; // Para identificar la fila al editar/eliminar

            let statusClass = '';
            let statusText = '';
            switch (menu.estado) {
                case 'activo':
                    statusClass = 'status-activo';
                    statusText = 'Activo';
                    break;
                case 'pendiente':
                    statusClass = 'status-pendiente';
                    statusText = 'Pendiente';
                    break;
                case 'archivado':
                    statusClass = 'status-archivado';
                    statusText = 'Archivado';
                    break;
                default:
                    statusClass = '';
                    statusText = menu.estado;
            }

            row.innerHTML = `
                <td>${menu.id}</td>
                <td>${menu.nombre}</td>
                <td>${menu.tipoComida.charAt(0).toUpperCase() + menu.tipoComida.slice(1)}</td>
                <td>${menu.fecha}</td>
                <td>${menu.platosPrincipales}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td class="actions">
                    <button class="btn-icon edit-btn" data-id="${menu.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-btn" data-id="${menu.id}"><i class="fas fa-trash-alt"></i></button>
                    <button class="btn-icon view-btn" data-id="${menu.id}"><i class="fas fa-eye"></i></button>
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
                const menu = menus.find(m => m.id === id);
                if (menu) {
                    modalTitle.textContent = 'Editar Menú';
                    document.getElementById('nombreMenu').value = menu.nombre;
                    document.getElementById('tipoComida').value = menu.tipoComida;
                    document.getElementById('fechaMenu').value = menu.fecha;
                    document.getElementById('platosPrincipales').value = menu.platosPrincipales;
                    document.getElementById('ingredientesAdicionales').value = menu.ingredientesAdicionales;
                    document.getElementById('estadoMenu').value = menu.estado;
                    currentEditingMenuId = id;
                    menuModal.style.display = 'flex';
                }
            };
        });

        // Eliminar
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm('¿Estás seguro de que quieres eliminar este menú?')) {
                    menus = menus.filter(m => m.id !== id);
                    renderMenus();
                    console.log(`Menú con ID ${id} eliminado.`);
                }
            };
        });

        // Ver Detalles
        document.querySelectorAll('.view-btn').forEach(button => {
            button.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                const menu = menus.find(m => m.id === id);
                if (menu) {
                    alert(`Detalles del Menú:\nID: ${menu.id}\nNombre: ${menu.nombre}\nTipo: ${menu.tipoComida}\nFecha: ${menu.fecha}\nPlatos Principales: ${menu.platosPrincipales}\nIngredientes Adicionales: ${menu.ingredientesAdicionales || 'N/A'}\nEstado: ${menu.estado}`);
                }
            };
        });
    }

    // Manejar el envío del formulario del modal
    menuForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const nombre = document.getElementById('nombreMenu').value;
        const tipoComida = document.getElementById('tipoComida').value;
        const fecha = document.getElementById('fechaMenu').value;
        const platosPrincipales = document.getElementById('platosPrincipales').value;
        const ingredientesAdicionales = document.getElementById('ingredientesAdicionales').value;
        const estado = document.getElementById('estadoMenu').value;

        if (currentEditingMenuId) {
            // Editar menú existente
            const index = menus.findIndex(m => m.id === currentEditingMenuId);
            if (index !== -1) {
                menus[index] = { ...menus[index], nombre, tipoComida, fecha, platosPrincipales, ingredientesAdicionales, estado };
                console.log(`Menú con ID ${currentEditingMenuId} actualizado.`);
            }
        } else {
            // Añadir nuevo menú
            const lastMenuId = menus.length > 0 ? menus[menus.length - 1].id : 'M000';
            const newIdNum = parseInt(lastMenuId.replace('M', '')) + 1;
            const newId = 'M' + newIdNum.toString().padStart(3, '0');
            const newMenu = { id: newId, nombre, tipoComida, fecha, platosPrincipales, ingredientesAdicionales, estado };
            menus.push(newMenu);
            console.log('Nuevo menú añadido:', newMenu);
        }

        menuModal.style.display = 'none';
        renderMenus();
    });

    // Eventos para filtrar menús
    filterTipoComida.addEventListener('change', renderMenus);
    filterEstadoMenu.addEventListener('change', renderMenus);

    // Renderizar menús al cargar la página por primera vez
    renderMenus();

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