class BookingCalendar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedTime = null;
        this.workHours = ['09:30', '11:30', '13:30', '15:30', '17:30'];
        this.bookedSlots = [];
        
        // Делаем экземпляр доступным глобально
        window.calendar = this;
        
        this.init();
    }

    async init() {
        await this.loadBookingsFromGitLab();
        this.renderCalendar();
    }

    async loadBookingsFromGitLab() {
        try {
            const response = await fetch('https://api.github.com/repos/SergeySaf1/Sait/contents/New/bookings.json');
            const data = await response.json();
            const bookings = JSON.parse(atob(data.content));
            
            this.bookedSlots = bookings.map(item => ({
                date: item.date,
                time: item.time
            }));
            
        } catch (error) {
            console.log('Используем локальные данные');
            this.bookedSlots = [
                { date: '2025-06-15', time: '11:30' },
                { date: '2025-06-16', time: '15:30' }
            ];
        }
    }

    renderCalendar() {
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
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            calendarHTML += `
                <div class="calendar-day ${isWeekend || isPast ? 'disabled' : ''}" 
                     data-date="${dateStr}">
                    ${day}
                </div>
            `;
        }
        
        calendarHTML += `</div><div class="time-slots" id="timeSlots"></div>`;
        this.container.innerHTML = calendarHTML;
        
        // Назначаем обработчики после рендеринга
        this.setupEventListeners();
    }

    renderTimeSlots(date) {
        const timeSlotsContainer = document.getElementById('timeSlots');
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
        // Обработчики для кнопок переключения месяцев
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
        
        // Обработчики для дней календаря
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

    getMonthName(monthIndex) {
        const months = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        return months[monthIndex];
    }

    // Метод для получения выбранной даты и времени
    getSelectedBooking() {
        if (this.selectedDate && this.selectedTime) {
            return {
                date: this.selectedDate,
                time: this.selectedTime
            };
        }
        return null;
    }
}

// Инициализация календаря
document.addEventListener('DOMContentLoaded', () => {
    new BookingCalendar('calendarContainer');
});