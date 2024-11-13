'use strict'

import 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
import { initializeMap } from './map.js'
import { addSearchBar } from './searchBar.js'
import { initializeSearch } from './Product.js'

const map = initializeMap()

await initializeSearch()

addSearchBar(map)
