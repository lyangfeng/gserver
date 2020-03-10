//定义缓存
//由于nodejs中没有etag的方法  所以我们要通过npm i etag 下载一个安装包
const etag = require('etag');

//定义一个函数 判断是否命中协商缓存的方式
function checkCache(stats,req) {
  //先获取客户端发送的If-None-Match If-Modified-Since  且里面的属性名都是小写
  const ifNoneMatch = req.headers["if-none-match"];
  const ifModifiedSince = req.headers["if-modified-since"];

  
  /*相等则返回true 返回true在最后cache函数中会进入到判断中
  进入到判断中后 会命中缓存则直接响应  不相等则不会进入判断
  中则不会执行cache中的判断语句  直接进行重新设置新的缓存的代码*/

  //判断If-None-Match 和 服务器保存的 etag 是否相等
  //If-None-Match 和 etag所代表的为同一个内容  只是为了区分客户端缓存的和服务器保存的内容是否一致
  const eTag = etag(stats);  //生成基于文件内容的唯一标识
  if(ifNoneMatch && ifNoneMatch === eTag){
    return true;
  }

  //判断 If-Modified-Since 和 服务器保存的 Last-modified 是否相等
  // 获取文件上一次修改时间 - 转换成GMT格式
  //mtime是stats上的方法 代表的是代码上一次的修改时间
  const lastModified = new Date(stats.mtime).toGMTString();
  if(ifModifiedSince && ifModifiedSince === lastModified){
    return true;
  }

  //如果都不相等
  return false;
}

//设置缓存的方式
function setCache(stats, res){
  //设置强制缓存
  /**
   * Cache-Control  表示强制缓存
   * max-age=3600  表示强制缓存一个小时
   * public  表示允许所有东西都被缓存
   */
  res.setHeader("Cache-Control","max-age=3600,public");
  res.setHeader("Expires",new Date(Date.now() + 3600).toGMTString());

  //设置协商缓存
  res.setHeader("Etag",etag(stats));
  res.setHeader("Last-modified",new Date(stats.mtime).toGMTString());
}


//设置缓存
function cache(stats, req, res){
  /*判断浏览器是否命中缓存  命中缓存就是协商缓存  强制缓存不会给浏览器发送请求
  所以不存在会发生命中缓存的情况 */
  const isCache = checkCache(stats, req);

  if(isCache){
    //如果命中缓存  设置响应码为304
    res.statusCode = 304;
    res.end();
    return true;
  }

  //没有命中缓存  由两种情况产生：1、缓存过期了  2、当前属于第一次访问，之前没有缓存过值
  //所以没有缓存  就要重新设置缓存
  setCache(stats, res);
  return false;
}

//将cache函数暴露出去
module.exports = cache;


/**
 * 里面使用的是fs.stats的方法来获取etag的唯一标识符
 * 
 */