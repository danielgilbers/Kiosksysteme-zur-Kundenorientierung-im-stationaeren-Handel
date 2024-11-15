'use strict'

export default class Product {
  constructor ({ artikel, nan, märkte }) {
    this.artikel = artikel
    this.nan = nan
    this.märkte = märkte
  }
}

let products, bausteine, fuse
const marktnummer = '3464'

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

export async function loadBausteine () {
  try {
    return await loadJSON('./map/bausteine.json')
  } catch (error) {
    console.error('Fehler beim Laden der Bausteine:', error)
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
  bausteine = await loadBausteine()
  fuse = new Fuse(products, {
    keys: ['artikel', 'märkte.marktnummer'],
    threshold: 0.3, // 0.0 = perfect match; 1.0 = no match at all
    useExtendedSearch: true
  })
}

export function searchProducts (searchQuery) {
  return fuse.search({
    $and: [{ artikel: searchQuery }, { 'märkte.marktnummer': `=${marktnummer}` }]
  }, { limit: 5 })
}

export function findPosition (product) {
  const target = product.märkte.find((element) => element.marktnummer === marktnummer).bausteine
  return bausteine[marktnummer][target]
}
