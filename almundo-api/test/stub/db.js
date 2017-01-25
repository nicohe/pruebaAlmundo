'use strict'

import fixtures from '../fixtures/'

export default class Db {
  connect () {
    return Promise.resolve(true)
  }

  disconnect () {
    return Promise.resolve(true)
  }

  getHotel (id) {
    return Promise.resolve(fixtures.getHotel())
  }

  getHotels () {
    return Promise.resolve(fixtures.getHotels())
  }

  saveHotel (image) {
    return Promise.resolve(fixtures.getHotel())
  }

}
