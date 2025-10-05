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
    weekdays: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
};

const presetColors = [
    "#26C485", "#FFA726", "#EF5350", "#42A5F5", "#AB47BC",
    "#FFEE58", "#8D6E63", "#789262", "#BDBDBD", "#37474F", "#fff" // adicionado branco fácil
];

let selectedColor = "#fff";
let dateNames = JSON.parse(localStorage.getItem('dateNames')) || {};
let dateColors = JSON.parse(localStorage.getItem('dateColors')) || {};
let currentSelectedDate = null;

const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const nameInput = document.getElementById('name-input');
const btnSave = document.getElementById('btn-save');
const btnCancel = document.getElementById('btn-cancel');
const btnClear = document.getElementById('btn-clear');

function renderColorOptions(current) {
    const colorOptions = document.getElementById('color-options');
    colorOptions.innerHTML = '';
    presetColors.forEach(color => {
        const btn = document.createElement('button');
        btn.className = 'color-btn';
        btn.style.backgroundColor = color;
        btn.setAttribute('type', 'button');
        if (color === current) btn.classList.add('selected');
        btn.onclick = () => {
            selectedColor = color;
            renderColorOptions(color);
        };
        colorOptions.appendChild(btn);
    });
}

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

        // Dias da semana (segunda a domingo)
        const weekRow = document.createElement('div');
        weekRow.className = 'week-row';
        calendarData.weekdays.forEach(weekday => {
            const weekDayDiv = document.createElement('div');
            weekDayDiv.className = 'weekday';
            weekDayDiv.innerText = weekday;
            weekRow.appendChild(weekDayDiv);
        });
        monthDiv.appendChild(weekRow);

        // Dias do mês, correto para segunda-feira
        const daysRow = document.createElement('div');
        daysRow.className = 'days-row';
        const jsDay = new Date(calendarData.year, month.number - 1, 1).getDay();
        let firstDay = jsDay - 1;
        if (firstDay < 0) firstDay = 6;
        for (let i = 0; i < firstDay; i++) {
            const blankDiv = document.createElement('div');
            daysRow.appendChild(blankDiv);
        }
        for (let day = 1; day <= month.days; day++) {
            const dateStr = formatDate(calendarData.year, month.number, day);
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.dataset.date = dateStr;
            dayDiv.innerText = day;
            dayDiv.onclick = () => openModal(dateStr);

            // Aplica cor de fundo escolhida (qualquer cor)
            dayDiv.style.backgroundColor = dateColors[dateStr] || "#fff";
            // Nome sempre fonte cinza SEMPRE, com fundo cor escolhida
            if (dateNames[dateStr]) {
                const nameSpan = document.createElement('span');
                nameSpan.className = 'day-name';
                nameSpan.innerText = dateNames[dateStr];
                nameSpan.style.color = "#777";
                nameSpan.style.background = "transparent";
                dayDiv.appendChild(nameSpan);
                dayDiv.style.color = "#777";
            } else {
                dayDiv.style.color = "#21808d";
            }
            daysRow.appendChild(dayDiv);
        }
        monthDiv.appendChild(daysRow);
        grid.appendChild(monthDiv);
    });
}

function formatDate(year, month, day) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function openModal(dateStr) {
    currentSelectedDate = dateStr;
    modal.classList.remove('hidden');
    nameInput.value = dateNames[dateStr] || '';
    selectedColor = dateColors[dateStr] || "#fff";
    renderColorOptions(selectedColor);
    nameInput.focus();
}

function closeModal() {
    modal.classList.add('hidden');
    currentSelectedDate = null;
}

function persistData() {
    localStorage.setItem('dateNames', JSON.stringify(dateNames));
    localStorage.setItem('dateColors', JSON.stringify(dateColors));
}

modalClose.onclick = closeModal;
modalOverlay.onclick = closeModal;
btnCancel.onclick = closeModal;

btnSave.onclick = () => {
    if (!currentSelectedDate) return;
    const nome = nameInput.value.trim();
    const cor = selectedColor;
    if (nome) {
        dateNames[currentSelectedDate] = nome;
    } else {
        delete dateNames[currentSelectedDate];
    }
    // Salva sempre a cor mesmo sem nome
    dateColors[currentSelectedDate] = cor;
    persistData();
    closeModal();
    renderCalendar();
};

btnClear.onclick = () => {
    if (!currentSelectedDate) return;
    delete dateNames[currentSelectedDate];
    delete dateColors[currentSelectedDate];
    persistData();
    closeModal();
    renderCalendar();
};

window.onload = renderCalendar;
