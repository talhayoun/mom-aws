const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    let token = req.headers?.authorization;
    let isVerified = jwt.verify(token, process.env.SECRET_TOKEN);
    if (!isVerified)
        return res.status(400).send({ err: 'Unauthorized' });
    next();
}

module.exports = auth;