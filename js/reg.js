// 创建关于注册的各种规则

// 这个function是给constructor的validatorFunc 
// 有可能是异步的，比如验证账号是否存在
const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
    if (!val) {
        return "请填写账号"
    }
    // console.log(val)
    const resp = await API.exits(val)
    // console.log(resp.data)
    if (resp.data) {
        return "该账号已经存在"
    }
})

// 验证昵称
const nickNameValidator = new FieldValidator("txtNickname", async function (val) {
    if (!val) {
        return "请填写昵称"
    }
})
// 针对密码的验证规则
const loginPwdValidator = new FieldValidator("txtLoginPwd", async function (val) {
    if (!val) {
        return "请填写密码"
    }
});
// 确认密码的验证规则
const loginPwdConfirmValidator = new FieldValidator("txtLoginPwdConfirm", async function (val) {
    if (!val) {
        return "请填写确认密码"
    }
    // 验证两次密码是否一致
    // 如何拿到第一次输入的密码的值
    if (val !== loginPwdValidator.input.value) {
        return "两次密码不一致"
    }
});


// 避免点击注册或者登陆之前没有点击文本框
// 如果是表单的话，给表单元素直接添加注册事件，而不是给注册按钮添加事件
const form = $('.user-form');
form.onsubmit = async function (e) {
    // 阻止表单刷新页面
    e.preventDefault();
    const result = FieldValidator.validate(loginIdValidator, nickNameValidator, loginPwdValidator, loginPwdConfirmValidator)
    // 验证未通过，结束，即result为false
    if (!result) {
        return;
    }
    // 验证通过，调用api进行注册，需要将userInfo 用户信息传递进去
    // 用户信息可以通过浏览器提供的一个方法  new FormData() 和表单的name属性挂钩
    // 传入的参数是表单的dom元素，得到一个表单数据对象 
    // 对象存储的是键值对，键是name属性的名称，值是文本框的内容 .get(key)得到值
    var formData = new FormData(form);
    console.log(formData);
    // formData.entries() 得到一个迭代器 ,[[],[]]
    console.log(formData.entries())
    // 将迭代的数组还原为object就可以了
    const data = Object.fromEntries(formData.entries());
    const resp = await API.reg(data);
    console.log(resp.code)
    if (resp.code === 0) {
        alert('success')
        location.href = "./login.html"
    }

}



