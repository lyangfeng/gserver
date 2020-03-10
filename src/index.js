//引入http模块
const http = require('http');
const chalk = require('chalk');

//middleware和config文件中要引入的文件是index.js  则可以省略不写 系统默认选中index.js
const middleware = require('./middleware');
//引入默认配置
const defaultConfig = require('./config');
//引入自动启动浏览器模块
const open = require("./utiles/open");
//引入命令行配置：将来用户输入 -p -h -d,都会收集并返回一个对象
const argv = require("./cli");

//合并配置  在这里面如果输入了argv里面的指令符 则使用argv方法运行
//如果没有输入 则返回空对象 那么就使用defaultConfig里面的默认配置
const config = Object.assign({},defaultConfig, argv);

const { port, host, proRoot} = config;


//创建服务 传入函数模块  要调用一下middleware函数并传入proRoot 否则middleware中的函数无法使用proRoot
const server = http.createServer(middleware(proRoot));

//启动服务运行
server.listen(port, host, err => {
  //优先运行错误机制
  if(err){
    console.log("服务器启动失败：",err);
    return;
  }

  //没有失败则进入服务器
  const address = `http://${host}:${port}`;
  //使用chalk让一些返回的内容有我们自定义的颜色
  console.log("服务器启动成功" + chalk.yellow(address));


  //一旦服务启动成功后  就打开浏览器
  open(address);  //传入地址
});








