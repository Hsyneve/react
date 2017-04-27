import AV from 'leancloud-storage'

AV.init({
    appId: 'gHWqAFVNGLrC2kaNdOtOh6DQ-gzGzoHsz',
    appKey: 'di3QChx0fSpXtfWb89pJL9Gd'
})
export default AV


export function signUp(username, password, successFn, errorFn) {
    // 新建 AVUser 对象实例
    var user = new AV.User()
        // 设置用户名
    user.setUsername(username)
        // 设置密码
    user.setPassword(password)
        // 设置邮箱
    user.signUp().then(function(loginedUser) {
        let user = getUserFromAVUser(loginedUser)
        successFn.call(null, user)
    }, function(error) {
        errorFn.call(null, error)
    })

    return undefined

}
export function adddata(con,setOwner) {
    let dataString = JSON.stringify(con)
    let AVTodos = AV.Object.extend('ownertodo');
    let avTodos = new AVTodos();
    avTodos.set('content', dataString);
      var acl = new AV.ACL();
            acl.setReadAccess(AV.User.current(), true);
            acl.setWriteAccess(AV.User.current(), true);
            avTodos.setACL(acl);
    avTodos.save().then(todo => {
        setOwner.call(null, todo.id);
    }, function(error) {

    });
}
export function loadfromCloud(setList) {
            if (getCurrentUser()) {
                var query = new AV.Query('ownertodo');
                query.find().then(todos => {
                	let ownerList=JSON.parse(todos[0].attributes.content)
                	ownerList.id=todos[0].id;
                    setList.call(null, ownerList)
                  
                }, function(error) {
                    // 异常处理
                });
            }
        }
export function modifydata(con) {

    var todo = AV.Object.createWithoutData('ownertodo', con.id);
    var dataString = JSON.stringify(con);
    todo.set('content', dataString);
    todo.save();
}
export function signIn(username, password, successFn, errorFn,setList) {
    AV.User.logIn(username, password).then(function(loginedUser) {
        let user = getUserFromAVUser(loginedUser)
         loadfromCloud(setList)
        successFn.call(null, user)

    }, function(error) {
        errorFn.call(null, error)
    })
}
export function getCurrentUser() {
    let user = AV.User.current()
    if (user) {
        return getUserFromAVUser(user)
    } else {
        return null
    }
}
export function signOut() {
    AV.User.logOut()
    return undefined
}

function getUserFromAVUser(AVUser) {
    return {
        id: AVUser.id,
        username: AVUser.attributes.username
    }
}
