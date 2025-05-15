class BookingCalendar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedTime = null;
        this.workHours = ['09:30', '11:30', '13:00', '15:00', '17:00', '19:00'];
        this.bookedSlots = [];
        this.workDays = [1, 2, 3, 4, 5]; // Пн-Пт
        this.workStart = 9.5; // 9:30
        this.workEnd = 19; // 19:00
        
        window.calendar = this;
        this.init();
    }

    async init() {
        try {
            // Загрузка занятых слотов (заглушка)
            this.bookedSlots = await this.loadBookings();
            this.renderCalendar();
        } catch (error) {
            console.error("Ошибка инициализации календаря:", error);
            this.renderError();
        }
    }

    async loadBookings() {
        // В реальном проекте здесь будет запрос к API
        return [
            { date: this.formatDate(new Date()), time: '11:30' },
            { date: this.formatDate(new Date(Date.now() + 86400000)), time: '15:00' }
        ];
    }

    renderCalendar() {
        if (!this.container) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        
        let calendarHTML = `
            <div class="calendar-header">
                <button id="prevMonth"><i class="fas fa-chevron-left"></i></button>
                <h3>${this.getMonthName(month)} ${year}</h3>
                <button id="nextMonth"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="calendar-weekdays">
                <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
            </div>
            <div class="calendar-days">
        `;
        
        // Пустые ячейки для дней предыдущего месяца
        for (let i = 0; i < startDay; i++) {
            calendarHTML += `<div class="calendar-day disabled"></div>`;
        }
        
        // Дни текущего месяца
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isPast = date < new Date() && date.getDate() !== new Date().getDate();
            const isWorkDay = this.workDays.includes(date.getDay());
            const dateStr = this.formatDate(date);
            
            calendarHTML += `
                <div class="calendar-day ${isWeekend || isPast || !isWorkDay ? 'disabled' : ''}" 
                     data-date="${dateStr}">
                    ${day}
                </div>
            `;
        }
        
        calendarHTML += `</div><div class="time-slots" id="timeSlots"></div>`;
        this.container.innerHTML = calendarHTML;
        this.setupEventListeners();
    }

    renderTimeSlots(date) {
        const timeSlotsContainer = document.getElementById('timeSlots');
        if (!timeSlotsContainer) return;
        
        timeSlotsContainer.innerHTML = '<h4>Доступное время:</h4>';
        
        this.workHours.forEach(time => {
            const isBooked = this.bookedSlots.some(
                slot => slot.date === date && slot.time === time
            );
            
            const timeSlot = document.createElement('div');
            timeSlot.className = `time-slot ${isBooked ? 'booked' : ''}`;
            timeSlot.textContent = time;
            timeSlot.dataset.time = time;
            
            if (!isBooked) {
                timeSlot.addEventListener('click', (e) => this.selectTimeSlot(e, time));
            }
            
            timeSlotsContainer.appendChild(timeSlot);
        });
    }

    selectTimeSlot(event, time) {
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        event.target.classList.add('selected');
        this.selectedTime = time;
    }

    setupEventListeners() {
        document.getElementById('prevMonth')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });
        
        document.getElementById('nextMonth')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
        
        document.querySelectorAll('.calendar-day:not(.disabled)').forEach(day => {
            day.addEventListener('click', () => {
                document.querySelectorAll('.calendar-day').forEach(d => {
                    d.classList.remove('selected');
                });
                
                day.classList.add('selected');
                this.selectedDate = day.dataset.date;
                this.renderTimeSlots(this.selectedDate);
            });
        });
    }

    renderError() {
        this.container.innerHTML = `
            <div class="calendar-error">
                <p>Не удалось загрузить календарь. Пожалуйста, попробуйте позже.</p>
                <button onclick="location.reload()">Обновить</button>
            </div>
        `;
    }

    formatDate(date) {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    getMonthName(monthIndex) {
        const months = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        return months[monthIndex];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BookingCalendar('calendarContainer');
});