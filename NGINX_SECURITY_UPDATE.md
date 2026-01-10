# 安全配置指南

## 1. 为什么需要修改 Nginx？
为了彻底解决 WooCommerce API 密钥泄露的风险，我们已经将前端代码重构为不直接调用 `https://elysoir.top/wp-json/...`，而是调用相对路径 `/api/wc/...`。
现在需要 Nginx 负责拦截这些 `/api/` 请求，并把它们安全地转发给后端的 WordPress，同时由 Nginx 自动附带 API 密钥。

## 2. 请将以下配置添加到您的 Nginx 配置文件 (elysoir.top.conf)

请找到 `location / { ... }` 块，在其**上方**添加以下两个新的 `location` 块。
**注意**：请务必替换 `<您的_CK>` 和 `<您的_CS>` 为真实的 Consumer Key 和 Secret。

```nginx
    # --------------------------------------------------------
    # 安全代理：WooCommerce API (自动注入密钥)
    # --------------------------------------------------------
    location /api/wc/ {
        # 1. 只有 Nginx 知道密钥，前端浏览器完全不知道
        # 请将下面的 base64 字符串替换为：echo -n "ck_xxx:cs_xxx" | base64 的结果
        # 或者直接使用明文 (不推荐，但可行): proxy_set_header Authorization "Basic Y2tf...base64...";
        
        # 更好的方式是直接用变量（如果安装了 Lua 模块）或者直接硬编码 Base64 值
        # 假设 ck_...:cs_... 的 Base64 值为 "YOUR_BASE64_KEY_HERE"
        proxy_set_header Authorization "Basic YOUR_BASE64_KEY_HERE";

        # 2. 转发到本机的 /wp-json/wc/v3
        proxy_pass http://127.0.0.1:80/wp-json/wc/v3/;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # --------------------------------------------------------
    # 公共代理：WordPress API (文章数据)
    # --------------------------------------------------------
    location /api/wp/ {
        proxy_pass http://127.0.0.1:80/wp-json/wp/v2/;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
```

## 3. 如何生成 Base64 Key
在终端运行：
```bash
# 替换为您的真实 key
echo -n "ck_xxxxxxxxxxxxxxxx:cs_xxxxxxxxxxxxxxxx" | base64
```
将输出的字符串填入上面的 `YOUR_BASE64_KEY_HERE`。

## 4. 验证
配置并重启 Nginx 后，访问 `https://elysoir.top/api/wc/products`。如果能看到 JSON 数据，说明配置成功。
