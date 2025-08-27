document.addEventListener('DOMContentLoaded', () => {
    const entregasTableBody = document.getElementById('entregasTableBody');
    const addEntregaBtn = document.getElementById('addEntregaBtn');
    const entregaModal = document.getElementById('entregaModal');
    const viewEntregaModal = document.getElementById('viewEntregaModal');
    const closeButtons = document.querySelectorAll('.close-button');
    const entregaForm = document.getElementById('entregaForm');
    const modalTitle = document.getElementById('modalTitle');

    const beneficiarioIdSelect = document.getElementById('beneficiarioId');
    const voluntarioIdSelect = document.getElementById('voluntarioId');
    const fechaEntregaInput = document.getElementById('fechaEntrega');
    const tipoEntregaSelect = document.getElementById('tipoEntrega');
    const direccionGroup = document.getElementById('direccionGroup');
    const direccionEntregaInput = document.getElementById('direccionEntrega');
    const notasEntregaInput = document.getElementById('notasEntrega');
    const estadoEntregaSelect = document.getElementById('estadoEntrega');

    const filterEstadoEntrega = document.getElementById('filterEstadoEntrega');
    const filterTipoEntrega = document.getElementById('filterTipoEntrega');

    let entregas = []; // Simulación de base de datos de entregas
    let beneficiarios = []; // Simulación de beneficiarios
    let voluntarios = []; // Simulación de voluntarios
    let editingEntregaId = null; // Para saber si estamos editando o añadiendo

    // --- Funciones de simulación de datos (normalmente vendrían de un backend) ---

    // Simular carga de beneficiarios
    function fetchBeneficiarios() {
        beneficiarios = [
            { id: 'B001', nombre: 'Juan Pérez', direccion: 'Calle Falsa 123, Springfield' },
            { id: 'B002', nombre: 'María García', direccion: 'Av. Siempreviva 742, Springfield' },
            { id: 'B003', nombre: 'Carlos Ruiz', direccion: 'Boulevard del Sol 45, Ciudad' },
        ];
        beneficiarios.forEach(beneficiario => {
            const option = document.createElement('option');
            option.value = beneficiario.id;
            option.textContent = beneficiario.nombre;
            beneficiarioIdSelect.appendChild(option);
        });
    }

    // Simular carga de voluntarios
    function fetchVoluntarios() {
        voluntarios = [
            { id: 'V001', nombre: 'Ana López' },
            { id: 'V002', nombre: 'Pedro Ramírez' },
            { id: 'V003', nombre: 'Laura Martínez' },
        ];
        voluntarios.forEach(voluntario => {
            const option = document.createElement('option');
            option.value = voluntario.id;
            option.textContent = voluntario.nombre;
            voluntarioIdSelect.appendChild(option);
        });
    }

    // Simular carga inicial de entregas
    function fetchEntregas() {
        entregas = [
            {
                id: 'ENT001',
                beneficiarioId: 'B001',
                voluntarioId: 'V001',
                fechaHora: '2023-10-26T10:00',
                tipo: 'domicilio',
                direccion: 'Calle Falsa 123, Springfield',
                notas: 'Dejar en la puerta trasera.',
                estado: 'pendiente'
            },
            {
                id: 'ENT002',
                beneficiarioId: 'B002',
                voluntarioId: 'V002',
                fechaHora: '2023-10-26T12:30',
                tipo: 'cocina',
                direccion: 'Comedor Central',
                notas: 'Recoge su menú especial sin lactosa.',
                estado: 'en_curso'
            },
            {
                id: 'ENT003',
                beneficiarioId: 'B003',
                voluntarioId: 'V001',
                fechaHora: '2023-10-25T15:00',
                tipo: 'domicilio',
                direccion: 'Boulevard del Sol 45, Ciudad',
                notas: 'Llamar antes de llegar.',
                estado: 'completada'
            },
            {
                id: 'ENT004',
                beneficiarioId: 'B001',
                voluntarioId: null,
                fechaHora: '2023-10-27T09:00',
                tipo: 'domicilio',
                direccion: 'Calle Falsa 123, Springfield',
                notas: '',
                estado: 'pendiente'
            },
        ];
        renderEntregas();
    }

    // --- Funciones de Renderizado ---

    function getBeneficiarioNombre(id) {
        const beneficiario = beneficiarios.find(b => b.id === id);
        return beneficiario ? beneficiario.nombre : 'Desconocido';
    }

    function getVoluntarioNombre(id) {
        const voluntario = voluntarios.find(v => v.id === id);
        return voluntario ? voluntario.nombre : 'Sin Asignar';
    }

    function getEstadoBadge(estado) {
        let text = '';
        let className = '';
        switch (estado) {
            case 'pendiente':
                text = 'Pendiente';
                className = 'status-pendiente';
                break;
            case 'en_curso':
                text = 'En Curso';
                className = 'status-en_curso';
                break;
            case 'completada':
                text = 'Completada';
                className = 'status-completada';
                break;
            case 'cancelada':
                text = 'Cancelada';
                className = 'status-cancelada';
                break;
            default:
                text = estado;
                className = '';
        }
        return `<span class="status-badge ${className}">${text}</span>`;
    }

    function renderEntregas() {
        entregasTableBody.innerHTML = '';
        const estadoFilter = filterEstadoEntrega.value;
        const tipoFilter = filterTipoEntrega.value;

        const filteredEntregas = entregas.filter(entrega => {
            const matchesEstado = estadoFilter === 'all' || entrega.estado === estadoFilter;
            const matchesTipo = tipoFilter === 'all' || entrega.tipo === tipoFilter;
            return matchesEstado && matchesTipo;
        });


        if (filteredEntregas.length === 0) {
            entregasTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No hay entregas que coincidan con los filtros.</td></tr>';
            return;
        }

        filteredEntregas.forEach(entrega => {
            const row = entregasTableBody.insertRow();
            const fecha = new Date(entrega.fechaHora);
            const fechaFormateada = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const horaFormateada = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

            row.innerHTML = `
                <td>${entrega.id}</td>
                <td>${getBeneficiarioNombre(entrega.beneficiarioId)}</td>
                <td>${getVoluntarioNombre(entrega.voluntarioId)}</td>
                <td>${fechaFormateada} ${horaFormateada}</td>
                <td>${entrega.direccion}</td>
                <td>${entrega.tipo === 'domicilio' ? 'Domicilio' : 'Recoger Cocina'}</td>
                <td>${getEstadoBadge(entrega.estado)}</td>
                <td class="actions">
                    <button class="btn-icon view-btn" data-id="${entrega.id}" title="Ver Detalles"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon edit-btn" data-id="${entrega.id}" title="Editar Entrega"><i class="fas fa-edit"></i></button>
                    ${entrega.estado === 'pendiente' ? `<button class="btn-icon start-delivery-btn" data-id="${entrega.id}" title="Iniciar Entrega"><i class="fas fa-play-circle"></i></button>` : ''}
                    ${entrega.estado === 'en_curso' ? `<button class="btn-icon complete-delivery-btn" data-id="${entrega.id}" title="Completar Entrega"><i class="fas fa-check-circle"></i></button>` : ''}
                    <button class="btn-icon delete-btn" data-id="${entrega.id}" title="Eliminar Entrega"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
        });

        addEventListenersToTableButtons();
    }

    // --- Gestión de Modales ---

    function openModal(modal) {
        modal.style.display = 'flex'; // Usar flex para centrar
        document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        entregaForm.reset(); // Limpiar formulario al cerrar
        editingEntregaId = null;
        direccionGroup.style.display = 'block'; // Asegurarse de que esté visible por defecto
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (e.target.closest('#entregaModal')) {
                closeModal(entregaModal);
            } else if (e.target.closest('#viewEntregaModal')) {
                closeModal(viewEntregaModal);
            }
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === entregaModal) {
            closeModal(entregaModal);
        } else if (event.target === viewEntregaModal) {
            closeModal(viewEntregaModal);
        }
    });

    // --- Lógica del Formulario de Entrega ---

    addEntregaBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Programar Nueva Entrega';
        editingEntregaId = null;
        entregaForm.reset();
        direccionGroup.style.display = 'block'; // Por defecto, es a domicilio
        openModal(entregaModal);
    });

    tipoEntregaSelect.addEventListener('change', () => {
        if (tipoEntregaSelect.value === 'domicilio') {
            direccionGroup.style.display = 'block';
            direccionEntregaInput.setAttribute('required', 'required');
        } else {
            direccionGroup.style.display = 'none';
            direccionEntregaInput.removeAttribute('required');
            direccionEntregaInput.value = 'Comedor Central'; // O algún valor predeterminado
        }
    });

    entregaForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const beneficiario = beneficiarios.find(b => b.id === beneficiarioIdSelect.value);
        const direccionFinal = tipoEntregaSelect.value === 'domicilio' ? direccionEntregaInput.value : 'Comedor Central';

        const nuevaEntrega = {
            beneficiarioId: beneficiarioIdSelect.value,
            voluntarioId: voluntarioIdSelect.value || null,
            fechaHora: fechaEntregaInput.value,
            tipo: tipoEntregaSelect.value,
            direccion: direccionFinal,
            notas: notasEntregaInput.value,
            estado: estadoEntregaSelect.value
        };

        if (editingEntregaId) {
            // Editar entrega existente
            const index = entregas.findIndex(e => e.id === editingEntregaId);
            if (index !== -1) {
                entregas[index] = { ...entregas[index], ...nuevaEntrega };
            }
        } else {
            // Añadir nueva entrega
            nuevaEntrega.id = 'ENT' + String(entregas.length + 1).padStart(3, '0'); // ID simple
            entregas.push(nuevaEntrega);
        }

        renderEntregas();
        closeModal(entregaModal);
    });

    // --- Acciones de Tabla ---

    function addEventListenersToTableButtons() {
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const entregaToEdit = entregas.find(e => e.id === id);
                if (entregaToEdit) {
                    modalTitle.textContent = 'Editar Entrega';
                    editingEntregaId = id;
                    beneficiarioIdSelect.value = entregaToEdit.beneficiarioId;
                    voluntarioIdSelect.value = entregaToEdit.voluntarioId || '';
                    fechaEntregaInput.value = entregaToEdit.fechaHora;
                    tipoEntregaSelect.value = entregaToEdit.tipo;
                    notasEntregaInput.value = entregaToEdit.notas;
                    estadoEntregaSelect.value = entregaToEdit.estado;

                    if (entregaToEdit.tipo === 'domicilio') {
                        direccionGroup.style.display = 'block';
                        direccionEntregaInput.value = entregaToEdit.direccion;
                    } else {
                        direccionGroup.style.display = 'none';
                        direccionEntregaInput.value = 'Comedor Central'; // Asegurar valor coherente
                    }
                    openModal(entregaModal);
                }
            });
        });

        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const entregaToView = entregas.find(e => e.id === id);
                if (entregaToView) {
                    document.getElementById('viewEntregaId').textContent = entregaToView.id;
                    document.getElementById('viewEntregaBeneficiario').textContent = getBeneficiarioNombre(entregaToView.beneficiarioId);
                    document.getElementById('viewEntregaVoluntario').textContent = getVoluntarioNombre(entregaToView.voluntarioId);
                    const fecha = new Date(entregaToView.fechaHora);
                    document.getElementById('viewEntregaFechaHora').textContent = `${fecha.toLocaleDateString('es-ES')} ${fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
                    document.getElementById('viewEntregaTipo').textContent = entregaToView.tipo === 'domicilio' ? 'A Domicilio' : 'Recoger en Cocina';
                    document.getElementById('viewEntregaDireccion').textContent = entregaToView.direccion;
                    document.getElementById('viewEntregaNotas').textContent = entregaToView.notas || 'N/A';
                    document.getElementById('viewEntregaEstado').innerHTML = getEstadoBadge(entregaToView.estado);
                    // Aquí podrías integrar un mapa real si tuvieras una API (ej. Google Maps)
                    openModal(viewEntregaModal);
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm(`¿Estás seguro de que quieres eliminar la entrega ${id}?`)) {
                    entregas = entregas.filter(entrega => entrega.id !== id);
                    renderEntregas();
                }
            });
        });

        document.querySelectorAll('.start-delivery-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const entrega = entregas.find(e => e.id === id);
                if (entrega && entrega.estado === 'pendiente') {
                    entrega.estado = 'en_curso';
                    renderEntregas();
                    alert(`Entrega ${id} iniciada.`);
                }
            });
        });

        document.querySelectorAll('.complete-delivery-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const entrega = entregas.find(e => e.id === id);
                if (entrega && entrega.estado === 'en_curso') {
                    entrega.estado = 'completada';
                    renderEntregas();
                    alert(`Entrega ${id} completada.`);
                }
            });
        });
    }

    // --- Filtros ---
    filterEstadoEntrega.addEventListener('change', renderEntregas);
    filterTipoEntrega.addEventListener('change', renderEntregas);


    // --- Inicialización ---
    fetchBeneficiarios();
    fetchVoluntarios();
    fetchEntregas();
});