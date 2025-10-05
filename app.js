const calendarData = {
    year: 2025,
    months: [
        {name: "Janeiro", number: 1, days: 31},
        {name: "Fevereiro", number: 2, days: 28},
        {name: "Março", number: 3, days: 31},
        {name: "Abril", number: 4, days: 30},
        {name: "Maio", number: 5, days: 31},
        {name: "Junho", number: 6, days: 30},
        {name: "Julho", number: 7, days: 31},
        {name: "Agosto", number: 8, days: 31},
        {name: "Setembro", number: 9, days: 30},
        {name: "Outubro", number: 10, days: 31},
        {name: "Novembro", number: 11, days: 30},
        {name: "Dezembro", number: 12, days: 31}
    ],
    weekdays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
};

// Dados em memória
let dateNames = {};
let dateColors = {};

// Variáveis do modal
let currentSelectedDate = null;

// Elementos
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const nameInput = document.getElementById('name-input');
const colorInput = document.getElementById('color-input');
const btnSave = document.getElementById('btn-save');
const btnCancel = document.getElementById('btn-cancel');
const btnClear = document.getElementById('btn-clear');

// Renderização do calendário
function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';
    calendarData.months.forEach(month => {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month-container';

        const monthTitle = document.createElement('div');
        monthTitle.className = 'month-title';
        monthTitle.innerText = month.name;
        monthDiv.appendChild(monthTitle);

        // Dias da semana
        const weekRow = document.createElement('div');
        weekRow.className = 'week-row';
        calendarData.weekdays.forEach(weekday => {
            const weekDayDiv = document.createElement('div');
            weekDayDiv.className = 'weekday';
            weekDayDiv.innerText = weekday;
            weekRow.appendChild(weekDayDiv);
        });
        monthDiv.appendChild(weekRow);

        // Dias
        const daysRow = document.createElement('div');
        daysRow.className = 'days-row';
        // Dias em branco no início
        const firstDay = new Date(calendarData.year, month.number - 1, 1).getDay();
        for (let i = 0; i < firstDay; i++) {
            const blankDiv = document.createElement('div');
            daysRow.appendChild(blankDiv);
        }
        for (let day = 1; day <= month.days; day++) {
            const dateStr = formatDate(calendarData.year, month.number, day);
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.dataset.date = dateStr;
            if (dateNames[dateStr]) {
                dayDiv.setAttribute('data-has-name', 'true');
                dayDiv.innerText = day;
                const nameSpan = document.createElement('span');
                nameSpan.className = 'day-name';
                nameSpan.innerText = dateNames[dateStr];
                dayDiv.appendChild(nameSpan);
                dayDiv.style.backgroundColor = dateColors[dateStr] || "#26C485";
                dayDiv.style.color = "#fff";
            } else {
                dayDiv.innerText = day;
                dayDiv.removeAttribute('data-has-name');
                dayDiv.style.backgroundColor = "#fff";
                dayDiv.style.color = "#21808d";
            }
            dayDiv.onclick = () => openModal(dateStr);
            daysRow.appendChild(dayDiv);
        }
        monthDiv.appendChild(daysRow);

        grid.appendChild(monthDiv);
    });
}

function formatDate(year, month, day) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Modal
function openModal(dateStr) {
    currentSelectedDate = dateStr;
    modal.classList.remove('hidden');
    nameInput.value = dateNames[dateStr] || '';
    colorInput.value = dateColors[dateStr] || "#26C485";
    nameInput.focus();
}

function closeModal() {
    modal.classList.add('hidden');
    currentSelectedDate = null;
}

btnCloseModal = () => closeModal();
modalClose.onclick = btnCloseModal;
modalOverlay.onclick = btnCloseModal;
btnCancel.onclick = btnCloseModal;

btnSave.onclick = () => {
    if (!currentSelectedDate) return;
    const nome = nameInput.value.trim();
    const cor = colorInput.value;
    if (nome !== "") {
        dateNames[currentSelectedDate] = nome;
        dateColors[currentSelectedDate] = cor || "#26C485";
    } else {
        delete dateNames[currentSelectedDate];
        delete dateColors[currentSelectedDate];
    }
    closeModal();
    renderCalendar();
};
btnClear.onclick = () => {
    if (!currentSelectedDate) return;
    delete dateNames[currentSelectedDate];
    dateColors[currentSelectedDate] = "#fff";
    closeModal();
    renderCalendar();
};

window.onload = renderCalendar;