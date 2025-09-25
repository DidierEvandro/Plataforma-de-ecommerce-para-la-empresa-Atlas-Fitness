document.addEventListener('DOMContentLoaded', function () {

    // Obtener instancias de los modales de Bootstrap
    const changePlanModal = new bootstrap.Modal(document.getElementById('changePlanModal'));
    const cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));

    // Botones para abrir modal de cambio de plan
    const cambiarPlanButtons = document.querySelectorAll('.btn-cambiar-plan');
    const changePlanText = document.querySelector('#changePlanModal .modal-body p strong');

    cambiarPlanButtons.forEach(button => {
        button.addEventListener('click', function () {
            const planCard = button.closest('.card');
            const planName = planCard.querySelector('.card-title')?.textContent || 'el nuevo plan';

            // Cambiar el texto dentro del modal
            changePlanText.textContent = planName;

            // Mostrar el modal
            changePlanModal.show();
        });
    });

    // Botón para abrir modal de cancelación
    const cancelarBtn = document.querySelector('.btn-cancelar-membresia');
    cancelarBtn?.addEventListener('click', function () {
        cancelModal.show();
    });

    // Confirmación de cancelación
    const confirmCancelBtn = document.querySelector('#cancelModal .btn-danger');
    confirmCancelBtn?.addEventListener('click', function () {
        const reason = document.getElementById('cancelReason').value;
        alert('Membresía cancelada.\nRazón: ' + (reason || 'No especificada'));
        cancelModal.hide();
    });

    // Confirmación de cambio de plan
    const confirmChangeBtn = document.querySelector('#changePlanModal .btn-primary-custom');
    confirmChangeBtn?.addEventListener('click', function () {
        const selectedPlan = changePlanText.textContent;
        alert(`Plan cambiado a: ${selectedPlan}. Será efectivo en la próxima fecha de pago.`);
        changePlanModal.hide();
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Modal de cambio de plan
    const changePlanModal = new bootstrap.Modal(document.getElementById('changePlanModal'));
    const changePlanText = document.querySelector('#changePlanModal .modal-body p strong');

    document.querySelectorAll('.btn-cambiar-plan').forEach(button => {
        button.addEventListener('click', function () {
            const planCard = button.closest('.card');
            const planName = planCard.querySelector('.card-title')?.textContent || 'el nuevo plan';
            changePlanText.textContent = planName;
            changePlanModal.show();
        });
    });

    document.querySelector('#changePlanModal .btn-primary-custom')?.addEventListener('click', function () {
        const selectedPlan = changePlanText.textContent;
        alert(`Tu plan ha sido cambiado a: ${selectedPlan}`);
        changePlanModal.hide();
    });

    // Modal de cancelación de membresía
    const cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));
    document.querySelector('.btn-cancelar-membresia')?.addEventListener('click', function () {
        cancelModal.show();
    });

    document.querySelector('#cancelModal .btn-danger')?.addEventListener('click', function () {
        const reason = document.getElementById('cancelReason').value.trim();
        alert(`Tu membresía ha sido cancelada.\nMotivo: ${reason || 'No especificado'}`);
        cancelModal.hide();
    });
});
