import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');

  const SITE_URL = env.VITE_SITE_URL || 'https://elysoir.top'; // 默认回退
  const CK = env.VITE_WC_CONSUMER_KEY;
  const CS = env.VITE_WC_CONSUMER_SECRET;
  const AUTH = (CK && CS) ? Buffer.from(`${CK}:${CS}`).toString('base64') : '';

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
      hmr: {
        protocol: 'wss',
        clientPort: 443,
      },
      // 本地开发代理：模拟 Nginx 的行为
      proxy: {
        '/api/wc': {
          target: SITE_URL, // 目标服务器
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/wc/, '/wp-json/wc/v3'),
          headers: {
            'Authorization': `Basic ${AUTH}` // 这里由 Vite 注入密钥，浏览器不可见
          }
        },
        '/api/wp': {
          target: SITE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/wp/, '/wp-json/wp/v2'),
          // WP API (文章等) 通常不需要认证，除非是草稿
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
