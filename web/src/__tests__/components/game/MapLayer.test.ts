import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MapLayer from '@/components/game/MapLayer.vue'
import { createPinia, setActivePinia } from 'pinia'

describe('MapLayer', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render successfully', () => {
    const wrapper = mount(MapLayer, {
      global: {
        plugins: [createPinia()],
        stubs: {
          container: true,
          sprite: true,
          graphics: true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
