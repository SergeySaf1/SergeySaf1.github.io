document.addEventListener('DOMContentLoaded', function() {
    const config = {
        telegram: 'https://t.me/Serg_sss3',
        whatsapp: 'https://wa.me/79259713336',
        yandexFormId: '6824fddf02848f31aca9a437'
    };

    // Обработчики кнопок мессенджеров
    document.querySelectorAll('.auth-btn.telegram').forEach(btn => {
        btn.addEventListener('click', () => {
            window.open(`${config.telegram}?text=Хочу записаться на ламинирование бровей`);
        });
    });

    document.querySelectorAll('.auth-btn.whatsapp').forEach(btn => {
        btn.addEventListener('click', () => {
            window.open(`${config.whatsapp}?text=Хочу записаться на ламинирование бровей`);
        });
    });

    // Обработка формы
    document.getElementById('bookingForm')?.addEventListener('submit', function(e) {
        e.preventDefault();

        // Собираем данные с сайта
        const formData = {
            name: document.getElementById('name').value,
            // Фамилия не запрашивается на сайте - оставляем пустой или просим ввести
            lastName: '', 
            phone: document.getElementById('phone').value,
            date: window.calendar?.selectedDate || '',
            time: window.calendar?.selectedTime || '',
            // Услуга по умолчанию - можно добавить выбор на сайте
            service: 'ламинирование' 
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

        // Отправляем в Яндекс Форму
        submitToYandexForm(formData, config.yandexFormId);
    });

    // Функция отправки данных
    function submitToYandexForm(data, formId) {
        // Создаем временную форму
        const form = document.createElement('form');
        form.action = `https://forms.yandex.ru/u/${formId}/`;
        form.method = 'POST';
        form.target = '_blank';
        form.style.display = 'none';

        // Поля формы (должны соответствовать полям в Яндекс Форме)
        const fields = {
            'Имя': data.name,
            'Фамилия': data.lastName,
            'Телефон': data.phone,
            'Дата': data.date,
            'Время': data.time,
            'Услуга': data.service
        };

        // Добавляем поля в форму
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

        // Уведомление пользователю
        alert(`Ваша заявка принята! Вы будете перенаправлены на страницу подтверждения.`);
    }
});