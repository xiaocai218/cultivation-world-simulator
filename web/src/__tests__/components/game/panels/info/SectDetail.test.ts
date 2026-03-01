import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import SectDetail from '@/components/game/panels/info/SectDetail.vue'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'

describe('SectDetail', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render successfully', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'zh-CN',
      messages: {}
    })

    const wrapper = mount(SectDetail, {
      props: {
        data: {
          id: '1',
          name: 'Test Sect',
          alignment: 'Good',
          member_count: 10,
          desc: 'Test'
        } as any
      },
      global: {
        plugins: [createPinia(), i18n],
        stubs: {
          StatItem: true,
          EntityRow: true,
          TagList: true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
