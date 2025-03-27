export default async (req, res) => {
    const { menu_type } = req.query;

    const driveLinks = {
        "5": "https://drive.google.com/uc?export=download&id=1YnjdGwwZM_sF2iwzxg7o_-o4y72-IEqi_5",
        "7": "https://drive.google.com/uc?export=download&id=1aJD2E8o3HfBFavs2zsQUs58rPKHdnZ2n_7",
        "9": "https://drive.google.com/uc?export=download&id=1YnjdGwwZM_sF2iwzxg7o_-o4y72-IEqi_9"
    };

    if (driveLinks[menu_type]) {
        return res.redirect(302, driveLinks[menu_type]);
    }

    return res.status(400).json({ error: "Invalid menu type" });
}