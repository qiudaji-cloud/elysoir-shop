# 我们的开发规范与架构准则

## 1. 技术栈背景
- **前端框架**: Next.js (App Router), Tailwind CSS
- **动画库**: Framer Motion
- **电商后台**: WooCommerce (通过 REST API 交互)

## 2. 数据获取与安全准则 (重要)
- **严禁直接从前端调用 WooCommerce API**: 所有与 WooCommerce 的交互必须通过 Next.js 的 **API Routes** (位于 `/app/api/` 或 `/pages/api/`) 进行代理。
- **原因**: 保护 API Key (ck_... 和 cs_...) 不被暴露在客户端，并解决跨域问题。
- **默认操作**: 当我要求你实现产品抓取、库存检查或订单提交功能时，请自动编写一对代码：一个是 API Route 后端处理逻辑，一个是前端 Fetch 调用逻辑。

## 3. UI/UX 风格要求
- 针对高端珠宝/手表设计。
- 风格追求：优雅、丝滑动画。
- 动画首选：Framer Motion，使用物理弹簧参数 (Spring settings)。

## 4. 数据结构
- 从 WooCommerce 抓取数据后，请先进行数据清洗，只返回前端需要的字段：id, name, price, images, description, stock_status等等。