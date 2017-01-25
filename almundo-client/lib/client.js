'use strict'

const request = require('request-promise')
const Promise = require('bluebird')

class Client {
  constructor (options) {
    this.options = options
  }

  getHotel (id, callback) {
    let opts = {
      method: 'GET',
      uri: `${this.options.endpoints.hotels}/${id}`,
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(callback)
  }

  saveHotel (hotel, callback) {
    let opts = {
      method: 'POST',
      uri: `${this.options.endpoints.hotels}/`,
      body: hotel,
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(callback)
  }

  listHotels (callback) {
    let opts = {
      method: 'GET',
      uri: `${this.options.endpoints.hotels}/list`,
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(callback)
  }

  // getPicture (id, callback) {
  //   let opts = {
  //     method: 'GET',
  //     uri: `${this.options.endpoints.pictures}/${id}`,
  //     json: true
  //   }
  //
  //   return Promise.resolve(request(opts)).asCallback(callback)
  // }
  //
  // listPictures (callback) {
  //   let opts = {
  //     method: 'GET',
  //     uri: `${this.options.endpoints.pictures}/list`,
  //     json: true
  //   }
  //
  //   return Promise.resolve(request(opts)).asCallback(callback)
  // }

}

module.exports = Client
