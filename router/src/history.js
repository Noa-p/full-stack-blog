// 早期浏览器的history对象只能用于多页面跳转：
// history.go(-1)
// history.go(2)
// history.forward()
// history.back()

// H5 新增API
// history.pushState()    添加新的状态到历史状态栈 均接收三个参数（state, title, url）
// history.replaceState()  用新的状态代替当前状态
// 可以在改变url的同时不刷新页面
// history.state       返回当前状态对象
// window.onpopstate

//所以，我们需要换个思路，我们可以罗列出所有可能触发 history 改变的情况，
//并且将这些方式一一进行拦截，变相地监听 history 的改变。
// 对于SPA的history模式而言，url的改变只能由下面4种方式引起：
// 1. 点击浏览器的前进或后团按钮
// 2. 点击a标签
// 3. js中触发history.pushState()
// 4. js中触发history.replaceState()

class HistoryRouter {
    constructor() {
        this.routers = {}
        this.listenPopState()
        this.listenLink()
    }

    // 监听popstate
    listenPopState() {
        window.addEventListener('popstate', (e) => {
            let state = e.state || {},
                path = state.path || ''
            this.dealPathHandler(path)
        }, false)
    }
    // 全局监听A链接
    listenLink() {
        window.addEventListener('click', (e) => {
            let dom = e.target
            if (dom.tagName.toUpperCase() === 'A' && dom.getAttribute('href')) {
                console.log('refuse!!')
                e.preventDefault()
                this.assign(dom.getAttribute('href'))
            }
        }, false)
    }
    // 用于首次进入页面时调用
    load() {
        let path = location.pathname
        console.log('path in load:', path)
        this.dealPathHandler(path)
    }
    register(path, callback=function(){}) {
        this.routers[path] = callback
    }
    registerIndex(callback = function(){}) {
        this.routers['/'] = callback
    }
    registerNotFound(callback = function(){}) {
        this.routers['404'] = callback
    } 
    registerError(callback = function(){}) {
        this.routers['error'] = callback
    }
    //跳转到path
    assign(path) {
        history.pushState({path}, null, path)
        this.dealPathHandler(path)
    }
    // 通用处理path调用回调函数
    dealPathHandler(path) {
        let handler
        console.log('path:', path)
        if (!this.routers.hasOwnProperty(path)) {// 判断对象中是否有某属性
            handler = this.routers['404'] || function (){}
        } else {
            handler = this.routers[path]
        }
        try {
            handler.apply(this)
        } catch {
            console.error(e)
            (this.routers['error'] || function() {}).call(this, e)
        }
    }
}

let router = new HistoryRouter()
let container = document.getElementById('container')

router.registerIndex(() => container.innerHTML = 'home page')

router.register('/page1', () => container.innerHTML = 'page1')
router.register('/page2', () => container.innerHTML = 'page2')
router.register('/page3', () => container.innerHTML = 'page3')
router.register('/page4',()=> {throw new Error('抛出一个异常')});

document.getElementById('btn').onclick = () => {
    router.assign('/page2')
}

router.registerNotFound(()=>container.innerHTML = '页面未找到');
router.registerError((e)=>container.innerHTML = '页面异常，错误消息：<br>' + e.message);

router.load()