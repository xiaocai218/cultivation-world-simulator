import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'

describe('LoadingOverlay', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render successfully', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'zh-CN',
      messages: {
        'zh-CN': {
          ui: {
            loading_title: 'Loading',
            tips: []
          }
        }
      }
    })

    const wrapper = mount(LoadingOverlay, {
      global: {
        plugins: [createPinia(), i18n],
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
