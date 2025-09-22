// contact-form.js - Jardín Hermano Sol - Versión simplificada con toast

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', function (e) {
        // Evitamos el comportamiento predeterminado del formulario (recarga de la página)
        e.preventDefault();

        // Capturamos los valores de los campos del formulario
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const interes = document.getElementById('interes').value;
        const mensaje = document.getElementById('mensaje').value;

        // Creamos un objeto con los datos del formulario y metadatos adicionales para Firebase
        const formData = {
            name: nombre.trim(),
            lastName: apellido.trim(),
            email: email.trim().toLowerCase(),
            phone: parseInt(telefono.replace(/\s/g, '')), // Convertir a número, remover espacios
            classroom: interes, // Directo, sin mapping
            mensaje: mensaje.trim(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Timestamp del servidor
            isActive: true,               // Campo para marcar si el mensaje está activo
            statusMessage: "nuevo"        // Estado inicial del mensaje
        };

        // Función para enviar a Firebase
        function sendToFirebase() {
            return db.collection("mensajes").add(formData);
        }

        // Función para enviar a Formspree
        function sendToFormspree() {
            const formspreeUrl = 'https://formspree.io/f/xnnbnedpeeee'; // Usa tu endpoint de Formspree

            // Creamos FormData para Formspree
            const formspreeData = new FormData();
            formspreeData.append('Nombre', nombre);
            formspreeData.append('Apellido', apellido);
            formspreeData.append('Email', email);
            formspreeData.append('Telefono', telefono);
            formspreeData.append('Sala_Interes', interes);
            formspreeData.append('Mensaje', mensaje);
            formspreeData.append('_subject', `Mensaje de ${nombre} ${apellido} - ${interes}`);

            return fetch(formspreeUrl, {
                method: 'POST',
                body: formspreeData,
                headers: {
                    'Accept': 'application/json'
                }
            });
        }

        // Validación básica
        if (!nombre || !apellido || !email || !telefono || !interes || !mensaje) {
            showToast("Por favor, completa todos los campos obligatorios.", "error", 3000);
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast("Por favor, ingresa un email válido.", "error", 3000);
            return;
        }

        // Validar teléfono (solo números)
        const phoneRegex = /^\d{8,15}$/;
        if (!phoneRegex.test(telefono.replace(/\s/g, ''))) {
            showToast("El teléfono debe contener solo números (8-15 dígitos).", "error", 4000);
            return;
        }

        // Deshabilitar botón y mostrar estado de carga
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = 'Enviando...';

        // Función para restaurar el botón
        function resetButton() {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }

        // Ejecutamos ambos envíos simultáneamente
        Promise.all([sendToFirebase(), sendToFormspree()])
            .then(function (results) {
                // Verificamos que Formspree respondió correctamente
                const formspreeResponse = results[1];
                if (formspreeResponse.ok) {
                    // Ambos envíos fueron exitosos
                    showToast(
                        '¡Gracias por tu mensaje! <br><br>' +
                        'Nos pondremos en contacto muy pronto.<br><br>',
                        'success',
                        6000
                    );
                    form.reset();
                } else {
                    // Firebase exitoso, pero Formspree falló
                    showToast(
                        '¡Gracias por tu mensaje! <br><br>' +
                        'Nos pondremos en contacto muy pronto.<br><br>',
                        'success',
                        6000
                    );
                    form.reset();
                }
                resetButton();
            })
            .catch(function (error) {
                console.error('Error:', error);

                // Si hay error, intentamos al menos uno de los métodos
                // Primero intentamos solo Firebase
                sendToFirebase()
                    .then(function () {
                        showToast(
                            '¡Gracias por tu mensaje! <br><br>' +
                            'Nos pondremos en contacto muy pronto.<br><br>',
                            'success',
                            6000
                        );
                        form.reset();
                        resetButton();
                    })
                    .catch(function (firebaseError) {
                        console.error('Firebase error:', firebaseError);

                        // Si Firebase también falla, intentamos solo Formspree
                        sendToFormspree()
                            .then(function (response) {
                                if (response.ok) {
                                    showToast(
                                        '¡Gracias por tu mensaje! <br><br>' +
                                        'Nos pondremos en contacto muy pronto.<br><br>',
                                        'success',
                                        6000
                                    );
                                    form.reset();
                                } else {
                                    showToast(
                                        'Hubo un problema al enviar tu mensaje. 😔<br><br>' +
                                        'Por favor intenta nuevamente en unos minutos, o contáctanos directamente por WhatsApp.<br><br>',
                                        'error',
                                        6000
                                    );
                                }
                                resetButton();
                            })
                            .catch(function (formspreeError) {
                                console.error('Formspree error:', formspreeError);
                                showToast(
                                    'Hubo un problema al enviar tu mensaje. 😔<br><br>' +
                                    'Por favor intenta nuevamente en unos minutos, o contáctanos directamente por WhatsApp.<br><br>',
                                    'error',
                                    6000
                                );
                                resetButton();
                            });
                    });
            });
    });
});