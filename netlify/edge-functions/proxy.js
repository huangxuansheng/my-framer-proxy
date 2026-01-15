// 代理函数 - 将请求转发到你的 Framer 网站
export default async (request, context) => {
  try {
    // 你的 Framer 网站地址
    const FRAMER_URL = 'https://left-footprint-804914.framer.app';
    
    // 获取请求的 URL
    const url = new URL(request.url);
    
    // 构建目标 URL（保留路径和查询参数）
    const targetUrl = new URL(FRAMER_URL);
    targetUrl.pathname = url.pathname;
    targetUrl.search = url.search;
    
    // 复制请求头
    const headers = new Headers(request.headers);
    
    // 移除可能引起问题的请求头
    headers.delete('host');
    headers.delete('referer');
    headers.delete('origin');
    
    // 添加必要的请求头
    headers.set('host', 'left-footprint-804914.framer.app');
    
    // 准备请求选项
    const requestOptions = {
      method: request.method,
      headers: headers,
      redirect: 'follow'
    };
    
    // 如果不是 GET 请求，传递 body
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      requestOptions.body = request.body;
    }
    
    // 发起代理请求
    const response = await fetch(targetUrl.toString(), requestOptions);
    
    // 复制响应头
    const responseHeaders = new Headers(response.headers);
    
    // 修改响应头，确保正常工作
    responseHeaders.set('access-control-allow-origin', '*');
    responseHeaders.set('vary', 'Accept-Encoding');
    
    // 创建新的响应
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
    
  } catch (error) {
    // 错误处理
    return new Response(`代理错误: ${error.message}`, {
      status: 500,
      headers: { 'content-type': 'text/plain' }
    });
  }
};