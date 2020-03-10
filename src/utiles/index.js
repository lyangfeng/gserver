//处理文件的Content-Type

//为了能对路径进行处理  所以引入path模块
const path = require('path');

//先定义一个类型
const myTypes = {
  js: "application/javascript",
  css: "text/css",
  html: "text/html",
  txt: "text/plain",
  gif: "image/gif",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  icon: "image/x-icon",
  svg: "image/svg+xml",
  json: "application/json",
  mp3: "audio/mp3",
  mp4: "video/mp4"
};

//定义一个方法来获取myTypes类型
function getMyTypes(filePath){
  //获取文件的扩展名
  //使用extname去获取文件的扩展名 将filePath路径传进来就获取的是这个路径中文件的扩展名
  //由于文件扩展名是.css .js的样子   我们需要使用slice从前面下标为1的位置开始往后截取内容
  const extname = path.extname(filePath).slice(1);

  //返回
  return myTypes[extname];
}

//把函数暴露出去
module.exports = getMyTypes;