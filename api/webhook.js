const paidOrders = new Set();

export default async (req, res) => {
    if (req.method !== 'POST') return res.status(405).end();

    const { event, object } = req.body;

    if (event === 'payment.succeeded' && object.status === 'succeeded') {
        const orderId = object.metadata.order_id;
        paidOrders.add(orderId);
    }

    res.status(200).end();
};