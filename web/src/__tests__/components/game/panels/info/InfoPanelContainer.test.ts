import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import InfoPanelContainer from '@/components/game/panels/info/InfoPanelContainer.vue'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'

describe('InfoPanelContainer', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render successfully', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'zh-CN',
      messages: {}
    })

    const wrapper = mount(InfoPanelContainer, {
      global: {
        plugins: [createPinia(), i18n],
        stubs: {
          AvatarDetail: true,
          SectDetail: true,
          RegionDetail: true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
