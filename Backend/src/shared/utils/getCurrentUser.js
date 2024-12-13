export default function getCurrentUser(req, res) {
    const user = req.user;
    res.json({ username: user.username });
}