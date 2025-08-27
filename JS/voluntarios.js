document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de Voluntarios cargada completamente.');

    // --- Funcionalidad del Modal ---
    const addVoluntarioBtn = document.getElementById('addVoluntarioBtn');
    const voluntarioModal = document.getElementById('voluntarioModal');
    const closeButton = voluntarioModal.querySelector('.close-button');
    const modalTitle = document.getElementById('modalTitle');
    const voluntarioForm = document.getElementById('voluntarioForm');

    let currentEditingVoluntarioId = null; // Para saber si estamos editando o añadiendo

    // Abrir modal para añadir voluntario
    addVoluntarioBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Añadir Nuevo Voluntario';
        voluntarioForm.reset(); // Limpiar el formulario
        currentEditingVoluntarioId = null;
        voluntarioModal.style.display = 'flex';
    });

    // Cerrar modal
    closeButton.addEventListener('click', () => {
        voluntarioModal.style.display = 'none';
    });

    // Cerrar modal si se hace click fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === voluntarioModal) {
            voluntarioModal.style.display = 'none';
        }
    });

    // --- Simulación de Datos y Funcionalidad CRUD ---
    let voluntarios = [
        { id: 'V001', nombre: 'Ana García Pérez', email: 'ana.garcia@example.com', telefono: '+34600111222', rol: 'cocina', disponibilidad: 'activa', imagen: '../img/ana.jpg' },
        { id: 'V002', nombre: 'Luis Fernández Ruiz', email: 'luis.fernandez@example.com', telefono: '+34600333444', rol: 'reparto', disponibilidad: 'activa', imagen: '../img/luis.jpg' },
        { id: 'V003', nombre: 'María López Gil', email: 'maria.lopez@example.com', telefono: '+34600555666', rol: 'administracion', disponibilidad: 'inactiva', imagen: '../img/luisina.jpg' },
        { id: 'V004', nombre: 'Pedro Sánchez Díaz', email: 'pedro.sanchez@example.com', telefono: '+34600777888', rol: 'general', disponibilidad: 'activa', imagen: '../img/juan.jpg' },
        { id: 'V005', nombre: 'Sofía Martín Castro', email: 'sofia.martin@example.com', telefono: '+34600999000', rol: 'cocina', disponibilidad: 'activa', imagen: '../img/maria.jpg' },
        { id: 'V006', nombre: 'Javier Ruíz Gómez', email: 'javier.ruiz@example.com', telefono: '+34600112233', rol: 'reparto', disponibilidad: 'activa', imagen: '../img/oscar.jpg' },
        { id: 'V007', nombre: 'Elena Navarro Vega', email: 'elena.navarro@example.com', telefono: '+34600445566', rol: 'general', disponibilidad: 'inactiva', imagen: '../img/elena.jpg' }
    ];

    const voluntariosGrid = document.getElementById('voluntariosGrid');
    const filterRol = document.getElementById('filterRol');
    const filterDisponibilidad = document.getElementById('filterDisponibilidad');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');

    const itemsPerPage = 6; // Número de voluntarios por página
    let currentPage = 1;

    function renderVoluntarios() {
        voluntariosGrid.innerHTML = ''; // Limpiar grid

        const rolSeleccionado = filterRol.value;
        const disponibilidadSeleccionada = filterDisponibilidad.value;

        const filteredVoluntarios = voluntarios.filter(voluntario => {
            const matchRol = rolSeleccionado === 'all' || voluntario.rol === rolSeleccionado;
            const matchDisponibilidad = disponibilidadSeleccionada === 'all' || voluntario.disponibilidad === disponibilidadSeleccionada;
            return matchRol && matchDisponibilidad;
        });

        const totalPages = Math.ceil(filteredVoluntarios.length / itemsPerPage);
        currentPage = Math.min(currentPage, totalPages > 0 ? totalPages : 1); // Asegurar que la página actual no exceda el total
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedVoluntarios = filteredVoluntarios.slice(startIndex, endIndex);

        pageInfo.textContent = `Página ${currentPage} de ${totalPages > 0 ? totalPages : 1}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;


        paginatedVoluntarios.forEach(voluntario => {
            const card = document.createElement('div');
            card.classList.add('voluntario-card');
            card.dataset.id = voluntario.id;

            let statusClass = '';
            let statusText = '';
            switch (voluntario.disponibilidad) {
                case 'activa':
                    statusClass = 'status-activa';
                    statusText = 'Activa';
                    break;
                case 'inactiva':
                    statusClass = 'status-inactiva';
                    statusText = 'Inactiva';
                    break;
                default:
                    statusClass = '';
                    statusText = voluntario.disponibilidad;
            }
            
            // Usamos una imagen por defecto si no se proporciona una
            const imageUrl = voluntario.imagen || 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Voluntario';

            card.innerHTML = `
                <img src="${imageUrl}" alt="${voluntario.nombre}">
                <div class="voluntario-info">
                    <h3>${voluntario.nombre}</h3>
                    <p class="rol">Rol: ${voluntario.rol.charAt(0).toUpperCase() + voluntario.rol.slice(1)}</p>
                    <p class="email"><i class="fas fa-envelope"></i> ${voluntario.email}</p>
                    <p class="telefono"><i class="fas fa-phone"></i> ${voluntario.telefono}</p>
                    <span class="voluntario-status ${statusClass}">${statusText}</span>
                </div>
                <div class="voluntario-actions">
                    <button class="btn-card-icon edit-btn" data-id="${voluntario.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-card-icon delete-btn" data-id="${voluntario.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            voluntariosGrid.appendChild(card);
        });

        addEventListenersToCardButtons();
    }

    function addEventListenersToCardButtons() {
        // Editar
        document.querySelectorAll('.voluntario-card .edit-btn').forEach(button => {
            button.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                const voluntario = voluntarios.find(v => v.id === id);
                if (voluntario) {
                    modalTitle.textContent = 'Editar Voluntario';
                    document.getElementById('nombreVoluntario').value = voluntario.nombre;
                    document.getElementById('emailVoluntario').value = voluntario.email;
                    document.getElementById('telefonoVoluntario').value = voluntario.telefono;
                    document.getElementById('rolVoluntario').value = voluntario.rol;
                    document.getElementById('disponibilidadVoluntario').value = voluntario.disponibilidad;
                    document.getElementById('imagenVoluntario').value = voluntario.imagen || '';
                    currentEditingVoluntarioId = id;
                    voluntarioModal.style.display = 'flex';
                }
            };
        });

        // Eliminar
        document.querySelectorAll('.voluntario-card .delete-btn').forEach(button => {
            button.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm('¿Estás seguro de que quieres eliminar a este voluntario?')) {
                    voluntarios = voluntarios.filter(v => v.id !== id);
                    renderVoluntarios();
                    console.log(`Voluntario con ID ${id} eliminado.`);
                }
            };
        });
    }

    // Manejar el envío del formulario del modal
    voluntarioForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const nombre = document.getElementById('nombreVoluntario').value;
        const email = document.getElementById('emailVoluntario').value;
        const telefono = document.getElementById('telefonoVoluntario').value;
        const rol = document.getElementById('rolVoluntario').value;
        const disponibilidad = document.getElementById('disponibilidadVoluntario').value;
        const imagen = document.getElementById('imagenVoluntario').value;


        if (currentEditingVoluntarioId) {
            // Editar voluntario existente
            const index = voluntarios.findIndex(v => v.id === currentEditingVoluntarioId);
            if (index !== -1) {
                voluntarios[index] = { ...voluntarios[index], nombre, email, telefono, rol, disponibilidad, imagen };
                console.log(`Voluntario con ID ${currentEditingVoluntarioId} actualizado.`);
            }
        } else {
            // Añadir nuevo voluntario
            const lastVoluntarioId = voluntarios.length > 0 ? voluntarios[voluntarios.length - 1].id : 'V000';
            const newIdNum = parseInt(lastVoluntarioId.replace('V', '')) + 1;
            const newId = 'V' + newIdNum.toString().padStart(3, '0');
            const newVoluntario = { id: newId, nombre, email, telefono, rol, disponibilidad, imagen };
            voluntarios.push(newVoluntario);
            console.log('Nuevo voluntario añadido:', newVoluntario);
        }

        voluntarioModal.style.display = 'none';
        renderVoluntarios();
    });

    // Eventos para filtrar voluntarios
    filterRol.addEventListener('change', () => {
        currentPage = 1; // Resetear a la primera página al filtrar
        renderVoluntarios();
    });
    filterDisponibilidad.addEventListener('change', () => {
        currentPage = 1; // Resetear a la primera página al filtrar
        renderVoluntarios();
    });

    // Eventos de paginación
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderVoluntarios();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(voluntarios.filter(v => 
            (filterRol.value === 'all' || v.rol === filterRol.value) &&
            (filterDisponibilidad.value === 'all' || v.disponibilidad === filterDisponibilidad.value)
        ).length / itemsPerPage);

        if (currentPage < totalPages) {
            currentPage++;
            renderVoluntarios();
        }
    });

    // Renderizar voluntarios al cargar la página por primera vez
    renderVoluntarios();

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
