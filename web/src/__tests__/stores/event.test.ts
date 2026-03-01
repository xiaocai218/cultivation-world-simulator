import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useEventStore } from '@/stores/event'

vi.mock('@/api', () => ({
  eventApi: {
    fetchEvents: vi.fn(),
  },
}))

import { eventApi } from '@/api'

describe('useEventStore', () => {
  let store: ReturnType<typeof useEventStore>

  beforeEach(() => {
    store = useEventStore()
    store.reset()
    vi.clearAllMocks()
  })

  it('records merge duration when handling tick events', () => {
    store.addEvents([
      {
        id: 'e1',
        text: 'event',
        content: 'event',
        related_avatar_ids: [],
        is_major: false,
        is_story: false,
        created_at: 1,
      },
    ] as any, 1, 1)

    expect(store.events).toHaveLength(1)
    expect(store.lastMergeDurationMs).toBeGreaterThanOrEqual(0)
  })

  it('records load duration and keeps timeline in ascending order', async () => {
    vi.mocked(eventApi.fetchEvents).mockResolvedValue({
      events: [
        {
          id: 'e2',
          text: 'newer',
          content: 'newer',
          year: 1,
          month: 2,
          month_stamp: 14,
          related_avatar_ids: [],
          is_major: false,
          is_story: false,
          created_at: 2,
        },
        {
          id: 'e1',
          text: 'older',
          content: 'older',
          year: 1,
          month: 1,
          month_stamp: 13,
          related_avatar_ids: [],
          is_major: false,
          is_story: false,
          created_at: 1,
        },
      ],
      next_cursor: null,
      has_more: false,
    })

    await store.loadEvents({})

    expect(store.lastLoadDurationMs).toBeGreaterThanOrEqual(0)
    expect(store.events.map((e) => e.id)).toEqual(['e1', 'e2'])
  })
})

