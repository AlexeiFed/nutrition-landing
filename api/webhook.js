export default async (req, res) => {
    if (req.method !== 'POST') {
        console.log('⚠️ Не POST-запрос');
        return res.status(405).end();
    }

    // Логируем тело запроса
    console.log('📤 Тело запроса от ЮMoney:', JSON.stringify(req.body, null, 2));

    // Для теста всегда возвращаем 200 OK
    res.status(200).json({ received: true });
};