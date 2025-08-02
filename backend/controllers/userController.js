const db = require('../db');

exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        const [users] = await db.query('SELECT name FROM users WHERE id = ?', [userId]);
        const user = users[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ name: user.name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching user details.' });
    }
};