// 登录和注册，封装成为函数

/* 
1. 如何判断发送请求后是否成功

*/

// 获取元素
var loginIdDOM = document.querySelector('#txtLoginId');
var loginPwdDOM = document.querySelector('#txtLoginPwd');
var loginButtonDOM = document.querySelector('.submit');
// 插入元素的地方
var errs = document.querySelectorAll('.err');
var loginId;
var loginPwd;
function checkloginId() {
    loginId = loginIdDOM.value;
    var err = "";
    if (loginId.length === 0) {
        err = "请填写账号"
        errs[0].innerText = err;
    }
    if (err)
        return false;
    else
        return true;
}
function checkLoginPwd() {
    loginPwd = loginPwdDOM.value;
    var err = "";
    if (loginPwd.length === 0) {
        err = "请填写密码"
        errs[1].innerText = err;
    }
    if (err)
        return false;
    else
        return true;
}

loginIdDOM.addEventListener("change", checkloginId);
loginPwdDOM.addEventListener("change", checkLoginPwd);
// 点击登录验证账号，验证成功发送请求，切换页面

loginButtonDOM.addEventListener("click", function (e) {
    console.log(checkloginId())
    if (checkloginId() & checkLoginPwd()) {
        // 调用登录函数
        var loginInfo = {
            loginId,
            loginPwd,
        }
        login("/api/user/login", loginInfo)
        e.preventDefault()
    }
    else {
        e.preventDefault();
    }
})
