window.addEventListener('scroll', function () {
    const parallax = document.querySelector('.background-img');
    let offset = window.scrollY;
    if (parallax) {
        parallax.style.transform = `translateY(${offset * -0.5}px)`; 
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('booking-form');

    if (!form) return;

    const fields = [
        {
            
            id: 'name',
            errorId: 'name-error',
            validate: value => {
                return /^[a-zA-ZåäöÅÄÖ\s]{2,}$/.test(value.trim());
            }
        },
        {
            
            id: 'phone',
            errorId: 'phone-error',
            validate: value => /^[0-9+\-\s]{7,}$/.test(value)
        },
        {
            
            id: 'email',
            errorId: 'email-error',
            validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        },
        {
            id: 'message',
            errorId: 'message-error',
            validate: value => value.trim().length > 2
        },
        {
            id: 'booking-date',
            errorId: 'date-error',
            validate: value => {
                if (!value) return false;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const selected = new Date(value);
                selected.setHours(0, 0, 0, 0);
                return selected >= today;
            }
        },
        {
            id: 'booking-time',
            errorId: 'time-error',
            validate: value => value.trim() !== ''
        }
    ];

    const guestsError = document.getElementById('guests-error');
    const guestRadios = document.querySelectorAll('input[name="guests"]');

    const guestsValid = () => Array.from(guestRadios).some(r => r.checked);


    fields.forEach(field => {
        const input = document.getElementById(field.id);
        const errEl = document.getElementById(field.errorId);
        if (!input || !errEl) return;

        input.addEventListener('input', function () {
            const isValid = field.validate(input.value);
            errEl.textContent = isValid ? '' : 'Ogiltig inmatning';
        });
    });

    guestRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            guestsError.textContent = '';
        });
    });


    form.addEventListener('submit', function (e) {
        let valid = true; 

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            const errEl = document.getElementById(field.errorId);
            if (!input || !errEl) return;

            const isValid = field.validate(input.value);
            if (!isValid) {
                errEl.textContent = 'Ogiltig inmatning';
                valid = false;
            } else {
                errEl.textContent = '';
            }
        });


        if (!guestsValid()) {
            guestsError.textContent = 'Välj antal gäster';
            valid = false;
        } else {
            guestsError.textContent = '';
        }

        if (!valid) {
            e.preventDefault();
        }
    });
});



    