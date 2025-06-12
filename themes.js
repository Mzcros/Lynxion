/* Euphonia/assets/js/themes.js */
/* Lógica completa para el selector de temas, incluyendo clic y pulsación larga. */

document.addEventListener('DOMContentLoaded', function () {
    // --- 1. Elementos del DOM ---
    const body = document.body;
    const themeButton = document.getElementById('theme-menu-button');
    const themePanel = document.getElementById('theme-selection-panel');
    const themeOptions = document.querySelectorAll('.theme-option-button');

    if (!themeButton) return;

    // --- 2. Variables de lógica ---
    let longPressTimer;
    let longPressFired = false;
    const LONG_PRESS_DURATION = 1000;

    const PRIMARY_THEMES = {
        dark: 'theme-id-1',
        light: 'theme-id-2'
    };

    const allThemeClasses = Array.from(themeOptions).map(opt => opt.dataset.theme);

    // --- 3. Función para aplicar tema ---
    function applyTheme(themeClass) {
        body.classList.remove(...allThemeClasses);
        body.classList.add(themeClass);
        localStorage.setItem('euphoniaTheme', themeClass);

        // Actualiza visualmente los seleccionados
        themeOptions.forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.theme === themeClass);
        });
    }

    // --- 4. Clic corto: alterna entre claro y oscuro ---
    function handleShortClick() {
        const currentTheme = body.className.match(/theme-id-\d+/)?.[0];
        const newTheme = (currentTheme === PRIMARY_THEMES.dark) ? PRIMARY_THEMES.light : PRIMARY_THEMES.dark;
        applyTheme(newTheme);
    }

    // --- 5. Pulsación larga: muestra el panel ---
    function handleLongPress() {
        themeOptions.forEach(option => {
            if (option.dataset.isPrimary === 'true') {
                option.style.display = 'none';
            } else {
                option.style.display = 'inline-block';
            }
        });
        themePanel.classList.add('visible');
    }

    // --- 6. Eventos del botón principal ---
    themeButton.addEventListener('mousedown', startPress);
    themeButton.addEventListener('touchstart', startPress);

    themeButton.addEventListener('mouseup', endPress);
    themeButton.addEventListener('touchend', endPress);
    themeButton.addEventListener('mouseleave', cancelPress);

    function startPress(e) {
        e.preventDefault();
        longPressFired = false;
        themeButton.style.transform = 'rotate(-90deg) scale(0.95)';
        longPressTimer = setTimeout(() => {
            longPressFired = true;
            handleLongPress();
        }, LONG_PRESS_DURATION);
    }

    function endPress() {
        themeButton.style.transform = 'rotate(-90deg) scale(1)';
        clearTimeout(longPressTimer);
        if (!longPressFired) handleShortClick();
    }

    function cancelPress() {
        themeButton.style.transform = 'rotate(-90deg) scale(1)';
        clearTimeout(longPressTimer);
    }

    // --- 7. Ocultar paleta al hacer clic fuera ---
    document.addEventListener('click', (event) => {
        if (!themePanel.contains(event.target) && !themeButton.contains(event.target)) {
            themePanel.classList.remove('visible');
        }
    });

    // --- 8. Clic sobre temas de la paleta ---
    themeOptions.forEach(button => {
        button.addEventListener('click', () => {
            const selectedTheme = button.dataset.theme;
            applyTheme(selectedTheme);
            themePanel.classList.remove('visible');
        });
    });

    // --- 9. Inicialización del tema guardado ---
    const savedTheme = localStorage.getItem('euphoniaTheme') || PRIMARY_THEMES.dark;
    applyTheme(savedTheme);
});
   
    // --- 10. Sincronizar con interruptor de modo oscuro ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const themeMenuButton = document.getElementById('theme-menu-button');

    if (darkModeToggle && themeMenuButton) {
        // Aplicar estado inicial desde el tema activo
        const currentTheme = body.className.match(/theme-id-\d+/)?.[0];
        darkModeToggle.checked = currentTheme === PRIMARY_THEMES.dark;
        themeMenuButton.style.display = darkModeToggle.checked ? 'block' : 'none';

        // Cambiar tema desde el interruptor
        darkModeToggle.addEventListener('change', function () {
            const newTheme = this.checked ? PRIMARY_THEMES.dark : PRIMARY_THEMES.light;
            applyTheme(newTheme);
            themeMenuButton.style.display = this.checked ? 'block' : 'none';
        });
    } 
