//用于压缩文件所占内存的大小

const { createGzip, createDeflate } = require("zlib");


//定义一个函数
function compress(readS, req, res){
  //判断浏览器是否支持压缩 在请求头上获取到这个元素上所支持的压缩格式
  const accEnc = req.headers["accept-encoding"];

  //如果支持 则判断哪一种压缩方式可使用
  if(accEnc){
    //获取浏览器中可支持的压缩格式  按照逗号加空格 将其拆分开来
    const accEncArr = accEnc.split(", ");

    //判断是否支持gzip
    //找到相应的内容就会执行  如果没找到会返回-1  当值不为-1时则代表找到了相对应的压缩格式
    if(accEncArr.indexOf("gzip") !== -1){
      //设置响应头 告诉客户端内容进行了压缩
      res.setHeader("Content-Encoding","gzip");
      //将可读流传来的数据进行压缩
      readS = readS.pipe(createGzip());
      return readS;
    }

    //判断是否支持deflate
    if(accEncArr.indexOf("deflate") !== -1){
      //设置响应头 告诉客户端内容进行了压缩
      res.setHeader("Content-Encoding","deflate");
      //将可读流传来的数据进行压缩
      readS = readS.pipe(createDeflate());
      return readS;
    }
  }
  //返回内容
  return readS;
}

//将函数暴露出去
module.exports = compress;