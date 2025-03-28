// Временное хранилище (в продакшене используйте БД)
const paidOrders = new Set();

// Эмуляция вебхука от ЮMoney
export default async (req, res) => {
    const { order_id } = req.query;

    // Здесь должен быть реальный запрос к API ЮMoney
    // Для теста эмулируем успешную оплату через 10 секунд
    const isPaid = paidOrders.has(order_id) || Math.random() > 0.5;

    if (isPaid) paidOrders.add(order_id);

    res.json({ paid: isPaid });
};