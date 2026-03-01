import { createI18n } from 'vue-i18n';

/**
 * 自动加载指定语言目录下的所有 JSON 模块
 * @param lang 语言标识符 (如 'zh-CN')
 */
const loadLocaleMessages = (lang: string) => {
  const messages: Record<string, any> = {};
  let modules: Record<string, any> = {};

  // Vite 的 import.meta.glob 参数必须是静态字符串
  if (lang === 'zh-CN') {
    modules = import.meta.glob('./zh-CN/*.json', { eager: true });
  } else if (lang === 'zh-TW') {
    modules = import.meta.glob('./zh-TW/*.json', { eager: true });
  } else if (lang === 'en-US') {
    modules = import.meta.glob('./en-US/*.json', { eager: true });
  }

  for (const path in modules) {
    // 提取文件名作为 key，例如 ./zh-CN/ui.json -> ui
    const matched = path.match(/\/([^/]+)\.json$/);
    if (matched && matched[1]) {
      const key = matched[1];
      messages[key] = (modules[path] as any).default;
    }
  }
  return messages;
};

const messages = {
  'zh-CN': loadLocaleMessages('zh-CN'),
  'zh-TW': loadLocaleMessages('zh-TW'),
  'en-US': loadLocaleMessages('en-US'),
};

// 使用 en-US 作为主架构进行类型推导
type MessageSchema = typeof messages['en-US'];

const i18n = createI18n<[MessageSchema], 'en-US' | 'zh-CN' | 'zh-TW'>({
  legacy: false, // 使用 Composition API 模式
  locale: localStorage.getItem('app_locale') || 'zh-CN', // 默认语言
  fallbackLocale: 'en-US', // 回退语言
  messages: messages as any
});

export default i18n;
