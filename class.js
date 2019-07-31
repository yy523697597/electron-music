const { BrowserWindow } = require('electron');

// 创建窗口的类
class AppWindow extends BrowserWindow {
    constructor(config, location) {
        const basicConfig = {
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            },
            show: false
        };
        // 对象中的扩展运算符(...)用于取出参数对象中的所有可遍历属性，拷贝到当前对象之中
        const finalConfig = { ...basicConfig, ...config };
        // 通过调用super，访问基类的构造函数，也就是 BrowserWindow 的 constructor
        super(finalConfig);
        this.loadFile(location);
        // 优雅显示新窗口
        this.once('ready-to-show', () => {
            this.show();
        });
    }
}

module.exports.AppWindow = AppWindow;
