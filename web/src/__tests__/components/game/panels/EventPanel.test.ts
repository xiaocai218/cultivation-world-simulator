import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import EventPanel from '@/components/game/panels/EventPanel.vue'
import { createI18n } from 'vue-i18n'
import { reactive } from 'vue'

const avatarStoreMock = reactive({
  avatarList: [
    { id: 'a1', name: 'Alice', is_dead: false },
  ],
})

const eventStoreMock = reactive({
  events: [],
  eventsHasMore: false,
  eventsLoading: false,
  resetEvents: vi.fn(async () => {}),
  loadMoreEvents: vi.fn(async () => {}),
})

const uiStoreMock = {
  select: vi.fn(),
}

vi.mock('@/stores/avatar', () => ({
  useAvatarStore: () => avatarStoreMock,
}))

vi.mock('@/stores/event', () => ({
  useEventStore: () => eventStoreMock,
}))

vi.mock('@/stores/ui', () => ({
  useUiStore: () => uiStoreMock,
}))

describe('EventPanel', () => {
  beforeEach(() => {
    eventStoreMock.events = []
    eventStoreMock.eventsHasMore = false
    eventStoreMock.eventsLoading = false
    eventStoreMock.resetEvents.mockClear()
    eventStoreMock.loadMoreEvents.mockClear()
    uiStoreMock.select.mockClear()
  })

  it('should render successfully', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'zh',
      messages: {
        zh: {
          game: {
            event_panel: {
              title: 'Events',
              filter_all: 'All',
              deceased: '(dead)',
              add_second: '+1',
              load_more: 'load',
              empty_none: 'none',
              empty_single: 'none',
              empty_dual: 'none',
            }
          },
          common: { loading: 'loading', year: '年', month: '月' },
        }
      }
    })

    const wrapper = mount(EventPanel, {
      global: {
        plugins: [i18n],
        directives: {
          sound: () => {}
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should render event content as text, not raw html', async () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'zh',
      messages: {
        zh: {
          game: { event_panel: { title: 'Events', filter_all: 'All', deceased: '(dead)', add_second: '+1', load_more: 'load', empty_none: 'none', empty_single: 'none', empty_dual: 'none' } },
          common: { loading: 'loading', year: '年', month: '月' },
        },
      },
    })

    eventStoreMock.events = [
      {
        id: 'e1',
        text: '',
        content: '<img src=x onerror=alert(1)> Alice',
        year: 1,
        month: 1,
        timestamp: 13,
        relatedAvatarIds: ['a1'],
        isMajor: false,
        isStory: false,
      },
    ]

    const wrapper = mount(EventPanel, {
      global: {
        plugins: [i18n],
      },
    })

    const html = wrapper.html()
    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;')
    expect(wrapper.find('.clickable-avatar').text()).toBe('Alice')
  })
})
