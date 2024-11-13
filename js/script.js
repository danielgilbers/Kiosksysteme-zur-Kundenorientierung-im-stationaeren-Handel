'use strict'

import 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
import { initializeMap } from './map.js'
import { addSearchBar } from './searchBar.js'
import { initializeSearch } from './Product.js'

const fuseURL = 'https://unpkg.com/fuse.js@7.0.0/dist/fuse.basic.min.mjs'

const map = initializeMap()

await initializeSearch(fuseURL)

addSearchBar(map)
