// 会污染全局，可以采用模块化，还未学
// 立即执行函数，单对象模式，并将各个函数暴露出去
const API = (function () {
    // 基本的地址 https://study.duyiedu.com
    // 命名规范：常量的字母全部大写
    const BASE_URL = "https://study.duyiedu.com";
    const TOKEN_KEY = "token";

    /**
     * 封装函数
     */
    function get(path) {
        // 如果localStorage有授权 则加入headers的authorization
        const headers = {};
        var token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(BASE_URL + path, {
            headers
        })
    }

    /**
     * 
     * @param {*} path 接口地址
     * @param {*} body 请求体
     */
    function post(path, body) {
        // 少考虑了content-type
        const headers = {
            'Content-Type': 'application/json',
        };
        var token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        body = JSON.stringify(body)
        return fetch(BASE_URL + path, {
            method: 'POST',
            headers,
            body,
        })
    }

    /**
     * 注册
     * @param {*} userInfo 
     */
    // 函数是异步的
    /*   async function reg(userInfo) {
          const resp = await post("/api/user/reg", userInfo)
          //响应体
          // 老师直接用的.then(resp=>resp.json())
          return await resp.json();
      } */

    async function reg(userInfo) {
        const resp = await post('/api/user/reg', userInfo);
        return await resp.json();
    }


    /**
     * 登录
     * @param {*} LoginInfo 
     * 记得保存token
     */
    async function login(loginInfo) {
        const resp = await post("/api/user/login", loginInfo)
        const result = await resp.json();
        // 注意自己写的时候没有把token 保存到localst
        // 在控制台applicaton中查看 localStorage
        if (result.code === 0) {
            var token = resp.headers.get('authorization');
            localStorage.setItem(TOKEN_KEY, token);
        }
        return result;
    }
    /**
     * 验证账号是否存在
     * @param {*} loginId 
     */
    async function exits(loginId) {
        // get 并没有写请求体的地方,直接将参数拼接上
        const resp = await get("/api/user/exists?loginId=" + loginId)
        return await resp.json();
    }
    /**
     * 当前登录的用户信息
     */
    async function profile() {
        const resp = await get("/api/user/profile")
        return await resp.json();
    }
    /**
     * 发送聊天消息
     */
    async function sendChat(content) {
        const resp = await post("/api/chat", content)
        //响应体
        // 老师直接用的.then(resp=>resp.json())
        return await resp.json();
    }

    /**
     * 获取聊天记录
     */
    async function getHistory() {
        // /api/chat/history
        const resp = await get("/api/chat/history")
        return await resp.json();
    }

    /**
     * 注销账号
     */
    function loginOut() {
        localStorage.removeItem(TOKEN_KEY)
    }
    return {
        reg,
        login,
        exits,
        profile,
        sendChat,
        getHistory,
        loginOut,
    }
})()

