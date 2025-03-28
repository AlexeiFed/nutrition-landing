const driveFiles = {
    "1200": "1YnjdGwwZM_sF2iwzxg7o_-o4y72-IEqi",
    "1500": "1YnjdGwwZM_sF2iwzxg7o_-o4y72-IEqi",
    "1800": "1aJD2E8o3HfBFavs2zsQUs58rPKHdnZ2n"
};

module.exports = async (req, res) => {
    const { menu_type, payment_status } = req.query;

    if (payment_status === 'success' && driveFiles[menu_type]) {
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${driveFiles[menu_type]}`;
        res.setHeader('Content-Disposition', `attachment; filename="menu_${menu_type}.pdf"`);
        return res.redirect(downloadUrl);
    }

    return res.status(400).json({ error: "Оплата не подтверждена или меню не найдено" });
};
