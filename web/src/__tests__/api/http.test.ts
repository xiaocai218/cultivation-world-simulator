import { describe, it, expect, vi, beforeEach } from 'vitest'
import { httpClient } from '@/api/http'

describe('httpClient api', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: 'test' })
    }) as any
  })

  it('should make GET request successfully', async () => {
    const res = await httpClient.get('/test')
    expect(res).toEqual({ data: 'test' })
  })

  it('should make POST request successfully', async () => {
    const res = await httpClient.post('/test', { data: 1 })
    expect(res).toEqual({ data: 'test' })
  })

  it('should throw error on non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: vi.fn().mockResolvedValue({ error: 'Not Found' })
    }) as any

    await expect(httpClient.get('/test')).rejects.toThrow()
  })

  it('should throw error when fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error')) as any

    await expect(httpClient.get('/test')).rejects.toThrow('Network error')
  })
})
