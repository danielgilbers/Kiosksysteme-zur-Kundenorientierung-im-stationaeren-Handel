'use strict'

export class Product {
  constructor ({ artikel, nan, märkte }) {
    this.artikel = artikel
    this.nan = nan
    this.märkte = märkte
  }
}

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
