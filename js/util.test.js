// loadJSON.test.js
import { loadJSON } from './util'

describe('loadJSON', () => {
  beforeEach(() => {
    // Mocking fetch für jeden Test
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return parsed JSON when fetch is successful', async () => {
    // Arrange: Erfolgreiches fetch-Szenario
    const mockResponse = { name: 'Test' }
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse)
    })

    // Act
    const result = await loadJSON('/path/to/json')

    // Assert
    expect(result).toEqual(mockResponse)
    expect(global.fetch).toHaveBeenCalledWith('/path/to/json')
  })

  it('should throw an error when fetch fails', async () => {
    // Arrange: Fehlerhaftes fetch-Szenario
    const mockError = new Error('Fetch failed')
    global.fetch.mockRejectedValue(mockError)

    // Act & Assert
    await expect(loadJSON('/invalid/path')).rejects.toThrow('Fetch failed')
    expect(global.fetch).toHaveBeenCalledWith('/invalid/path')
  })
})
