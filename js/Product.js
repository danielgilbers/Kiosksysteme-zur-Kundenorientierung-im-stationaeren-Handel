'use strict'

export default class Product {
  constructor ({ artikel, nan, märkte }) {
    this.artikel = artikel
    this.nan = nan
    this.märkte = märkte
  }
}

let products, fuse

export async function loadProducts () {
  const payload = []

  try {
    const JSON = await loadJSON('./map/products.json')
    JSON.forEach((element) => payload.push(new Product(element)))
    return payload
  } catch (error) {
    console.error('Fehler beim Laden der Produkte:', error)
    return error
  }
}

async function loadJSON (path) {
  try {
    const response = await fetch(path)
    return await response.json()
  } catch (error) {
    throw error
  }
}

export async function initializeSearch (url) {
  const Fuse = (await import(url)).default
  products = await loadProducts()
  fuse = new Fuse(products, {
    keys: ['artikel'],
    threshold: 0.3 // 0.0 = perfect match; 1.0 = no match at all
  })
}

export function searchProducts (searchQuery) {
  return fuse.search(searchQuery, { limit: 5 })
}
