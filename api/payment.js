const driveFiles = {
    "1200": "1YnjdGwwZM_sF2iwzxg7o_-o4y72-IEqi", // ID файла для 1200 ккал
    "1500": "1YnjdGwwZM_sF2iwzxg7o_-o4y72-IEqi", // ID файла для 1500 ккал
    "1800": "1aJD2E8o3HfBFavs2zsQUs58rPKHdnZ2n"  // ID файла для 1800 ккал
};

module.exports = async (req, res) => {
    const { menu_type, payment_status } = req.query;

    // Проверка успешной оплаты
    if (payment_status === 'success' && driveFiles[menu_type]) {
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${driveFiles[menu_type]}`;

        // 1. Вариант с редиректом
        return res.redirect(downloadUrl);

        // 2. Или вариант с прямым скачиванием
        // res.setHeader('Content-Disposition', 'attachment');
        // return res.redirect(downloadUrl);
    }

    return res.status(400).json({ error: "Оплата не подтверждена" });
};