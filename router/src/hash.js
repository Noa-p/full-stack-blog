// window.location.hash = 'hash string';

// let hash = window.location.hash;

// window.addEventListener('hashchange', function(event) {
//     let newURL = event.newURL
//     let oldURL = event.oldURL
// }, false)

class HashRouter {
    constructor() {
        // 用于存储不同hash值对应的回调函数
        this.routers = {}
        window.addEventListener('hashchange', this.load.bind(this), false)
    }

    // 用于注册每个视图
    register(hash, callback = function(){}) {
        this.routers[hash] = callback
    }

    // 用于注册首页
    registerIndex(callback = function(){}) {
        this.routers['index'] = callback
    }

    // 用于处理视图未找到的情况
    registerNotFound(callback = function(){}) {
        this.routers['404'] = callback
    }

    // 用于处理异常情况
    registerError(callback = function(){}) {
        this.routers['error'] = callback
    }

    // 调用不同视图的回调函数
    load() {
        console.log("start")
        let hash = location.hash.slice(1), handler
        if (!hash) {
            console.log('hash index:', hash)
            handler = this.routers.index
        } else if (!this.routers.hasOwnProperty(hash)) {
            handler = this.routers['404'] || function(){}
        }else {
            console.log('hash:', hash)
            handler = this.routers[hash]
        }

        try {
            handler.apply(this)
        } catch(e) {
            console.log(e)
            (this.routers['error'] || function(){}).call(this, e)
        }

        handler.call(this)
    }
}

let router = new HashRouter()
let container = document.getElementById('container')

router.registerIndex(() => container.innerHTML = 'home page')

router.register('/page1', () => container.innerHTML = 'page1')
router.register('/page2', () => container.innerHTML = 'page2')
router.register('/page3', () => container.innerHTML = 'page3')
router.register('/page4',()=> {throw new Error('抛出一个异常')});

router.registerNotFound(()=>container.innerHTML = '页面未找到');
router.registerError((e)=>container.innerHTML = '页面异常，错误消息：<br>' + e.message);

router.load()






