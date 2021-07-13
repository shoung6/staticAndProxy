const http = require("http");
const httpProxy = require("http-proxy");

// 新建一个代理 Proxy Server 对象
const proxy = httpProxy.createProxyServer({});

// 捕获异常
proxy.on("error", function (err, req, res) {
  console.log(err);
  res.writeHead(500, {
    "Content-Type": "text/plain",
  });
  res.end("Something went wrong. And we are reporting a custom error message.");
});

// 另外新建一个 HTTP 80 端口的服务器，也就是常规 Node 创建 HTTP 服务器的方法。
// 在每次请求中，调用 proxy.web(req, res config) 方法进行请求分发
http
  .createServer(function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.headers.proxy) {
      proxy.web(req, res, {
        target: req.headers.proxy,
        changeOrigin: true,
      });
    } else {
      // 跨域预检请求
      res.writeHead(200);
      res.end();
    }
  })
  .listen(8881);
console.log("node-proxy listening on port 8881");

// 静态资源服务器
const Koa = require("koa");
const path = require("path");
const App = new Koa();
/**
 * 引入 koa-static
 * */
const staticFiles = require("koa-static");
/**
 *  设置 public文件夹为静态资源文件夹
 * */
App.use(staticFiles(path.join(__dirname, "public")));

App.listen(8882, function () {
  console.log("static-server listening on port 8882");
});
