document.addEventListener("DOMContentLoaded", function () {
    // 1. Manejo de datos del plan y coach
    const plan = localStorage.getItem("plan") || "plan-trimestral";
    const coach = localStorage.getItem("coach") || "No";
    
    document.getElementById("planSeleccionado").value = plan;
    document.getElementById("coachIncluido").value = coach;

    // 2. Función para mostrar/ocultar contraseña
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const inputField = this.closest('.input-field');
            const input = inputField.querySelector('input[type="password"], input[type="text"]');
            
            if (!input) return;
            
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            
            this.classList.toggle('fa-eye', !isPassword);
            this.classList.toggle('fa-eye-slash', isPassword);
            this.style.color = isPassword ? '#aaa' : '#f9b519';
        });
    });

    // 3. Función para evaluar fortaleza de contraseña
    function checkPasswordStrength(password) {
        const strengthBar = document.getElementById('password-strength-bar');
        const strengthText = document.getElementById('password-strength-text');
        
        if (!password) {
            strengthBar.style.width = '0';
            strengthText.textContent = '';
            strengthBar.className = 'password-strength-bar';
            return 0;
        }

        let strength = 0;
        
        // Longitud mínima
        if (password.length >= 8) strength += 1;
        
        // Contiene mayúsculas y minúsculas
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
        
        // Contiene números
        if (/\d/.test(password)) strength += 1;
        
        // Contiene caracteres especiales
        if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

        // Actualizar UI
        switch(strength) {
            case 0:
            case 1:
                strengthBar.className = 'password-strength-bar weak';
                strengthText.textContent = 'Muy débil';
                strengthText.style.color = '#ff4d4d';
                break;
            case 2:
                strengthBar.className = 'password-strength-bar medium';
                strengthText.textContent = 'Moderada';
                strengthText.style.color = '#ffcc00';
                break;
            case 3:
                strengthBar.className = 'password-strength-bar medium';
                strengthText.textContent = 'Buena';
                strengthText.style.color = '#ffcc00';
                break;
            case 4:
                strengthBar.className = 'password-strength-bar strong';
                strengthText.textContent = 'Muy fuerte';
                strengthText.style.color = '#00cc66';
                break;
        }
        
        return strength;
    }

    // 4. Configuración de validaciones
    const setupValidation = () => {
        const form = document.getElementById("registroForm");
        const contrasenaInput = document.getElementById("contrasena");
        const confirmarInput = document.getElementById("confirmarContrasena");
        const dniInput = document.getElementById("dni");
        const telefonoInput = document.getElementById("telefono");
        const fechaInput = document.getElementById("fecha_nacimiento");
        const mensajeRegistro = document.getElementById("mensajeRegistro");

        // Validación de DNI (8 dígitos)
        dniInput.addEventListener("input", (e) => {
            if (!/^\d{0,8}$/.test(e.target.value)) {
                dniInput.setCustomValidity("El DNI debe contener solo números (8 dígitos)");
            } else {
                dniInput.setCustomValidity("");
            }
        });

        // Validación de teléfono (9 dígitos)
        telefonoInput.addEventListener("input", (e) => {
            const value = e.target.value.replace(/\D/g, '');
            e.target.value = value;
            
            if (value.length !== 9 && value.length > 0) {
                telefonoInput.setCustomValidity("El teléfono debe tener 9 dígitos");
            } else {
                telefonoInput.setCustomValidity("");
            }
        });

        // Validación de contraseña
        contrasenaInput.addEventListener("input", (e) => {
            checkPasswordStrength(e.target.value);
            validatePasswordMatch();
        });

        // Validación de coincidencia de contraseñas
        const validatePasswordMatch = () => {
            if (contrasenaInput.value !== confirmarInput.value && confirmarInput.value !== "") {
                confirmarInput.setCustomValidity("Las contraseñas no coinciden");
            } else {
                confirmarInput.setCustomValidity("");
            }
        };

        confirmarInput.addEventListener("input", validatePasswordMatch);

        // Validación de edad mínima (14 años)
        fechaInput.addEventListener("change", () => {
            const fechaNacimiento = new Date(fechaInput.value);
            if (isNaN(fechaNacimiento.getTime())) return;
            
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
            const mes = hoy.getMonth() - fechaNacimiento.getMonth();
            
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                edad--;
            }
            
            if (edad < 14) {
                fechaInput.setCustomValidity("Debes tener al menos 14 años para registrarte");
            } else {
                fechaInput.setCustomValidity("");
            }
        });

        // Manejo del envío del formulario
        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            
            // Validaciones adicionales antes de enviar
            const passwordStrength = checkPasswordStrength(contrasenaInput.value);
            if (passwordStrength < 2) {
                mensajeRegistro.textContent = "La contraseña es demasiado débil. Debe incluir mayúsculas, minúsculas y números.";
                mensajeRegistro.style.color = "red";
                return;
            }
            
            if (telefonoInput.value.length !== 9) {
                telefonoInput.setCustomValidity("El teléfono debe tener 9 dígitos");
                telefonoInput.reportValidity();
                return;
            }
            
            validatePasswordMatch();
            
            if (!form.checkValidity()) {
                mensajeRegistro.textContent = "Por favor, completa todos los campos correctamente.";
                mensajeRegistro.style.color = "red";
                form.reportValidity();
                return;
            }

            mensajeRegistro.textContent = "Registrando...";
            mensajeRegistro.style.color = "green";

            try {
                // Simulando envío del formulario (reemplazar con tu lógica real)
                const response = await submitForm(form);
                
                if (response.success) {
                    mostrarMensajeExito();
                } else {
                    mostrarMensajeError();
                }
            } catch (error) {
                console.error("Error:", error);
                mostrarMensajeError();
            }
        });
    };

    // Funciones para mostrar mensajes
    function mostrarMensajeExito() {
        document.getElementById('formularioRegistro').style.display = 'none';
        document.querySelector('.success-container').style.display = 'flex';
        localStorage.removeItem("plan");
        localStorage.removeItem("coach");
    }

    function mostrarMensajeError() {
        document.getElementById('formularioRegistro').style.display = 'none';
        document.querySelector('.error-container').style.display = 'flex';
    }

    // Función simulada para enviar el formulario
    function submitForm(form) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulando una respuesta exitosa del servidor
                // En producción, reemplazar con fetch() o similar
                resolve({ success: true }); // Cambiar a false para simular error
            }, 1500);
        });
    }

    setupValidation();
});