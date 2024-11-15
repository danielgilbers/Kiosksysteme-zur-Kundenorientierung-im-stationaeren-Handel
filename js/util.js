'use strict'

export async function loadJSON (path) {
  try {
    const response = await fetch(path)
    return await response.json()
  } catch (error) {
    throw error
  }
}
