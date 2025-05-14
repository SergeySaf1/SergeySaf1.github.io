document.addEventListener('DOMContentLoaded', function() {
    // Конфигурация
    const config = {
        telegram: 'https://t.me/Serg_sss3',
        whatsapp: 'https://wa.me/79259713336',
        YANDEX_OAUTH_TOKEN: 'your_yandex_oauth_token', // Замените на реальный токен
        yandexTablePath: 'Записи.xlsx',
        yandexFormId: '6824fddf02848f31aca9a437' // Замените на ID вашей формы
    };

    // Обработчики кнопок мессенджеров
    document.querySelector('.auth-btn.telegram').addEventListener('click', () => {
        window.open(`${config.telegram}?text=Хочу записаться на ламинирование бровей`);
    });

    document.querySelector('.auth-btn.whatsapp').addEventListener('click', () => {
        window.open(`${config.whatsapp}?text=Хочу записаться на ламинирование бровей`);
    });

    // Обработка формы
    document.getElementById('bookingForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            date: window.calendar.selectedDate,
            time: window.calendar.selectedTime,
            service: 'Ламинирование бровей',
            timestamp: new Date().toISOString()
        };

        // Валидация данных
        if (!formData.date || !formData.time) {
            alert('Пожалуйста, выберите дату и время');
            return;
        }

        if (!/^\+?\d{10,15}$/.test(formData.phone)) {
            alert('Введите корректный номер телефона');
            return;
        }

        try {
            // 1. Проверяем доступность слота
            if (!await isTimeSlotAvailable(formData.date, formData.time)) {
                alert('Это время уже занято, пожалуйста, выберите другое');
                return;
            }

            // 2. Сохраняем в Яндекс.Таблицу
            await saveToYandexTable(formData);
            
            // 3. Отправляем уведомление
            const message = `✅ Новая запись!\n👤 ${formData.name}\n📞 ${formData.phone}\n📅 ${formData.date} ${formData.time}\n💅 ${formData.service}`;
            window.open(`${config.telegram}?text=${encodeURIComponent(message)}`, '_blank');
            
            // 4. Открываем Яндекс.Форму для подтверждения
            openYandexForm(formData, config.yandexFormId);
            
            // 5. Обновляем интерфейс
            alert(`Запись подтверждена на ${formData.date} в ${formData.time}`);
            window.calendar.bookedSlots.push({ date: formData.date, time: formData.time });
            window.calendar.renderTimeSlots(formData.date);
            
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при сохранении записи');
        }
    });

    // Проверка доступности времени
    async function isTimeSlotAvailable(date, time) {
        try {
            const bookings = await loadBookingsFromYandexTable();
            return !bookings.some(booking => 
                booking.date === date && booking.time === time
            );
        } catch (error) {
            console.error('Ошибка проверки времени:', error);
            return true; // В случае ошибки разрешаем запись
        }
    }

    // Загрузка данных из Яндекс.Таблицы
    async function loadBookingsFromYandexTable() {
        try {
            const response = await fetch(
                `https://cloud-api.yandex.net/v1/disk/resources/download?path=${encodeURIComponent(config.yandexTablePath)}`,
                { headers: { "Authorization": `OAuth ${config.YANDEX_OAUTH_TOKEN}` } }
            );
            const data = await response.json();
            const file = await fetch(data.href);
            const bookings = await file.json();
            
            return bookings.map(item => ({
                date: item.date,
                time: item.time
            }));
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
            return [];
        }
    }

    // Сохранение в Яндекс.Таблицу
    async function saveToYandexTable(data) {
        try {
            // 1. Получаем текущие данные
            const currentData = await loadBookingsFromYandexTable();
            currentData.push(data);
            
            // 2. Обновляем файл
            const response = await fetch(
                `https://cloud-api.yandex.net/v1/disk/resources/upload?path=${encodeURIComponent(config.yandexTablePath)}`,
                {
                    method: "PUT",
                    headers: { 
                        "Authorization": `OAuth ${config.YANDEX_OAUTH_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(currentData)
                }
            );
            
            if (!response.ok) {
                throw new Error('Ошибка сохранения данных');
            }
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            throw error;
        }
    }

    // Открытие Яндекс.Формы с автозаполнением
    function openYandexForm(data, formId) {
        const params = new URLSearchParams({
            "field1": data.name,    // Имя
            "field2": data.phone,    // Телефон
            "field3": data.date,     // Дата
            "field4": data.time,     // Время
            "field5": data.service   // Услуга
        });
        window.open(`https://forms.yandex.ru/u/${formId}/?${params}`, "_blank");
    }
});