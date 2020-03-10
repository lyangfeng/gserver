//配置文件
//配置常用端口号  主机名  和文件运行所在的目录（根路径）

//使用module.exports向外暴露一个函数
module.exports = {
  port: 3000,
  host: 'localhost',
  proRoot: process.cwd()
};