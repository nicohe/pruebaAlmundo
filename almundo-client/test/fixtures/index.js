'use strict'

const uuid = require('uuid-base62')

const fixtures = {
  getHotel () {
    let id = uuid.uuid()
    return {
      name: 'Hotel Emperador',
      stars: '3',
      price: '1596',
      publicId: uuid.encode(id),
      id: id,
      createdAt: new Date().toString()
    }
  },
  getHotels (n) {
    let hotels = []
    while (n-- > 0) {
      hotels.push(this.getHotel())
    }

    return hotels
  }
}

module.exports = fixtures
