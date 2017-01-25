'use strict'

const fixtures = {
  getHotel () {
    return {
      name: 'Hotel Emperador',
      stars: '3',
      price: '1596'
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
