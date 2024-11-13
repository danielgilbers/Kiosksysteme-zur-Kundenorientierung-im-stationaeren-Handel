'use strict'

export default class Product {
  constructor ({ artikel, nan, märkte }) {
    this.artikel = artikel
    this.nan = nan
    this.märkte = märkte
  }
}

let Fuse, products, fuse

export async function loadProducts () {
  const payload = []

  try {
    const response = await fetch('./map/products.json')
    const jsonFeature = await response.json()
    jsonFeature.forEach((element) => payload.push(new Product(element)))
    return payload
  } catch (error) {
    console.error('Fehler beim Laden der Produkte:', error)
    return error
  }
}

export async function initializeSearch () {
  if (!Fuse) {
    // Prüfe, ob Jest verwendet wird
    if (typeof process !== 'undefined' && process.env.JEST_WORKER_ID !== undefined) {
      // Lokaler Import für Jest
      Fuse = (await import('fuse.js')).default
    } else {
      // Dynamischer Import für den Browser
      Fuse = (await import('https://unpkg.com/fuse.js@7.0.0/dist/fuse.basic.min.mjs')).default
    }
  }
  products = await loadProducts()
  fuse = new Fuse(products, {
    keys: ['artikel'],
    threshold: 0.3 // 0.0 = perfect match; 1.0 = no match at all
  })
}

export function searchProducts (searchQuery) {
  return fuse.search(searchQuery, { limit: 5 })
}
