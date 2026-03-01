# 前端多语言 (i18n) 模块化开发指南

## 1. 为什么需要模块化？

在之前的架构中，所有的前端多语言词条都集中在 `web/src/locales/zh-CN.json` (以及 `zh-TW.json`, `en-US.json`) 等单一的巨型 JSON 文件中。这种 "Monolithic" 的管理方式存在以下问题：
- **开发冲突**：多人协同开发时，很容易在合并代码时发生 Git 冲突。
- **查找困难**：随着游戏文本的增加，在几千行的 JSON 中寻找特定的键值对变得非常困难。
- **心智负担**：前端的 i18n 结构与后端 (`static/locales/*/modules/*.po`) 不一致，开发者在前后端切换时需要转换思维。

因此，我们重构了前端的 i18n 系统，采用了**按模块拆分文件夹**的策略。

## 2. 目录结构

现在的多语言文件按语言存放于独立的文件夹内，并按业务模块（如 `ui.json`, `game.json`, `llm.json`）拆分为多个小文件：

```text
web/src/locales/
├── zh-CN/
│   ├── ui.json           # 菜单、基础UI按钮等
│   ├── game.json         # 游戏内相关文本 (状态栏, 面板, 详情等)
│   ├── llm.json          # LLM 配置页面相关
│   ├── loading.json      # 加载界面及 Tips
│   └── ...               # 其他模块
├── zh-TW/
│   ├── ui.json
│   └── ...
├── en-US/
│   ├── ui.json
│   └── ...
└── index.ts              # 自动扫描并聚合 JSON 模块的入口
```

## 3. 开发规范与工作流

### 3.1 如何新增多语言词条？

1. **确定所属模块**：判断你的词条属于哪个模块（例如是在 `ui.json` 还是 `game.json`）。如果是一个全新的大型系统，你可以在三个语言文件夹（`zh-CN/`, `zh-TW/`, `en-US/`）下新建同名的 JSON 文件，如 `achievement.json`。
2. **添加词条**：在对应的 JSON 文件中添加你的词条。注意，此时的 Key 将自动挂载在该模块的命名空间下。
   * **示例**：在 `zh-CN/ui.json` 中添加 `"new_button": "新按钮"`。
   * **使用**：在 Vue 组件中使用 `$t('ui.new_button')` 即可访问。

### 3.2 自动聚合机制 (`index.ts`)

你**不需要**手动在 `index.ts` 中 `import` 你新建的 JSON 文件。

`web/src/locales/index.ts` 利用了 Vite 的 `import.meta.glob` 机制，在项目启动（或构建）时会自动扫描 `./{lang}/*.json`，并将文件名作为顶级 Key 进行组装。

```typescript
// 引擎底层逻辑示例：
// 如果存在 zh-CN/ui.json，其内容为 { "start": "开始" }
// 最终会聚合成 { "zh-CN": { "ui": { "start": "开始" } } }
```

### 3.3 类型安全 (Type Safety)

我们在 `index.ts` 中指定了 `en-US` 为主 Schema 源：
```typescript
type MessageSchema = typeof messages['en-US'];
```
这意味着：**如果你在 Vue 中使用 `$t()` 时没有代码提示，或者 TypeScript 报错，请检查你是否在 `en-US` 的对应 JSON 中也添加了相同的 Key。**

## 4. 自动化测试与 CI (持续集成)

为了防止漏翻或者各语言的 Key 结构不一致（例如在 `zh-CN/llm.json` 中加了词条却忘了加到 `en-US/llm.json`），我们引入了严格的自动化校验。

### 4.1 校验脚本

脚本位于：`tools/i18n/check_frontend_locales.py`

它会执行以下检查：
1. 遍历 `web/src/locales` 下所有的 JSON 模块。
2. 将所有嵌套的 JSON 对象展平为以点分隔的键路径（如 `descs.max_concurrent_requests`）。
3. 交叉对比各个语言（zh-CN, zh-TW, en-US），如果存在任何缺少或多出的 Key，脚本将报错并打印出差异。

### 4.2 GitHub Actions 拦截

该脚本已被集成到 `.github/workflows/test.yml` 的 CI 流程中。

```yaml
      - name: Validate frontend locales
        run: python tools/i18n/check_frontend_locales.py
```

每次你提交 PR (Pull Request) 或 push 代码到主分支时，GitHub Actions 都会运行此脚本。如果你的中英文 Key 不一致，CI 将标红失败，阻止合并。

**因此，请务必保证你每次新增多语言词条时，同步更新三种语言的对应文件！**
