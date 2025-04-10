// Функция для расчета и отображения результатов
function calculateAndDisplayResults() {
    hideError();

    try {
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const age = parseInt(document.getElementById('age').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const activity = parseFloat(document.querySelector('input[name="activity"]:checked').value);

        // Валидация
        if (isNaN(age)) return;
        if (isNaN(weight)) return;
        if (isNaN(height)) return;

        // Расчет калорий
        let bmr = gender === 'male'
            ? 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)
            : 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);

        const maintenanceCalories = Math.round(bmr * activity);
        const weightLossCalories = Math.max(Math.round(maintenanceCalories * 0.85), 1200);
        const muscleGainCalories = Math.round(maintenanceCalories * 1.15);

        document.getElementById('maintenanceCalories').textContent = maintenanceCalories + ' ккал';
        document.getElementById('weightLossCalories').textContent = weightLossCalories + ' ккал';

        // Добавляем или обновляем результат для набора мышечной массы
        if (!document.getElementById('muscleGainCalories')) {
            const muscleGainItem = document.createElement('div');
            muscleGainItem.className = 'result-item';
            muscleGainItem.id = 'muscleGainItem';
            muscleGainItem.innerHTML = `
                <h3>Ваша норма калорий для набора мышечной массы</h3>
                <p id="muscleGainCalories">${muscleGainCalories} ккал</p>
            `;
            document.getElementById('result').appendChild(muscleGainItem);
        } else {
            document.getElementById('muscleGainCalories').textContent = muscleGainCalories + ' ккал';
        }

        document.getElementById('result').classList.add('show');
    } catch (e) {
        console.error("Calculation error:", e);
    }
}

// Обработчики изменений для всех полей ввода
function setupEventListeners() {
    // Обработчики для кнопок +/-
    document.querySelectorAll('.number-input').forEach(inputGroup => {
        const minusBtn = inputGroup.querySelector('.number-input__minus');
        const plusBtn = inputGroup.querySelector('.number-input__plus');
        const input = inputGroup.querySelector('.number-input__value');

        minusBtn.addEventListener('click', () => {
            changeNumber(input, -1);
            calculateAndDisplayResults();
        });

        plusBtn.addEventListener('click', () => {
            changeNumber(input, 1);
            calculateAndDisplayResults();
        });

        input.addEventListener('input', calculateAndDisplayResults);
        input.addEventListener('change', calculateAndDisplayResults);
    });

    // Обработчики для радио-кнопок
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', calculateAndDisplayResults);
    });
}

// Функция изменения числа
function changeNumber(input, direction) {
    const min = parseFloat(input.min) || 0;
    const max = parseFloat(input.max) || Infinity;
    let value = parseFloat(input.value) || min;

    value += direction;
    value = Math.max(min, Math.min(max, value));

    if (input.value.includes('.')) {
        const decimals = input.value.split('.')[1].length;
        input.value = value.toFixed(decimals);
    } else {
        input.value = value;
    }
}

function showError(message) {
    const error = document.getElementById('error');
    error.textContent = message;
    error.style.display = 'block';
}

function hideError() {
    const error = document.getElementById('error');
    error.textContent = '';
    error.style.display = 'none';
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    calculateAndDisplayResults(); // Рассчитать сразу при загрузке
});

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

const MENU_ITEMS = {
    "Рацион на 1500 ккал": { code: "1500", price: "1500", number: "1id_TDA6RPypR6C2zRoDcX0KNOkKUyWc4" },
    "Рацион на 2000 ккал": { code: "2000", price: "1500", number: "1So1gS4Ode1hHE-f4fqF3sgJ0Kfo7XHr5" }
};

function buyMenu(menuName) {
    const menu = MENU_ITEMS[menuName];
    if (!menu) {
        alert('Меню не найдено');
        return;
    }

    const orderId = 'order_' + Date.now();
    // const paymentUrl = `https://forms.yandex.ru/u/67e1568e90fa7bd8e501abc7/?order=${orderId}&menu=${menu.code}&price=${menu.price}`;
    const paymentUrl = `https://forms.yandex.ru/u/67e8e3d002848ff9a5704aef/?number=${menu.number}&menu=${menu.code}&price=${menu.price}`;


    window.open(paymentUrl, '_blank');

    // Добавляем проверку статуса оплаты и скачивание
    setTimeout(() => {
        fetch(`/api/payment?menu_type=${menu.code}&payment_status=success`)
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error('Ошибка при загрузке файла');
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `menu_${menu.code}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(error => console.error('Ошибка загрузки:', error));
    }, 3000); // Таймер для ожидания подтверждения оплаты
}