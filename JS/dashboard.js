document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard cargado completamente.');

    // --- Simulación de carga de datos iniciales ---
    // En un sistema real, estos datos vendrían de IndexedDB o un backend
    document.getElementById('totalBeneficiarios').textContent = '120'; // Ejemplo
    document.getElementById('alimentoDisponible').textContent = '850'; // Ejemplo en Kg
    document.getElementById('entregasHoy').textContent = '15'; // Ejemplo
    document.getElementById('voluntariosActivos').textContent = '8'; // Ejemplo

    // --- Inicializar Gráfica de Actividad Semanal (usando Chart.js) ---
    const ctx = document.getElementById('weeklyActivityChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Beneficiarios Atendidos',
                data: [30, 45, 28, 50, 40, 60, 35], // Datos simulados
                backgroundColor: 'rgba(72, 219, 251, 0.8)', // Color de las barras
                borderColor: 'rgba(72, 219, 251, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Permite que el gráfico se adapte al contenedor
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false // Ocultar líneas de la cuadrícula en el eje Y
                    }
                },
                x: {
                    grid: {
                        display: false // Ocultar líneas de la cuadrícula en el eje X
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // No mostrar la leyenda
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y;
                        }
                    }
                }
            }
        }
    });

    // --- Funcionalidad básica de navegación (resaltar activo) ---
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Esta parte es solo para la simulación. En un proyecto real,
    // el estado activo se mantendría por la URL de la página cargada.
    const currentPath = window.location.pathname.split('/').pop();
    if (currentPath === 'dashboard.html' || currentPath === '') {
        document.querySelector('.nav-item a[href="dashboard.html"]').parentNode.classList.add('active');
    } else if (currentPath === 'beneficiarios.html') {
        document.querySelector('.nav-item a[href="beneficiarios.html"]').parentNode.classList.add('active');
    }
    // ... y así sucesivamente para las otras páginas
});