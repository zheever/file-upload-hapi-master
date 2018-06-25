let hello={
    method: 'GET',
    path: '/',
    handler: function(request, reply){
        /*
      request.session.id = request.session.id || 1;
      request.session.e =  request.session.e + 1 || 1;
      console.log(request.session)
      return 'Views:' + request.session.id + ' ' + request.session.e;
      */
      return 'hello'
    }
};
module.exports=[hello]; 