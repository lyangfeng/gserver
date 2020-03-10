//配置命令行参数
//需要配置一下环境  使用npm i yargs

//引入yargs模块
const yargs = require("yargs");

//通过process中的argv方法  来获取当前命令行的参数
const argv = yargs
  .usage("server [options]") //不是server后面可以运行多个options
  .option("p",{
    //配置指令选项
    alias: "port",  //配置别名
    describe: "端口号",  //描述
    default: 3000  //默认值
  })
  .option("h",{
    //配置指令选项
    alias: "host",  //配置别名
    describe: "主机名",  //描述
    default: "localhost"  //默认值
  })
  .option("d",{
    //配置指令选项
    alias: "root",  //配置别名
    describe: "运行项目的根目录",  //描述
    default: process.cmd()  //默认值
  })
  .version()  //增加 -v 指令， 查看版本号
  .alias("v","version")  //对 v 进行配置别名：version
  .help().argv;  //增加 --help 指令，查看帮助

//向外暴露
module.exports = argv;