const plans = {
            interdiario: {
                name: "Plan Interdiario",
                price: 50,
                features: [
                    "Lunes, Miércoles, Viernes",
                    "Acceso 6:00 am - 10:00 pm",
                    "Área de máquinas y pesas"
                ]
            },
            mensual: {
                name: "Plan Mensual",
                price: 80,
                features: [
                    "Acceso ilimitado",
                    "6:00 am - 10:00 pm",
                    "Todas las áreas"
                ]
            },
            trimestral: {
                name: "Plan Trimestral",
                price: 200,
                features: [
                    "Acceso ilimitado",
                    "6:00 am - 10:00 pm",
                    "Todas las áreas",
                    "1 clase grupal gratis"
                ]
            },
            semestral: {
                name: "Plan Semestral",
                price: 400,
                features: [
                    "Acceso ilimitado",
                    "6:00 am - 10:00 pm",
                    "Todas las áreas",
                    "2 clases grupales gratis"
                ]
            },
            anual: {
                name: "Plan Anual",
                price: 700,
                features: [
                    "Acceso ilimitado",
                    "6:00 am - 10:00 pm",
                    "Todas las áreas",
                    "1 mes gratis + 4 clases"
                ]
            }
        };

        // DOM Elements
        const planSection = document.getElementById('plan-section');
        const registrationSection = document.getElementById('registration-section');
        const paymentSection = document.getElementById('payment-section');
        const successModal = document.getElementById('successModal');
        const btnContinueRegister = document.getElementById('btn-continue-register');
        const backToPlans = document.getElementById('back-to-plans');
        const backToRegister = document.getElementById('back-to-register');
        const continueBtn = document.getElementById('continueBtn');
        const planCheckboxes = document.querySelectorAll('.plan-checkbox');
        const coachCheckbox = document.getElementById('coach-checkbox');
        const registroForm = document.getElementById('registroForm');
        const paymentForm = document.getElementById('paymentForm');
        const planSeleccionadoInput = document.getElementById('planSeleccionado');
        const coachIncluidoInput = document.getElementById('coachIncluido');

        // Current selected plan
        let selectedPlan = 'trimestral';
        let coachIncluded = false;

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            // Set current date for transaction
            const today = new Date();
            document.getElementById('transaction-date').textContent = 
                `${today.getDate().toString().padStart(2, '0')}/` +
                `${(today.getMonth()+1).toString().padStart(2, '0')}/` +
                `${today.getFullYear()}`;
            
            // Generate random transaction number
            document.getElementById('transaction-number').textContent = 
                Math.floor(10000000 + Math.random() * 90000000);
        });

        // Plan selection
        planCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    selectedPlan = this.value;
                    updatePlanSummary();
                }
            });
        });

        // Coach selection
        coachCheckbox.addEventListener('change', function() {
            coachIncluded = this.checked;
            coachIncluidoInput.value = coachIncluded ? '1' : '0';
            updatePlanSummary();
        });

        // Update plan summary
        function updatePlanSummary() {
            const plan = plans[selectedPlan];
            const coachPrice = coachIncluded ? 30 : 0;
            const subtotal = plan.price + coachPrice;
            const igv = Math.round(subtotal * 0.18 * 100) / 100;
            const total = subtotal + igv;

            // Update summary in plan section
            document.querySelector('.plan-name').textContent = plan.name;
            
            // Update registration form hidden fields
            planSeleccionadoInput.value = selectedPlan;
            
            // Update payment summary
            document.getElementById('summary-plan-name').textContent = plan.name;
            document.getElementById('summary-plan-price').textContent = plan.price;
            
            // Update features list
            const featuresList = document.getElementById('summary-plan-features');
            featuresList.innerHTML = '';
            plan.features.forEach(feature => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
                featuresList.appendChild(li);
            });
            
            if (coachIncluded) {
                const li = document.createElement('li');
                li.innerHTML = '<i class="fas fa-check"></i> Entrenador personal incluido';
                featuresList.appendChild(li);
            }
            
            // Update prices
            document.getElementById('subtotal').textContent = subtotal.toFixed(2);
            document.getElementById('igv').textContent = igv.toFixed(2);
            document.getElementById('total').textContent = total.toFixed(2);
            document.getElementById('payment-total').textContent = total.toFixed(2);
            document.getElementById('transaction-total').textContent = total.toFixed(2);
        }

        // Navigation between sections
        btnContinueRegister.addEventListener('click', function() {
            planSection.style.display = 'none';
            registrationSection.style.display = 'block';
            
            // Update payment steps
            document.querySelectorAll('.payment-steps .step').forEach(step => {
                step.classList.remove('active');
            });
            document.querySelectorAll('.payment-steps .step')[1].classList.add('active');
        });

        backToPlans.addEventListener('click', function() {
            paymentSection.style.display = 'none';
            planSection.style.display = 'block';
        });

        backToRegister.addEventListener('click', function() {
            paymentSection.style.display = 'none';
            registrationSection.style.display = 'block';
        });

        // Form submissions
        registroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate passwords match
            const password = document.getElementById('contrasena').value;
            const confirmPassword = document.getElementById('confirmar-contrasena').value;
            
            if (password !== confirmPassword) {
                document.getElementById('mensajeRegistro').textContent = 'Las contraseñas no coinciden';
                document.getElementById('mensajeRegistro').style.color = 'red';
                return;
            }
            
            // If validation passes, proceed to payment
            registrationSection.style.display = 'none';
            paymentSection.style.display = 'block';
            
            // Update payment steps
            document.querySelectorAll('.payment-steps .step').forEach(step => {
                step.classList.remove('active');
            });
            document.querySelectorAll('.payment-steps .step')[2].classList.add('active');
            
            // Pre-fill billing email
            document.getElementById('billing-email').value = document.getElementById('correo').value;
        });

        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Process payment (simulated)
            paymentSection.style.display = 'none';
            successModal.style.display = 'flex';
        });

        continueBtn.addEventListener('click', function() {
            // Redirect to user dashboard or login
            window.location.href = 'login.jsp';
        });

        // Payment method tabs
        document.querySelectorAll('.method-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const method = this.getAttribute('data-method');
                
                // Update active tab
                document.querySelectorAll('.method-tab').forEach(t => {
                    t.classList.remove('active');
                });
                this.classList.add('active');
                
                // Show corresponding content
                document.querySelectorAll('.method-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${method}-method`).classList.add('active');
            });
        });

        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const textToCopy = this.parentElement.querySelector('strong').textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Copiado';
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                });
            });
        });

        // Password strength meter
        document.getElementById('contrasena').addEventListener('input', function() {
            const password = this.value;
            const strengthBar = document.getElementById('password-strength-bar');
            const strengthText = document.getElementById('password-strength-text');
            
            // Calculate strength
            let strength = 0;
            if (password.length > 0) strength += 1;
            if (password.length >= 8) strength += 1;
            if (/[A-Z]/.test(password)) strength += 1;
            if (/[0-9]/.test(password)) strength += 1;
            if (/[^A-Za-z0-9]/.test(password)) strength += 1;
            
            // Update UI
            const width = strength * 20;
            strengthBar.style.width = `${width}%`;
            
            // Update text and color
            if (password.length === 0) {
                strengthText.textContent = '';
                strengthBar.style.backgroundColor = 'transparent';
            } else if (strength <= 2) {
                strengthText.textContent = 'Débil';
                strengthBar.style.backgroundColor = '#ff4d4d';
            } else if (strength <= 3) {
                strengthText.textContent = 'Moderada';
                strengthBar.style.backgroundColor = '#ffcc00';
            } else {
                strengthText.textContent = 'Fuerte';
                strengthBar.style.backgroundColor = '#4CAF50';
            }
        });

        // Toggle password visibility
        document.querySelectorAll('.toggle-password').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const input = this.previousElementSibling;
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        });

        // Card number formatting
        document.getElementById('card-number').addEventListener('input', function() {
            let value = this.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formatted = '';
            
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) formatted += ' ';
                formatted += value[i];
            }
            
            this.value = formatted;
        });

        // Card expiry formatting
        document.getElementById('card-expiry').addEventListener('input', function() {
            let value = this.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formatted = '';
            
            for (let i = 0; i < value.length; i++) {
                if (i === 2) formatted += '/';
                formatted += value[i];
            }
            
            this.value = formatted;
        });