document.getElementById('bmrForm').addEventListener('submit', function (e) {
    e.preventDefault();
    hideError();

    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activity = parseFloat(document.getElementById('activity').value);

    // Валидация
    if (isNaN(age) || age < 10 || age > 100) {
        showError('Введите возраст от 10 до 100 лет');
        return;
    }
    if (isNaN(weight) || weight < 20 || weight > 300) {
        showError('Введите вес от 20 до 300 кг');
        return;
    }
    if (isNaN(height) || height < 100 || height > 250) {
        showError('Введите рост от 100 до 250 см');
        return;
    }

    // Расчет калорий
    let bmr = gender === 'male'
        ? 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)
        : 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);

    const calories = bmr * activity;
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `Ваша дневная норма калорий: <strong>${Math.round(calories)}</strong> ккал`;
    resultElement.classList.add('show');
});

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

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

const MENU_ITEMS = {
    "Рацион на 1200 ккал": { code: "1200", price: "5" },
    "Рацион на 1500 ккал": { code: "1500", price: "7" },
    "Рацион на 1800 ккал": { code: "1800", price: "9" }
};

let currentOrderId = null;

// Открытие модалки с формой оплаты
function buyMenu(menuName) {
    const menu = MENU_ITEMS[menuName];
    if (!menu) return alert('Меню не найдено');

    currentOrderId = 'order_' + Date.now();
    const modal = document.getElementById('paymentModal');
    const frame = document.getElementById('paymentFrame');
    const statusDiv = document.getElementById('paymentStatus');

    // Показываем модалку
    modal.style.display = 'block';
    statusDiv.style.display = 'none';
    frame.style.display = 'block';

    // Загружаем форму оплаты
    frame.src = `https://forms.yandex.ru/u/67e1568e90fa7bd8e501abc7/?order=${currentOrderId}&menu=${menu.code}&price=${menu.price}`;

    // Закрытие модалки
    document.querySelector('.close').onclick = () => {
        modal.style.display = 'none';
        checkPaymentStatus(menu.code); // Проверяем оплату при закрытии
    };
}

// Проверка статуса оплаты
async function checkPaymentStatus(menuType) {
    const statusDiv = document.getElementById('paymentStatus');
    statusDiv.style.display = 'block';
    document.getElementById('paymentFrame').style.display = 'none';

    // Проверяем каждые 5 секунд (5 попыток)
    let attempts = 0;
    const interval = setInterval(async () => {
        attempts++;
        const response = await fetch(`/api/check-payment?order_id=${currentOrderId}`);
        const result = await response.json();

        if (result.paid || attempts >= 5) {
            clearInterval(interval);
            if (result.paid) {
                statusDiv.innerHTML = '<h3>✅ Оплата подтверждена! Скачиваем меню...</h3>';
                downloadMenu(menuType);
            } else {
                statusDiv.innerHTML = '<h3>❌ Оплата не найдена. Попробуйте позже.</h3>';
            }
            setTimeout(() => {
                document.getElementById('paymentModal').style.display = 'none';
            }, 3000);
        }
    }, 5000);
}

// Скачивание файла
function downloadMenu(menuType) {
    const driveFiles = {
        "1200": "1YnjdGwwZM_sF2iwzxg7o_-o4y72-IEqi",
        "1500": "1YnjdGwwZM_sF2iwzxg7o_-o4y72-IEqi",
        "1800": "1aJD2E8o3HfBFavs2zsQUs58rPKHdnZ2n"
    };
    window.open(`https://drive.google.com/uc?export=download&id=${driveFiles[menuType]}`, '_blank');
}