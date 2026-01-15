// 将此 URL 替换为你想要代理的目标网站地址
const TARGET_URL = "https://left-footprint-804914.framer.app/";

export default async (request, context) => {
  const url = new URL(request.url);
  
  // 如果是访问首页且存在 index.html，可以让 Netlify 处理静态文件（可选）
  // 这里我们演示完全代理，或者拦截特定路径
  // 如果你希望根路径显示 public/index.html，可以放行
  if (url.pathname === "/" || url.pathname === "/index.html") {
    return context.next();
  }

  // 构建目标 URL
  const targetUrl = new URL(url.pathname + url.search, TARGET_URL);

  // 可以在这里修改请求头，例如 Host
  const headers = new Headers(request.headers);
  headers.set("Host", targetUrl.host);
  headers.set("X-Forwarded-Host", url.host);

  try {
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: "manual", // 让客户端处理重定向
    });

    // 创建新的响应头
    const responseHeaders = new Headers(response.headers);
    
    // 如果需要，可以在这里修改响应头，例如处理 CORS 或 Cookie

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response(`Proxy Error: ${error.message}`, { status: 500 });
  }
};
