document.addEventListener('DOMContentLoaded', function () {
    // Mostrar y ocultar botón "Volver arriba"
    let btnBackToTop = document.getElementById('btnBackToTop');

    window.addEventListener('scroll', function () {
        // Obtener la posición actual del scroll una sola vez
        const scrollY = window.scrollY;
        // Altura específica en píxeles a partir de la cual aparece el botón
        const alturaReferencia = 300; // 300px desde el top de la página

        if (scrollY >= alturaReferencia) {
            btnBackToTop.style.marginLeft = '0px';
        } else if (scrollY <= alturaReferencia / 2) {
            btnBackToTop.style.marginLeft = '-60px';
        }
    });
});