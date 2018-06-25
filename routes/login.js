let controllers=require('../controllers')

// 登录
let login = {
    method: 'POST',
    path: '/login',
    handler: controllers.user.login
}
module.exports=[login];