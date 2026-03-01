import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import SplashLayer from '@/components/SplashLayer.vue'
import { createI18n } from 'vue-i18n'

describe('SplashLayer', () => {
  it('should render successfully', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'zh-CN',
      messages: {
        'zh-CN': {
          splash: {
            title: 'Title',
            subtitle: 'Subtitle',
            click_to_start: 'Click to start'
          }
        }
      }
    })

    const wrapper = mount(SplashLayer, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.splash-container').exists()).toBe(true)
  })
})
