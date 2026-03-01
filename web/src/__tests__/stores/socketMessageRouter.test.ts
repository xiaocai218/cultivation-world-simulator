import { describe, it, expect, vi, beforeEach } from 'vitest'
import { routeSocketMessage } from '@/stores/socketMessageRouter'

const { mockMessage } = vi.hoisted(() => ({
  mockMessage: {
    error: vi.fn(),
    warning: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}))

let mockLocale: { value: string } | string = { value: 'zh-CN' }
let mockMode: 'legacy' | 'composition' = 'composition'

vi.mock('@/utils/discreteApi', () => ({
  message: mockMessage,
}))

vi.mock('@/locales', () => ({
  default: {
    get mode() {
      return mockMode
    },
    global: {
      get locale() {
        return mockLocale
      },
      set locale(val) {
        mockLocale = val
      },
    },
  },
}))

describe('socketMessageRouter', () => {
  const worldStore = {
    handleTick: vi.fn(),
    initialize: vi.fn().mockResolvedValue(undefined),
  }
  const uiStore = {
    selectedTarget: null as null | { type: string; id: string },
    refreshDetail: vi.fn(),
    openSystemMenu: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    uiStore.selectedTarget = null
    mockLocale = { value: 'zh-CN' }
    mockMode = 'composition'
    document.documentElement.lang = 'zh-CN'
  })

  it('routes tick message to world and refreshes selected detail', () => {
    uiStore.selectedTarget = { type: 'avatar', id: 'a1' }
    routeSocketMessage(
      { type: 'tick', year: 1, month: 1, events: [], avatars: [] },
      { worldStore: worldStore as any, uiStore: uiStore as any }
    )

    expect(worldStore.handleTick).toHaveBeenCalled()
    expect(uiStore.refreshDetail).toHaveBeenCalled()
  })

  it('opens llm config menu on llm_config_required', () => {
    routeSocketMessage(
      { type: 'llm_config_required', error: 'LLM required' },
      { worldStore: worldStore as any, uiStore: uiStore as any }
    )

    expect(uiStore.openSystemMenu).toHaveBeenCalledWith('llm', false)
    expect(mockMessage.error).toHaveBeenCalledWith('LLM required')
  })

  it('switches language when toast includes language', () => {
    routeSocketMessage(
      { type: 'toast', level: 'info', message: 'ok', language: 'en-US' },
      { worldStore: worldStore as any, uiStore: uiStore as any }
    )

    expect((mockLocale as { value: string }).value).toBe('en-US')
    expect(document.documentElement.lang).toBe('en')
  })
})

