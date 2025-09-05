 // Variables globales
        let imgSpace = document.getElementsByClassName('space-img');
        
        let contenedorModal = document.getElementById('contenedor-modal');
        let indiceActual;

        // Crear elementos de navegación una sola vez
        let flechaIzquierda = document.createElement('i');
        flechaIzquierda.setAttribute('class', 'fas fa-arrow-left flecha-izquierda');
        flechaIzquierda.addEventListener('click', mostrarImagenAnterior);

        let flechaDerecha = document.createElement('i');
        flechaDerecha.setAttribute('class', 'fas fa-arrow-right flecha-derecha');
        flechaDerecha.addEventListener('click', mostrarImagenSiguiente);

        // Función para desplegar el modal
        function desplegarModal() {
            let rutaImagen = this.getAttribute('src');
            let textoImagen = this.getAttribute('alt');
            let tituloImagen = this.getAttribute('data-title') || 'Espacio del jardín';

            // Crear estructura del modal
            let modal = document.createElement('div');
            modal.setAttribute('class', 'modal');
            modal.setAttribute('id', 'modal');

            let modalContentWrapper = document.createElement('div');
            modalContentWrapper.setAttribute('class', 'modal-content-wrapper');

            let imagenModal = document.createElement('img');
            imagenModal.setAttribute('src', rutaImagen);
            imagenModal.setAttribute('alt', tituloImagen);

            let textoModal = document.createElement('p');
            textoModal.textContent = textoImagen;

            // Crear botón cerrar
            let btnModalCerrar = document.createElement('div');
            btnModalCerrar.setAttribute('class', 'btn-cerrar');
            btnModalCerrar.setAttribute('id', 'btnCerrar');
            btnModalCerrar.addEventListener('click', cerrarModal);

            let xCerrar = document.createElement('i');
            xCerrar.setAttribute('class', 'fa fa-times');
            btnModalCerrar.appendChild(xCerrar);

            // Crear contador
            let contador = document.createElement('div');
            contador.setAttribute('class', 'modal-counter');
            contador.setAttribute('id', 'modal-counter');

            // Encontrar índice actual
            for (let i = 0; i < imgSpace.length; i++) {
                if (imgSpace[i] === this) {
                    indiceActual = i;
                    break;
                }
            }

            // Actualizar contador
            contador.textContent = `${indiceActual + 1} / ${imgSpace.length}`;

            // Ensamblar modal
            modalContentWrapper.appendChild(imagenModal);
            modalContentWrapper.appendChild(textoModal);
            modalContentWrapper.appendChild(btnModalCerrar);
            modalContentWrapper.appendChild(contador);
            modalContentWrapper.appendChild(flechaIzquierda.cloneNode(true));
            modalContentWrapper.appendChild(flechaDerecha.cloneNode(true));

            // Re-agregar event listeners a las flechas clonadas
            modalContentWrapper.querySelector('.flecha-izquierda').addEventListener('click', mostrarImagenAnterior);
            modalContentWrapper.querySelector('.flecha-derecha').addEventListener('click', mostrarImagenSiguiente);

            modal.appendChild(modalContentWrapper);
            contenedorModal.appendChild(modal);

            // Prevenir scroll del body
            document.body.style.overflow = 'hidden';

            // Cerrar modal al hacer clic en el fondo
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cerrarModal();
                }
            });
        }

        // Función para cerrar modal
        function cerrarModal() {
            let modal = document.getElementById('modal');
            if (modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        }

        // Función para mostrar imagen siguiente
        function mostrarImagenSiguiente() {
            indiceActual = (indiceActual + 1) % imgSpace.length;
            actualizarModalImagen();
        }

        // Función para mostrar imagen anterior
        function mostrarImagenAnterior() {
            indiceActual = (indiceActual - 1 + imgSpace.length) % imgSpace.length;
            actualizarModalImagen();
        }

        // Función para actualizar la imagen del modal
        function actualizarModalImagen() {
            let modalImg = document.querySelector('.modal img');
            let modalTexto = document.querySelector('.modal p');
            let modalContador = document.getElementById('modal-counter');

            if (modalImg && modalTexto && modalContador) {
                let nuevaImagen = imgSpace[indiceActual];
                modalImg.setAttribute('src', nuevaImagen.getAttribute('src'));
                modalImg.setAttribute('alt', nuevaImagen.getAttribute('data-title') || 'Espacio del jardín');
                modalTexto.textContent = nuevaImagen.getAttribute('alt');
                modalContador.textContent = `${indiceActual + 1} / ${imgSpace.length}`;
            }
        }

        // Event listeners para las imágenes
        for (let i = 0; i < imgSpace.length; i++) {
            imgSpace[i].addEventListener('click', desplegarModal);
        }

        // Event listener para cerrar con Escape
        window.addEventListener("keydown", (event) => {
            if (event.key === 'Escape') {
                cerrarModal();
            }
            
            // Navegación con teclado
            if (document.getElementById('modal')) {
                if (event.key === 'ArrowLeft') {
                    mostrarImagenAnterior();
                } else if (event.key === 'ArrowRight') {
                    mostrarImagenSiguiente();
                }
            }
        });