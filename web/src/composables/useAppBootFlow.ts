import { computed, ref, watch, type Ref } from 'vue'
import type { InitStatusDTO } from '@/types/api'
import type { SystemMenuTab } from '@/stores/ui'

interface UseAppBootFlowOptions {
  initStatus: Ref<InitStatusDTO | null>
  gameInitialized: Ref<boolean>
  showLoading: Ref<boolean>
  showMenu: Ref<boolean>
  menuDefaultTab: Ref<SystemMenuTab>
  isManualPaused: Ref<boolean>
  performStartupCheck: () => void | Promise<void>
  handleMenuClose: () => void
  onGameBgmStart: () => void
  onResumeGame: () => Promise<void>
}

type SplashActionKey = 'start' | 'load' | 'settings' | 'about'

export function useAppBootFlow(options: UseAppBootFlowOptions) {
  const showSplash = ref(false)
  const isAppReady = ref(false)
  const openedFromSplash = ref(false)

  const shouldBlockControls = computed(() => {
    return options.showLoading.value || showSplash.value
  })

  watch(options.initStatus, (newVal, oldVal) => {
    if (!newVal) return

    if (!isAppReady.value) {
      isAppReady.value = true
      if (newVal.status === 'idle') {
        showSplash.value = true
      }
    }

    if (newVal.status === 'idle' && oldVal && oldVal.status !== 'idle') {
      if (!options.showMenu.value && !showSplash.value) {
        options.performStartupCheck()
      }
    }

    if (oldVal?.status !== 'ready' && newVal.status === 'ready') {
      options.showMenu.value = false
    }
  })

  watch(options.gameInitialized, async (val) => {
    if (!val) return

    options.onGameBgmStart()

    if (showSplash.value) {
      showSplash.value = false
    }

    options.isManualPaused.value = false
    await options.onResumeGame()
    openedFromSplash.value = false
  }, { immediate: true })

  function handleSplashNavigate(key: SplashActionKey) {
    openedFromSplash.value = true
    showSplash.value = false

    if (key === 'start') {
      options.performStartupCheck()
      return
    }

    options.menuDefaultTab.value = key
    options.showMenu.value = true
  }

  function handleMenuCloseWrapper() {
    if (openedFromSplash.value) {
      options.showMenu.value = false
      showSplash.value = true
      return
    }
    options.handleMenuClose()
  }

  function returnToSplash() {
    options.showMenu.value = false
    showSplash.value = true
    openedFromSplash.value = false
  }

  return {
    showSplash,
    isAppReady,
    shouldBlockControls,
    handleSplashNavigate,
    handleMenuCloseWrapper,
    returnToSplash,
  }
}

