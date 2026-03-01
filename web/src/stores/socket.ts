import { defineStore } from 'pinia';
import { ref } from 'vue';
import { gameSocket } from '../api/socket';
import { useWorldStore } from './world';
import { useUiStore } from './ui';
import type { SocketMessageDTO } from '../types/api';
import { routeSocketMessage } from './socketMessageRouter';

export const useSocketStore = defineStore('socket', () => {
  const isConnected = ref(false);
  const lastError = ref<string | null>(null);
  
  let cleanupMessage: (() => void) | undefined;
  let cleanupStatus: (() => void) | undefined;

  function init() {
    if (cleanupStatus) return; // Already initialized

    const worldStore = useWorldStore();
    const uiStore = useUiStore();

    // Listen for status
    cleanupStatus = gameSocket.onStatusChange((connected) => {
      isConnected.value = connected;
      if (connected) {
        lastError.value = null;
      }
    });

    cleanupMessage = gameSocket.on((data: unknown) => {
      if (!data || typeof data !== 'object' || !('type' in data)) return;
      routeSocketMessage(data as SocketMessageDTO, { worldStore, uiStore });
    });

    // Connect socket
    gameSocket.connect();
  }

  function disconnect() {
    if (cleanupMessage) cleanupMessage();
    if (cleanupStatus) cleanupStatus();
    cleanupMessage = undefined;
    cleanupStatus = undefined;
    gameSocket.disconnect();
    isConnected.value = false;
  }

  return {
    isConnected,
    lastError,
    init,
    disconnect
  };
});

