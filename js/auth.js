document.addEventListener('DOMContentLoaded', function() {
    const config = {
        telegram: 'https://t.me/Serg_sss3',
        whatsapp: 'https://wa.me/79259713336',
        yandexFormId: '6824fddf02848f31aca9a437'
    };

    // Обработчики кнопок мессенджеров
    document.querySelectorAll('.social-btn.telegram').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(`${config.telegram}?text=Хочу записаться на ламинирование бровей`, '_blank');
        });
    });

    document.querySelectorAll('.social-btn.whatsapp').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(`${config.whatsapp}?text=Хочу записаться на ламинирование бровей`, '_blank');
        });
    });

    // Обработка формы
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const selectedServices = Array.from(document.querySelectorAll('input[name="service"]:checked'))
                .map(checkbox => checkbox.value)
                .join(', ');

            const formData = {
                name: document.getElementById('name').value,
                lastName: '',
                phone: document.getElementById('phone').value,
                service: selectedServices || 'Не указано',
                date: window.calendar?.selectedDate || '',
                time: window.calendar?.selectedTime || ''
            };

            // Валидация
            if (!formData.date || !formData.time) {
                alert('Пожалуйста, выберите дату и время');
                return;
            }

            if (!/^\+?\d{10,15}$/.test(formData.phone)) {
                alert('Введите корректный номер телефона');
                return;
            }

            if (!selectedServices) {
                alert('Пожалуйста, выберите хотя бы одну услугу');
                return;
            }

            submitToYandexForm(formData, config.yandexFormId);
        });
    }

    // Функция отправки данных
    function submitToYandexForm(data, formId) {
        const form = document.createElement('form');
        form.action = `https://forms.yandex.ru/u/${formId}/`;
        form.method = 'POST';
        form.target = '_blank';
        form.style.display = 'none';

        const fields = {
            'Имя': data.name,
            'Фамилия': data.lastName,
            'Телефон': data.phone,
            'Дата': data.date,
            'Время': data.time,
            'Услуга': data.service
        };

        for (const [name, value] of Object.entries(fields)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        alert('Ваша заявка принята! Вы будете перенаправлены на страницу подтверждения.');
    }
});