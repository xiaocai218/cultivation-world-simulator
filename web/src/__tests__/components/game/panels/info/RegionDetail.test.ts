import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import RegionDetail from '@/components/game/panels/info/RegionDetail.vue'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'

describe('RegionDetail', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render successfully', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'zh-CN',
      messages: {}
    })

    const wrapper = mount(RegionDetail, {
      props: {
        data: {
          id: '1',
          type_name: 'Test',
          desc: 'Test Desc',
          color: '#fff',
          x: 0,
          y: 0,
          width: 1,
          height: 1
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
