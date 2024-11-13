'use strict'

import { searchProducts } from './Product.js'
/**
 * Search bar
 */
L.Control.Search = L.Control.extend({
  onAdd: function () {
    this.container = L.DomUtil.create('div', 'rounded-start-5 rounded-end-5 px-3 py-2 position-absolut start-50 translate-middle-x shadow-sm w-75 searchBar')
    this.container.id = 'searchBar'
    this.container.innerHTML =
      '<div class="input-group d-flex" id="searchGroup">' +
      '<input id="searchBarInput" type="text" class="form-control border-0 p-0" placeholder="Was suchst du?" aria-label="Suchen" aria-describedby="addon-wrapping" autocomplete="off">' +
      '<svg xmlns="http://www.w3.org/2000/svg" height="22" width="21" viewBox="0 0 20 20" data-testid="main-search-input-search-btn" class="css-1n8vdy0">' +
      '<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>' +
      '</div>'
    return this.container
  }
})

export function addSearchBar (map) {
  new L.Control.Search({ position: 'topleft' }).addTo(map)

  const searchBarInput = document.getElementById('searchBarInput')
  searchBarInput.addEventListener('keyup', useSearchBar)
}

export function useSearchBar (e) {
  const inputValue = searchBarInput.value
  if (inputValue) {
    if (e.key === 'Enter') {
      sendSearchQuery(inputValue)
      return inputValue
    }
    expandSearchBar(inputValue)
  }
  return null
}

export function sendSearchQuery (query) {

}

const searchList = L.DomUtil.create('div', 'list-group list-group-flush pe-3')
searchList.id = 'searchList'

function expandSearchBar (inputValue) {
  const searchBar = document.getElementById('searchBar')
  searchList.innerHTML = '<p class="text-body-secondary m-2 ms-3 fw-semibold text-uppercase">Produkte</p>'

  for (const p of searchProducts(inputValue)) {
    searchList.innerHTML += '<button type="button" class="list-group-item list-group-item-action" onclick="sendSearchQuery(\'' + p.item.artikel + '\')">' + p.item.artikel + '</button>'
  }

  if (!document.getElementById('searchList')) {
    searchBar.appendChild(searchList)
  }
}
