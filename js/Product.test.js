/**
 * @jest-environment jsdom
 */

'use strict'

import Product, { initializeSearch, loadProducts, loadBausteine, searchProducts } from './Product'
import mockProducts from '../map/products.json'
import mockBausteine from '../map/bausteine.json'

describe('Unittest F8: Poduktklasse', () => {
  // Globales Setup für Fetch-Mocks
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('Produktinstanz erstellen', () => {
    const testProduct = {
      artikel: 'Gliedermaßstab Holz 2 m',
      nan: '1200001',
      märkte: [
        { marktnummer: '3464', bausteine: ['4914.01B.0001'] },
        { marktnummer: '5821', bausteine: ['4914.01B.0001'] },
        { marktnummer: '7743', bausteine: ['4914.01B.0002'] }
      ]
    }

    const product = new Product(testProduct)

    expect(product).toBeInstanceOf(Product)
    expect(product).toMatchObject(testProduct)
  })

  test('Produkt JSON laden Error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Async error message'))

    await expect(loadProducts()).rejects.toThrow('Async error message')
  })

  test('Bausteine JSON laden Error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Async error message'))

    await expect(loadBausteine()).rejects.toThrow('Async error message')
  })

  test('Produkt JSON laden', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockProducts)
    })

    const data = await loadProducts()
    expect(data).toBeInstanceOf(Array)
    expect(data[0]).toBeInstanceOf(Product)
  })

  test('Baustein JSON laden', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockBausteine)
    })

    const data = await loadBausteine()
    expect(data).toBeInstanceOf(Object)
    expect(Object.keys(data).length).toBeGreaterThan(0)
  })

  test('Produktsuche', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('products')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockProducts)
        })
      } else if (url.includes('bausteine')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockBausteine)
        })
      }
    }
    )

    await initializeSearch('fuse.js')
    const searchQuery = 'Gliedermaßstab'
    const searchResults = await searchProducts(searchQuery)

    expect(searchResults).toBeInstanceOf(Array)
    expect(searchResults.length).toBeGreaterThan(0)
  })
})
