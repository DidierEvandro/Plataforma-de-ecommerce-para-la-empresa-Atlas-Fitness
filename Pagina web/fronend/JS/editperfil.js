// Activar/desactivar campos al hacer clic en el ícono de editar
document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', function () {
        const input = this.previousElementSibling;
        input.disabled = !input.disabled;
        this.innerHTML = input.disabled ? '<i class="fas fa-edit"></i>' : '<i class="fas fa-check"></i>';
        if (!input.disabled) input.focus();
    });
});

// Manejar el envío del formulario
document.getElementById('profileForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Cambios guardados exitosamente.');
});

// Cambio de foto de perfil (simulación)
document.querySelectorAll('.avatar-edit-btn').forEach(button => {
    button.addEventListener('click', function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (evt) {
                    document.querySelector('.profile-avatar').src = evt.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });
});

//Mostrar contraseña
document.querySelectorAll('.edit-btn[aria-label="Editar contraseña"]').forEach(btn => {
    btn.addEventListener('click', function () {
        const input = document.getElementById('clave');
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.querySelector('i').classList.toggle('fa-eye'); //contaseña oculta
        btn.querySelector('i').classList.toggle('fa-eye-slash'); //contraseña visible
    });
});

//Confirmacion antes de guardar cambios
document.getElementById('profileForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Detenemos el envío primero
    {
        alert('Cambios guardados exitosamente.');
        this.submit(); // Envía el formulario manualmente
    }
});
