// 对用户登录和注册的 通用验证

// 具体的规则是 通过回调函数实现的

/**
 * 对某个表单项进行验证的函数
 */
class FieldValidator {
    /**
     * 构造器验证某个文本框
     * @param {String} txtId 需要验证的表单的id
     * @param {Function} validatorFunc 验证规则,传入该函数的参数是验证的文本框的值，有错误返回错误消息，无错误则不返回
     */
    constructor(txtId, validatorFunc) {
        // 使用this
        // 获取input元素
        this.input = $('#' + txtId);
        // 获取p 元素，方便插入错误信息
        this.p = this.input.nextElementSibling;
        // 验证规则
        this.validatorFunc = validatorFunc;
        // 文本框是失去焦点的时候进行验证,调用验证函数
        // 注意使用箭头函数
        this.input.onblur = () => {
            this.validate();
        }
    }

    /**
     * 验证成功返回true,失败返回false
     * 这个方法在原型上，需要实例化调用
     */
    async validate() {
        // 调用验证函数
        // 是异步的因为有可能验证账号是否存在等
        const err = await this.validatorFunc(this.input.value)
        // 如果有值，将错误消息插入到P元素中，并返回false
        if (err) {
            this.p.innerText = err;
            return false;
        } else {
            this.p.innerText = "";
            return true;
        }
    }

    // 静态方法，可以通过类直接调用
    // 有可能不会点击每个文本框，直接点击登录或者提交按钮，所以需要整体验证一遍
    // ... 表示传入的时候不需要写入到数组里面，直接转换为数组
    static async validate(...validators) {
        // 对每一个需要验证的调用上面的验证方法
        const proms = validators.map(v => v.validate())
        // 需要每一个验证的结果是 true 还是false
        // 所有的完成之后才算完成
        // 布尔 数组
        const results = await Promise.all(proms)
        // console.log(results)
        // 查找是不是每一个都满足条件 es5
        // every 第一项是r 是传入的值，第二个r 看是不是true,将结果保存到r中，并返回,
        return results.every(r => r)
    }

}



// 这个function是给constructor的validatorFunc 
// 有可能是异步的，比如验证账号是否存在
/* var loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
    if (!val) {
        return "请填写账号"
    }
    // console.log(val)
    const resp = await API.exits(val)
    // console.log(resp.data)
    if (resp.data) {
        return "该账号已经存在"
    }
}) */

// 验证昵称
/* var nickNameValidator = new FieldValidator("txtNickname", async function (val) {
    if (!val) {
        return "请填写昵称"
    }
})
 */

// 想对所有的验证器进行一次验证,书写静态方法
// 是异步的需要用 then
/* FieldValidator.validate(loginIdValidator, nickNameValidator).then(
    (result) => {
        // console.log(result)
    }
) */

