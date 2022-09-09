// 首页的JS

// 验证是否登录，如果没有登录跳转到登录页面
// 如果有登陆获取，获取到登录的用户信息

// 调用 api 里面的profile获取用户信息 ，
// 如果有token 且有效就可以

(async function () {
    const resp = await API.profile();
    // 登录过，则保存用户信息
    // 保存用户信息
    var user = resp.data;
    // 如果不存在user,没有登录，跳转到登录页面
    if (!user) {
        alert("未登录或登录已过期，请重新登录")
        location.href = "./login.html"
        return;
    }
    // dom 元素
    const doms = {
        // 头像旁边显示账号和昵称
        aside: {
            nickname: $("#nickname"),
            loginId: $("#loginId"),
        },
        // 注销按钮
        close: $(".close"),
        // 聊天容器
        chatContainer: $(".chat-container"),
        txtMsg: $("#txtMsg"),
        msgContainer: $(".msg-container"),
    }
    setUserInfo()
    // 设置用户信息   
    function setUserInfo() {
        // 为什么这里不可以用innerHtml只能用innerText?
        // 可能会有注入攻击，所以必须 显示成为纯文本
        doms.aside.nickname.innerText = user.nickname;
        doms.aside.loginId.innerText = user.loginId;
    }
    // 注销事件
    doms.close.onclick = function (e) {
        API.loginOut();
        location.href = "./login.html"
    }

    // 根据消息对象将其添加到页面中
    // 传入的是消息的对象  ，消息对象时从getHistory里面获取到的
    // 获取的是{content ,createdAt,from,to}
    function addChat(chatInfo) {
        // 根据消息对象创建元素
        const div = $$$('div');
        div.classList.add('chat-item');
        // 确定是不是我发的消息 如果是我发的加入me这个样式
        // from 有值为我发的，from为null说明是机器人回答的
        if (chatInfo.from) {
            div.classList.add('me')
        }
        const img = $$$('img');
        img.className = "chat-avatar";
        img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg"
        //创建内容的div
        const content = $$$('div')
        content.className = "chat-content"
        content.innerText = chatInfo.content;
        // 创建时间的div 注意需要将时间戳转换为时间
        const date = $$$('div')
        date.className = "chat-date";
        // formDate 将时间戳转换为某个时间的函数
        date.innerText = formDate(chatInfo.createdAt)
        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(date)
        // 添加到容器
        // console.log(doms.chatContainer)
        doms.chatContainer.appendChild(div);
    }

    // 时间戳转换为具体格式的时间
    function formDate(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = (date.getDate()).toString().padStart(2, '0');
        const hour = (date.getHours()).toString().padStart(2, '0');
        const minute = (date.getMinutes()).toString().padStart(2, '0');
        const second = (date.getSeconds()).toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    // 加载历史记录
    await loadHistory()
    async function loadHistory() {
        const resp = await API.getHistory();
        // console.log(resp);
        // console.log(resp.data.length)
        for (const item of resp.data) {
            addChat(item);
        }
        scrollBottom()
    }
    // 加载完历史记录后，滚动条滚动到底部
    function scrollBottom() {
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    }
    // 发送消息
    async function sendChat() {
        const content = doms.txtMsg.value.trim();
        if (!content) {
            return;
        }
        // console.log(content);
        // 先创建一个对象，将内容显示到界面上
        addChat({
            from: user.loginId,
            to: null,
            // 一定要是时间戳
            createdAt: Date.now(),
            content: content,
        })
        scrollBottom();
        doms.txtMsg.value = "";
        // 发送给服务器，等待服务器响应
        const resp = await API.sendChat(content);
        // console.log(resp.data)
        addChat({
            from: null,
            to: user.loginId,
            createdAt: Date.now(),
            // 下面的回复包含了时间和内容，将其展开
            ...resp.data
        })

        scrollBottom()
    }
    doms.msgContainer.onsubmit = function (e) {
        e.preventDefault();
        sendChat()
    }


})()