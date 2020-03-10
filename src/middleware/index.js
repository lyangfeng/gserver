//用于放置处理请求和返回响应的函数

//引入系统定义的模板 进行使用
const path = require('path');
const fs = require('fs');
const util = require('util');
const pug = require('pug');


const getMyTypes = require("../utiles/index");
const compress = require("../utiles/compress");
const cache = require("../utiles/cache");

//使用util方法 调用promisify函数
const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);


//使用module.exports向外暴露一个叫async的函数
module.exports = (proRoot) => {
  return async(req,res) => {
    //获取请求的路径
    //request 请求对象：客户端发送给服务器的数据
    const url = req.url;

    //组成绝对路径
    //将这两个路径拼接起来
    const filePath = path.resolve(proRoot,`.${url}`);

    //await是异步代码  要上一个代码执行完毕后才会执行下一个
    //书写try catch方法  成功则进入try  失败进入catch  执行不同的代码
    try{
      //先分析文件路径  返回一个stat
      const states = await stat(filePath);

      //还要判断是文件夹还是文件  通过类型的不同  读取的方式不同
      if(states.isDirectory()){
        //如果是文件夹则读取文件夹里面的内容
        const files = await readdir(filePath);


        //调用pug 需要生成文件路径 找到文件后将pug渲染成html文件
        const pugFP = path.resolve(__dirname,'../viewes/index.pug');
        const html = pug.renderFile(pugFP, { files, url });


        //返回响应
        res.statusCode = 200;
        //设置响应头
        res.setHeader("Content-Type","text/html;charset=utf8");
        res.end(html);
        return; //成功完成了任意一个就不再继续执行下面的代码  直接return出去
      }

      if(states.isFile()){
        //如果是文件  则读取文件中的内容 使用流式读取文件的方法
        let readS = fs.createReadStream(filePath);

        //缓存控制
        const isCache = cache(states, req, res);
        //如果命中缓存 就return 因为在函数中已经设置 statusCode 和 end，就不需要接着执行了
        if(isCache) return;

        //获取文件的类型
        const myTypes = getMyTypes(filePath);

        //判断文件是js / css / html / json格式才进行压缩
        if(myTypes.match(/(javascript|css|html|json)/)){
          //对文件进行压缩
          readS = compress(readS, req, res);

        }

        //返回响应
        res.statusCode = 200;
        //设置响应头  按照js格式解析  使用的是万国码
        res.setHeader("Content-Type",`${myTypes};charset=utf8`);
        //返回响应的内容
        readS.pipe(res);
        return;
      }
    }catch (err){
      //查看错误原因
      console.log(err);
      //代码执行到catch中说明上面的异步方法中出现错误  文件找不到 返回404
      res.statusCode = 404;
      //text/plain是纯文本类型
      res.setHeader("Content-Type","text/plain;charset=utf8");
      res.end(`${url}不是一个文件或者文件夹`);
    }
  };
};
