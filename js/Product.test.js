/**
 * @jest-environment jsdom
 */

'use strict'

import Product, { initializeSearch, loadProducts, searchProducts } from './Product'
import mockData from '../map/products.json'

global.fetch = jest.fn()
  .mockRejectedValueOnce(new Error('Async error message'))
  .mockResolvedValue({
    json: () => Promise.resolve(mockData)
  })

describe('Unittest F8: Poduktklasse', () => {
  test('Produktklasse Constructor', () => {
    const testProduct = {
      artikel: 'Gliedermaßstab Holz 2 m',
      nan: '1200001',
      märkte: [
        {
          marktnummer: '3464',
          bausteine: ['4914.01B.0001']
        },
        {
          marktnummer: '5821',
          bausteine: ['4914.01B.0001']
        },
        {
          marktnummer: '7743',
          bausteine: ['4914.01B.0002']
        }
      ]
    }
    const product = new Product(testProduct)

    expect(product).toBeInstanceOf(Product)
    expect(product).toMatchObject(testProduct)
  })

  test('Produkt JSON laden Error', async () => {
    const data = await loadProducts()
    expect(data).toBeInstanceOf(Error)
  })

  test('Produkt JSON laden', async () => {
    const data = await loadProducts()
    expect(data).toBeInstanceOf(Array)
    expect(data[0]).toBeInstanceOf(Product)
  })

  test('Produktsuche', async () => {
    const data = await loadProducts()
    const searchQuery = 'Gliedermaßstab'
    await initializeSearch()
    const search = await searchProducts(searchQuery)
    expect(search).toBeInstanceOf(Array)
  })
})
