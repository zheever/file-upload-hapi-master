let models=require('../models')
module.exports={
    login: async function(request,h) {
        let reponseMess = {}
        await models.User.findOne({
            where:{
                user_name: request.query.username
            }
        }).then(function(result){
            reponseMess={
                status:-1,
                message:'login fail'
            }
            if(result!==null){
                if (result.password && result.password === request.query.password) {
                    reponseMess={
                        status: 1,
                        message:'login success'
                    }
                }
                request.session = result
                console.log(request.session)
            }
            console.log(reponseMess)
        }).catch(function(err){
            console.log(err)
            return err
        })
        return reponseMess
    },
    register: async (request, h) => {
        let reponseMess = {}
        await models.User.findOne({
            where:{
                user_name: request.query.username
            }
        }).then((res) => {
            if (res !== null) {
                reponseMess = {
                    status:-1,
                    message:'昵称已存在'
                }
            }
        })

        if (reponseMess.status === -1) {
            return reponseMess
        }

        await models.User.create({
            user_name: request.query.username,
            password: request.query.password,
            authority: 'normal'
        }).then(function (result) {
            if(result!==null){
                reponseMess={
                    status:1,
                    message:'注册成功'
                }
            }else{
                reponseMess={
                    status:-1,
                    message:'注册失败'
                }
            }
        }).catch(function (err) {
            console.log('failed: ' + err);
        })
        return reponseMess
    },
    getUserInfo: async (request, h) => {
        console.log(request.session)
        if(request.session && request.session.id) {
            return {
                status: 1,
                data: request.session
            }
        } else {
            return {
                status:-1,
                message:'未登录'
            }
        }
    },
    log_off: async (request, h) => {
        request.session = {}
        console.log('log off')
        console.log(request.session)
        return {
            status: 1,
            message: 'log off'
        }
    },
};