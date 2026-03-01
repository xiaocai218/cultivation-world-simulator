import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useAppBootFlow } from '@/composables/useAppBootFlow'
import type { InitStatusDTO } from '@/types/api'
import type { SystemMenuTab } from '@/stores/ui'

function makeStatus(overrides: Partial<InitStatusDTO> = {}): InitStatusDTO {
  return {
    status: 'idle',
    phase: 0,
    phase_name: '',
    progress: 0,
    elapsed_seconds: 0,
    error: null,
    llm_check_failed: false,
    llm_error_message: '',
    ...overrides,
  }
}

describe('useAppBootFlow', () => {
  it('shows splash on first idle status', async () => {
    const initStatus = ref<InitStatusDTO | null>(null)
    const gameInitialized = ref(false)
    const showLoading = ref(false)
    const showMenu = ref(false)
    const menuDefaultTab = ref<SystemMenuTab>('load')
    const isManualPaused = ref(true)

    useAppBootFlow({
      initStatus,
      gameInitialized,
      showLoading,
      showMenu,
      menuDefaultTab,
      isManualPaused,
      performStartupCheck: vi.fn(),
      handleMenuClose: vi.fn(),
      onGameBgmStart: vi.fn(),
      onResumeGame: vi.fn().mockResolvedValue(undefined),
    })

    initStatus.value = makeStatus({ status: 'idle' })
    await Promise.resolve()

    expect(showMenu.value).toBe(false)
  })

  it('routes splash action into menu tab', () => {
    const initStatus = ref<InitStatusDTO | null>(makeStatus({ status: 'idle' }))
    const gameInitialized = ref(false)
    const showLoading = ref(false)
    const showMenu = ref(false)
    const menuDefaultTab = ref<SystemMenuTab>('load')
    const isManualPaused = ref(true)

    const boot = useAppBootFlow({
      initStatus,
      gameInitialized,
      showLoading,
      showMenu,
      menuDefaultTab,
      isManualPaused,
      performStartupCheck: vi.fn(),
      handleMenuClose: vi.fn(),
      onGameBgmStart: vi.fn(),
      onResumeGame: vi.fn().mockResolvedValue(undefined),
    })

    boot.handleSplashNavigate('settings')

    expect(showMenu.value).toBe(true)
    expect(menuDefaultTab.value).toBe('settings')
  })

  it('resumes game and clears manual pause after initialization', async () => {
    const initStatus = ref<InitStatusDTO | null>(makeStatus({ status: 'ready' }))
    const gameInitialized = ref(false)
    const showLoading = ref(false)
    const showMenu = ref(false)
    const menuDefaultTab = ref<SystemMenuTab>('load')
    const isManualPaused = ref(true)
    const onResumeGame = vi.fn().mockResolvedValue(undefined)

    useAppBootFlow({
      initStatus,
      gameInitialized,
      showLoading,
      showMenu,
      menuDefaultTab,
      isManualPaused,
      performStartupCheck: vi.fn(),
      handleMenuClose: vi.fn(),
      onGameBgmStart: vi.fn(),
      onResumeGame,
    })

    gameInitialized.value = true
    await Promise.resolve()

    expect(isManualPaused.value).toBe(false)
    expect(onResumeGame).toHaveBeenCalledTimes(1)
  })
})

