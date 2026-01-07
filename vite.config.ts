import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: true, // 允许 Project IDX 的动态域名访问，解决 Vite 6 的 Host 检查问题
    hmr: {
       protocol: 'wss', // 使用加密的 WebSocket 协议，匹配 HTTPS 预览环境
       clientPort: 443, 
    }
  }
});
