/*
 * =================================================================
 * Euphonia Player - script.js (Versión Completa y Depurada)
 * Autor: Gemini para el proyecto Euphonia de Lynxion
 * Descripción: Este script maneja toda la interactividad principal 
 * de la interfaz de usuario: menús, modales, navegación, modo oscuro,
 * reproductor, búsqueda por voz y personalización.
 * =================================================================
 */

// Se ejecuta cuando todo el contenido del HTML ha sido cargado para evitar errores.
document.addEventListener('DOMContentLoaded', () => {

    // --- SELECCIÓN DE ELEMENTOS DEL DOM ---
    // Guardamos en constantes todos los elementos HTML con los que vamos a interactuar.
    // Esto mejora el rendimiento y la legibilidad del código.

    // Generales
    const body = document.body;
    const mainContent = document.getElementById('main-content');
    const appHeader = document.getElementById('app-header');

    // Menú lateral
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    // Búsqueda
    const searchToggle = document.getElementById('search-toggle');
    const searchInput = document.querySelector('.search-input');
    const micButton = document.getElementById('mic-button');

    // Modo oscuro
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeLabel = document.getElementById('dark-mode-label');

    // Modal QR
    const qrCodeButton = document.getElementById('qr-code-button');
    const qrModal = document.getElementById('qr-modal');
    const modalCloseButton = document.getElementById('modal-close-button');

    // Navegación inferior y secciones
    const bottomMenuItems = document.querySelectorAll('.euphonia-bottom-menu .euphonia-menu-item');
    const contentSections = document.querySelectorAll('.content-section');
    const bottomMenuProfile = document.getElementById('bottom-menu-profile');

    // Acceso al perfil desde el menú lateral
    const profileArrowButton = document.getElementById('profile-arrow-btn');

    // Reproductor de música
    const playerToggle = document.querySelector('.euphonia-player-toggle');
    const musicPlayer = document.getElementById('euphonia-music-player');
    const playerClose = document.getElementById('euphonia-player-close');

    // Visibilidad del botón de temas
    const themeButtonVisibilityToggle = document.getElementById('theme-button-visibility-toggle');
    const temasContainer = document.querySelector('.temas-container');
    

    // --- GESTIÓN DEL MENÚ LATERAL ---
    // Controla la apertura y cierre del menú deslizable.
    menuToggle.addEventListener('click', () => {
        sideMenu.classList.toggle('is-active');
        body.classList.toggle('overlay-active'); // Activa el fondo borroso
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    // --- CIERRE INTELIGENTE DEL MENÚ AL HACER CLIC FUERA ---
// Cierra el menú si se hace clic en cualquier lugar fuera de él.
// Esto es más robusto que escuchar solo en 'mainContent' y soluciona el error del interruptor.
document.addEventListener('click', (event) => {
    // Primero, verifica si el menú está activo para no ejecutar esto innecesariamente.
    if (sideMenu.classList.contains('is-active')) {

        // `event.target` es el elemento específico donde se hizo clic.
        const isClickInsideMenu = sideMenu.contains(event.target);

        // También verificamos que no se haya hecho clic en el propio botón que abre el menú,
        // ya que ese botón tiene su propia lógica para abrir/cerrar.
        const isClickOnMenuToggle = menuToggle.contains(event.target);

        // La condición para cerrar el menú es:
        // Si el clic NO fue dentro del menú Y TAMPOCO fue en el botón que lo abre.
        if (!isClickInsideMenu && !isClickOnMenuToggle) {
            // Si se cumple, procedemos a cerrar el menú.
            sideMenu.classList.remove('is-active');
            body.classList.remove('overlay-active');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    }
});



    // --- GESTIÓN DE LA BARRA DE BÚSQUEDA ---
    // Muestra u oculta la barra de búsqueda en la cabecera.
    searchToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el clic se propague y cierre el menú si está abierto.
        appHeader.classList.toggle('search-active');
        if (appHeader.classList.contains('search-active')) {
            searchInput.focus(); // Pone el cursor en el campo de búsqueda automáticamente.
        }
    });


    // --- GESTIÓN DEL MODO OSCURO ---
    // Activa o desactiva el tema oscuro y guarda la preferencia.
    const setDarkMode = (enabled) => {
        if (enabled) {
            body.classList.add('dark-mode');
            darkModeToggle.checked = true;
            darkModeLabel.textContent = 'Modo claro';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            darkModeToggle.checked = false;
            darkModeLabel.textContent = 'Modo oscuro';
            localStorage.setItem('darkMode', 'disabled');
        }
    };
    
    darkModeToggle.addEventListener('change', () => {
        setDarkMode(darkModeToggle.checked);
    });

    // Al cargar la página, comprueba si el modo oscuro estaba activado.
    if (localStorage.getItem('darkMode') === 'enabled') {
        setDarkMode(true);
    } else {
        setDarkMode(false);
    }


    // --- GESTIÓN DEL MODAL QR ---
    // Muestra y oculta la ventana con el código QR del perfil.
    qrCodeButton.addEventListener('click', () => {
        qrModal.classList.add('is-active');
    });

    modalCloseButton.addEventListener('click', () => {
        qrModal.classList.remove('is-active');
    });

    // Cierra el modal si se hace clic en el fondo.
    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            qrModal.classList.remove('is-active');
        }
    });


    // --- GESTIÓN DEL BOTÓN DE ACCESO AL PERFIL (ÚLTIMA MODIFICACIÓN) ---
    // Redirige al perfil desde el menú lateral y lo cierra.
    profileArrowButton.addEventListener('click', () => {
        // 1. Simula un clic en el ítem de "Perfil" del menú inferior.
        if (bottomMenuProfile) {
            bottomMenuProfile.click();
        }
        // 2. Cierra el menú lateral.
        sideMenu.classList.remove('is-active');
        body.classList.remove('overlay-active');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    });

    
    // --- GESTIÓN DE NAVEGACIÓN INFERIOR ---
    // Cambia entre las secciones (Inicio, Biblioteca, etc.).
    bottomMenuItems.forEach(item => {
        // Solo añade el evento a los items que tienen un `data-target`.
        if (item.dataset.target) {
            item.addEventListener('click', () => {
                const targetId = item.dataset.target;
                
                // Actualiza el item activo en el menú.
                bottomMenuItems.forEach(i => i.classList.remove('euphonia-active'));
                item.classList.add('euphonia-active');

                // Muestra la sección de contenido correcta.
                contentSections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetId) {
                        section.classList.add('active');
                    }
                });
            });
        }
    });


    // --- GESTIÓN DEL REPRODUCTOR DE MÚSICA ---
    // Expande y contrae el reproductor.
    playerToggle.addEventListener('click', () => {
        musicPlayer.classList.add('euphonia-is-active');
    });

    playerClose.addEventListener('click', () => {
        musicPlayer.classList.remove('euphonia-is-active');
    });


    // --- VISIBILIDAD DEL BOTÓN DE TEMAS ---
    // Muestra u oculta el botón flotante para cambiar temas y guarda la preferencia.
    const setThemeButtonVisibility = (visible) => {
        temasContainer.style.display = visible ? 'block' : 'none';
        themeButtonVisibilityToggle.checked = visible;
        localStorage.setItem('themeButtonVisible', visible);
    };

    themeButtonVisibilityToggle.addEventListener('change', () => {
        setThemeButtonVisibility(themeButtonVisibilityToggle.checked);
    });

    // Al cargar, comprueba si el botón debe ser visible.
    const themeButtonStoredVisibility = localStorage.getItem('themeButtonVisible') === 'true';
    setThemeButtonVisibility(themeButtonStoredVisibility);
    
    
    // --- FUNCIÓN DEL MICRÓFONO (BÚSQUEDA POR VOZ) ---
    // Utiliza la Web Speech API para reconocimiento de voz.
    // IMPORTANTE: Requiere que el sitio se sirva sobre HTTPS o en localhost.
    micButton.addEventListener('click', () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Lo sentimos, tu navegador no soporta la búsqueda por voz.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'es-PE'; // Español (Perú)
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            micButton.style.animation = 'pulse 1.5s infinite';
            console.log("Micrófono activado, puedes hablar.");
        };

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            console.log('Texto reconocido:', speechResult);
            
            appHeader.classList.add('search-active');
            searchInput.value = speechResult;
            searchInput.focus();
            
            // Aquí se ejecutaría la lógica para buscar con el texto.
            // Ejemplo: buscarEnLaApp(speechResult);
        };

        recognition.onerror = (event) => {
            console.error("Error en el reconocimiento de voz:", event.error);
            alert(`Error de reconocimiento: ${event.error}`);
        };
        
        recognition.onend = () => {
            micButton.style.animation = ''; // Detiene la animación
            console.log("Reconocimiento de voz finalizado.");
        };

        recognition.start();
    });
});

// Para la animación del micrófono, puedes añadir este CSS a tu 'style.css'
/*
@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.2);
        opacity: 0.7;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
*/
