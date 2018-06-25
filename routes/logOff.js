let controllers=require('../controllers')

// 登录
let logOff = {
    method: 'GET',
    path: '/logOff',
    handler: controllers.user.log_off
}
module.exports=[logOff];