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
- 针对女性高端珠宝/手表/包包设计。
- 风格追求：优雅、丝滑动画。
- 动画首选：Framer Motion，使用物理弹簧参数 (Spring settings)。

## 4. 数据结构
- 从 WooCommerce 抓取数据后，请先进行数据清洗，只返回前端需要的字段：id, name, price, images, description, stock_status等等。

## 5. 图片处理与性能
- **Next.js Image 强制要求**: 所有产品图片必须使用 `next/image` 组件。
- **自动占位**: 必须包含 `placeholder="blur"` 或自定义的 Loading 骨架屏动画，防止图片加载时的视觉闪烁。
- **宽高比固定**: 针对珠宝展示，默认使用 `aspect-[3/4]` 或 `aspect-square`，确保列表整齐。
## 6. 交互动效准则 (Luxury Motion)
- **物理特性**: 严禁使用默认的 `ease-in-out`。所有过度动画必须使用 `type: "spring"`。
- **推荐参数**: 设置 `stiffness: 100, damping: 20`（沉稳感）或 `stiffness: 300, damping: 30`（灵动感）。
- **微交互**: 按钮和产品卡片必须包含 `whileHover={{ scale: 1.02 }}` 和 `whileTap={{ scale: 0.98 }}` 的细微反馈。
- **进场顺序**: 列表项必须使用 `staggerChildren` 实现“阶梯式”优雅入场。
## 7. 环境变量与部署安全
- **严格区分**: 只有以 `NEXT_PUBLIC_` 开头的变量才能在客户端使用。
- **风险阻断**: 当我要求编写 Firebase Cloud Functions 或 Next.js API 时，自动检查是否已从 `.env.local` 提取敏感信息。
- **防护提示**: 如果我尝试在 `useEffect` 中编写包含 API Key 的 fetch 请求，请立即拦截并提示我重构为 API Route。

## 8. 数据清洗与转化 (Data Adapter)
- **字段映射**: 抓取 WooCommerce 数据后，自动将复杂的嵌套对象转化为扁平化的简洁对象。
- **SKU 处理**: 自动处理多属性产品（Variations），只给前端返回当前选中的 SKU 价格和库存，图片等需要的数据，简化前端逻辑。
- **金额格式化**: 自动根据币种（如 EUR, CNY）处理小数点，不需要前端手动计算。
每当我完成一个功能，请自动根据以上准则进行一次简易审计，并告诉我哪些地方符合规范，哪些地方需要改进。
每当我询问如何实现某个功能时，请先扫描我的 components 文件夹，看是否有现成的组件可以复用，不要重复造轮子