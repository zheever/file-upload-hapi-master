let controllers=require('../controllers')

// 登录
let login = {
    method: 'GET',
    path: '/userInfo',
    handler: controllers.user.getUserInfo
}
module.exports=[login];