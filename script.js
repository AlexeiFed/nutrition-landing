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
    "Рацион на 1200 ккал": { code: "1200", price: "5", number: "1YnjdGwwZM_sF2iwzxg7o_-o4y72-IEqi" },
    "Рацион на 1500 ккал": { code: "1500", price: "7", number: "1YnjdGwwZM_sF2iwzxg7o_-o4y72-IEqi" },
    "Рацион на 1800 ккал": { code: "1800", price: "9", number: "1aJD2E8o3HfBFavs2zsQUs58rPKHdnZ2n" }
};

function buyMenu(menuName) {
    const menu = MENU_ITEMS[menuName];
    if (!menu) {
        alert('Меню не найдено');
        return;
    }

    const orderId = 'order_' + Date.now();
    // const paymentUrl = `https://forms.yandex.ru/u/67e1568e90fa7bd8e501abc7/?order=${orderId}&menu=${menu.code}&price=${menu.price}`;
    const paymentUrl = `https://forms.yandex.ru/u/67e1568e90fa7bd8e501abc7/?number=${menu.number}&menu=${menu.code}&price=${menu.price}`;


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