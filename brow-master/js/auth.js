document.addEventListener('DOMContentLoaded', function() {
    // Конфигурация
    const config = {
        telegram: 'https://t.me/Serg_sss3',
        whatsapp: 'https://wa.me/79259713336',
        apiEndpoint: 'https://api.github.com/repos/SergeySaf1/Sait/contents/New/bookings.json'
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

        try {
            // 1. Отправляем в GitLab
            await saveBookingToGitLab(formData);
            
            // 2. Отправляем уведомление
            const message = `✅ Новая запись!\n👤 ${formData.name}\n📞 ${formData.phone}\n📅 ${formData.date} ${formData.time}\n💅 ${formData.service}`;
            window.open(`${config.telegram}?text=${encodeURIComponent(message)}`, '_blank');
            
            // 3. Обновляем интерфейс
            alert(`Запись подтверждена на ${formData.date} в ${formData.time}`);
            window.calendar.bookedSlots.push({ date: formData.date, time: formData.time });
            window.calendar.renderTimeSlots(formData.date);
            
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при сохранении записи');
        }
    });
});

// Функция сохранения в GitLab
async function saveBookingToGitLab(data) {
    const GITLAB_TOKEN = 'your_github_token'; // Замените на реальный токен
    const filePath = 'New/bookings.json';
    
    // 1. Получаем текущее содержимое файла
    const response = await fetch(`https://api.github.com/repos/SergeySaf1/Sait/contents/${filePath}`, {
        headers: { 'Authorization': `token ${GITLAB_TOKEN}` }
    });
    
    const fileData = await response.json();
    const currentContent = JSON.parse(atob(fileData.content));
    currentContent.push(data);
    
    // 2. Обновляем файл
    await fetch(`https://api.github.com/repos/SergeySaf1/Sait/contents/${filePath}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITLAB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Добавлена новая запись',
            content: btoa(JSON.stringify(currentContent, null, 2)),
            sha: fileData.sha
        })
    });
}