document.getElementById('bmrForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Сначала скрываем все предыдущие ошибки
    hideError();

    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activity = parseFloat(document.getElementById('activity').value);

    // Проверяем возраст
    if (isNaN(age) || age < 10 || age > 100) {
        showError('Введите возраст от 10 до 100 лет');
        return;
    }

    // Проверяем вес
    if (isNaN(weight) || weight < 20 || weight > 300) {
        showError('Введите вес от 20 до 300 кг');
        return;
    }

    // Проверяем рост
    if (isNaN(height) || height < 100 || height > 250) {
        showError('Введите рост от 100 до 250 см');
        return;
    }

    // Если все проверки пройдены, рассчитываем BMR

    let bmr;

    if (gender === 'male') {
        bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else {
        bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    }

    const calories = bmr * activity;
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `Ваша дневная норма калорий: <strong>${Math.round(calories)}</strong> ккал`;

    //document.getElementById('result').innerHTML = `Ваша дневная норма калорий: <strong>${Math.round(calories)}</strong> ккал`;
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

//function buyMenu(menuName) {
//    const formUrl = "https://forms.yandex.ru/u/67e1568e90fa7bd8e501abc7/"; // Ссылка на форму

//    let price = 0;
//    if (menuName === "Рацион на 5 ккал") price = 5;
//    if (menuName === "Рацион на 7 ккал") price = 7;
//    if (menuName === "Рацион на 9 ккал") price = 9;

// Открытие Яндекс формы с параметром
//    window.open(`${formUrl}?menu=${encodeURIComponent(menuName)}&price=${encodeURIComponent(price)}`, "_blank");

async function buyMenu(menuName) {
    const menuToType = {
        "Рацион на 1200 ккал": "1200",
        "Рацион на 1500 ккал": "1500",
        "Рацион на 1800 ккал": "1800"
    };

    try {
        // Сохраняем данные о заказе
        const orderId = 'order_' + Date.now();
        localStorage.setItem('currentOrder', menuToType[menuName]);

        // Формируем URL формы (убедитесь что ссылка правильная)
        const formUrl = `https://forms.yandex.ru/u/67e1568e90fa7bd8e501abc7/?order=${orderId}&menu=${menuToType[menuName]}`;

        // Открываем форму в новом окне
        const newWindow = window.open(formUrl, '_blank');

        if (!newWindow) {
            alert('Пожалуйста, разрешите всплывающие окна для этого сайта');
            return;
        }

        // Проверяем оплату каждые 5 секунд (если нужно)
        const checkInterval = setInterval(async () => {
            try {
                const response = await fetch(`/api/payment?menu_type=${menuToType[menuName]}`);
                if (response.redirected) {
                    clearInterval(checkInterval);
                    window.location.href = response.url;
                }
            } catch (e) {
                console.error("Payment check error:", e);
                clearInterval(checkInterval);
            }
        }, 5000);

    } catch (error) {
        console.error("Error in buyMenu:", error);
        alert('Произошла ошибка при открытии формы оплаты');
    }

}

