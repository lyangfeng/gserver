/**
 *用于判断当前文件是在什么系统下进行运行的
 * 通过不同的系统  使用不同的打开方式
 * 
 * 需求：让文件自动打开浏览器
 * 在这里使用了process(进程)模块  和child_process(子进程模块)
 * */

//用解构赋值 获取子进程模块终端exec方法
const { exec } = require("child_process");

 //定义一个函数  用来判断当前的操作系统
 //并暴露出去
 module.exports = function(url){
  //先定义一个字符串
  let cmd = '';

  /*在这里使用process模块中的platform方法
    platform返回的是字符串  标识的是nodejs进程运行其上的操作系统
    用switch case语句对里面的内容进行遍历
  */
  switch (process.platform) {
    case "darwin":  //mac(苹果)系统
      cmd = "open";  //使用这个操作前要输入的指令符
      break;
    case "win32":  //windows系统
      cmd = "start"; //使用这个操作前要输入的指令符
      break;
    case "linux":  //linux系统
      cmd = "xdg-open"; //使用这个操作前要输入的指令符
      break;  
  }

  //exec  用于在终端执行时打开浏览器的指令
  exec(`${cmd} ${url}`);
 };