document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de Beneficiarios cargada completamente.');

    // --- Funcionalidad del Modal ---
    const addBeneficiarioBtn = document.getElementById('addBeneficiarioBtn');
    const beneficiarioModal = document.getElementById('beneficiarioModal');
    const closeButton = beneficiarioModal.querySelector('.close-button');
    const modalTitle = document.getElementById('modalTitle');
    const beneficiarioForm = document.getElementById('beneficiarioForm');

    let currentEditingBeneficiarioId = null; // Para saber si estamos editando o añadiendo

    // Abrir modal para añadir beneficiario
    addBeneficiarioBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Añadir Nuevo Beneficiario';
        beneficiarioForm.reset(); // Limpiar el formulario
        currentEditingBeneficiarioId = null;
        beneficiarioModal.style.display = 'flex'; // Usar flex para centrado
    });

    // Cerrar modal
    closeButton.addEventListener('click', () => {
        beneficiarioModal.style.display = 'none';
    });

    // Cerrar modal si se hace click fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === beneficiarioModal) {
            beneficiarioModal.style.display = 'none';
        }
    });

    // --- Simulación de Datos y Funcionalidad CRUD ---
    let beneficiarios = [
        { id: '001', nombre: 'Juan Pérez García', dni: '12345678A', telefono: '600112233', direccion: 'C/ Falsa 123, Madrid', fechaNacimiento: '1985-05-10', estado: 'active' },
        { id: '002', nombre: 'María López Díaz', dni: '87654321B', telefono: '611223344', direccion: 'Av. Siempreviva 742, Barcelona', fechaNacimiento: '1990-11-22', estado: 'inactive' },
        { id: '003', nombre: 'Pedro Ramírez Soto', dni: '98765432C', telefono: '622334455', direccion: 'Pza. Mayor 1, Sevilla', fechaNacimiento: '1978-01-15', estado: 'active' },
        { id: '004', nombre: 'Ana Gómez Fernández', dni: '54321098D', telefono: '633445566', direccion: 'C/ Sol 5, Valencia', fechaNacimiento: '2001-08-01', estado: 'active' },
    ];

    const beneficiariosTableBody = document.getElementById('beneficiariosTableBody');
    const filterStatus = document.getElementById('filterStatus');

    function renderBeneficiarios(filter = 'all') {
        beneficiariosTableBody.innerHTML = ''; // Limpiar tabla
        const filteredBeneficiarios = beneficiarios.filter(b => {
            return filter === 'all' || b.estado === filter;
        });

        filteredBeneficiarios.forEach(beneficiario => {
            const row = beneficiariosTableBody.insertRow();
            row.dataset.id = beneficiario.id; // Para identificar la fila al editar/eliminar

            const statusClass = beneficiario.estado === 'active' ? 'status-active' : 'status-inactive';
            const statusText = beneficiario.estado === 'active' ? 'Activo' : 'Inactivo';

            row.innerHTML = `
                <td>${beneficiario.id}</td>
                <td>${beneficiario.nombre}</td>
                <td>${beneficiario.dni}</td>
                <td>${beneficiario.telefono || 'N/A'}</td>
                <td>${beneficiario.direccion || 'N/A'}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td class="actions">
                    <button class="btn-icon edit-btn" data-id="${beneficiario.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-btn" data-id="${beneficiario.id}"><i class="fas fa-trash-alt"></i></button>
                    <button class="btn-icon view-btn" data-id="${beneficiario.id}"><i class="fas fa-eye"></i></button>
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
                const beneficiario = beneficiarios.find(b => b.id === id);
                if (beneficiario) {
                    modalTitle.textContent = 'Editar Beneficiario';
                    document.getElementById('nombreBeneficiario').value = beneficiario.nombre;
                    document.getElementById('dniBeneficiario').value = beneficiario.dni;
                    document.getElementById('telefonoBeneficiario').value = beneficiario.telefono;
                    document.getElementById('direccionBeneficiario').value = beneficiario.direccion;
                    document.getElementById('fechaNacimiento').value = beneficiario.fechaNacimiento;
                    document.getElementById('estadoBeneficiario').value = beneficiario.estado;
                    currentEditingBeneficiarioId = id;
                    beneficiarioModal.style.display = 'flex';
                }
            };
        });

        // Eliminar
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm('¿Estás seguro de que quieres eliminar a este beneficiario?')) {
                    beneficiarios = beneficiarios.filter(b => b.id !== id);
                    renderBeneficiarios(filterStatus.value);
                    console.log(`Beneficiario con ID ${id} eliminado.`);
                }
            };
        });

        // Ver Detalles (podrías abrir otro modal o redirigir)
        document.querySelectorAll('.view-btn').forEach(button => {
            button.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                const beneficiario = beneficiarios.find(b => b.id === id);
                if (beneficiario) {
                    alert(`Detalles de ${beneficiario.nombre}:\nID: ${beneficiario.id}\nDNI: ${beneficiario.dni}\nTeléfono: ${beneficiario.telefono}\nDirección: ${beneficiario.direccion}\nNacimiento: ${beneficiario.fechaNacimiento}\nEstado: ${beneficiario.estado === 'active' ? 'Activo' : 'Inactivo'}`);
                }
            };
        });
    }

    // Manejar el envío del formulario del modal
    beneficiarioForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitar el envío por defecto del formulario

        const nombre = document.getElementById('nombreBeneficiario').value;
        const dni = document.getElementById('dniBeneficiario').value;
        const telefono = document.getElementById('telefonoBeneficiario').value;
        const direccion = document.getElementById('direccionBeneficiario').value;
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;
        const estado = document.getElementById('estadoBeneficiario').value;

        if (currentEditingBeneficiarioId) {
            // Editar beneficiario existente
            const index = beneficiarios.findIndex(b => b.id === currentEditingBeneficiarioId);
            if (index !== -1) {
                beneficiarios[index] = { ...beneficiarios[index], nombre, dni, telefono, direccion, fechaNacimiento, estado };
                console.log(`Beneficiario con ID ${currentEditingBeneficiarioId} actualizado.`);
            }
        } else {
            // Añadir nuevo beneficiario
            const newId = (parseInt(beneficiarios[beneficiarios.length - 1].id) + 1).toString().padStart(3, '0');
            const newBeneficiario = { id: newId, nombre, dni, telefono, direccion, fechaNacimiento, estado };
            beneficiarios.push(newBeneficiario);
            console.log('Nuevo beneficiario añadido:', newBeneficiario);
        }

        beneficiarioModal.style.display = 'none'; // Cerrar modal
        renderBeneficiarios(filterStatus.value); // Volver a renderizar la tabla
    });

    // Evento para filtrar beneficiarios por estado
    filterStatus.addEventListener('change', (event) => {
        renderBeneficiarios(event.target.value);
    });

    // Renderizar beneficiarios al cargar la página por primera vez
    renderBeneficiarios();

    // --- Mantener el elemento de navegación activo ---
    // Esta función se puede generalizar en dashboard.js para todas las páginas
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const link = item.querySelector('a');
        if (link && link.getAttribute('href').includes(currentPath)) {
            item.classList.add('active');
        }
    });

    // Asegurarse de que el dashboard.js también se ejecute si es necesario,
    // pero aquí estamos enfocados en la lógica de beneficiarios.
});