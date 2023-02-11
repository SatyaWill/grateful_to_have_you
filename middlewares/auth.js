const jwt =require('jsonwebtoken');
require("dotenv").config()

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(403).json({message: '沒有token'})

  jwt.verify(token, process.env.ACCESS_JWT, (err, user) => {
    if (err) return res.status(401).json({message: 'token錯誤'})
    req.user = user
    next()
  })
}

