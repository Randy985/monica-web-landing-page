(function () {
    'use strict';

    var form = document.getElementById('contact-form');
    if (!form) return;
    var button = document.getElementById('contact-submit');
    var status = form.querySelector('.form-message');
    var fields = Array.from(form.querySelectorAll('input, textarea'));
    var unavailable = 'El envío todavía no está disponible. Tu consulta no se ha enviado ni guardado.';

    function validate(field) {
        var message = '';
        if (!field.value.trim()) message = 'Completa este campo.';
        else if (field.validity.typeMismatch) message = 'Introduce un correo electrónico válido.';
        else if (field.validity.tooLong) message = 'El texto supera la longitud permitida.';
        field.setAttribute('aria-invalid', String(Boolean(message)));
        document.getElementById(field.getAttribute('aria-describedby')).textContent = message;
        return !message;
    }

    function review(event) {
        event.preventDefault();
        var invalid = fields.filter(function (field) { return !validate(field); });
        if (invalid.length) {
            status.textContent = 'Revisa los campos indicados. ' + unavailable;
            invalid[0].focus();
        } else {
            status.textContent = unavailable;
        }
    }
    fields.forEach(function (field) {
        field.addEventListener('blur', function () { validate(field); });
        field.addEventListener('input', function () {
            if (field.hasAttribute('aria-invalid')) validate(field);
            status.textContent = '';
        });
    });
    // The button stays non-submitting: no endpoint, request or storage is used.
    button.addEventListener('click', review);
    form.addEventListener('submit', review);
    button.disabled = false;
})();
