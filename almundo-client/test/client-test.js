'use strict'

const test = require('ava')
const nock = require('nock')
const almundo = require('../')
const fixtures = require('./fixtures')

let options = {
  endpoints: {
    hotels: 'http://almundo.test/hotel'
  }
}

test.beforeEach(t => {
  t.context.client = almundo.createClient(options)
})

test('client', t => {
  const client = t.context.client

  t.is(typeof client.getHotel, 'function')
  t.is(typeof client.listHotels, 'function')
  // t.is(typeof client.saveHotel, 'function')
})

test('getHotel', async t => {
  const client = t.context.client

  let hotel = fixtures.getHotel()

  nock(options.endpoints.hotels)
    .get(`/${hotel.publicId}`)
    .reply(200, hotel)

  let result = await client.getHotel(hotel.publicId)

  t.deepEqual(hotel, result)
})

test('saveHotel', async t => {
  const client = t.context.client

  let hotel = fixtures.getHotel()
  let newHotel = {
    name: hotel.name,
    stars: hotel.stars,
    price: hotel.price
  }

  nock(options.endpoints.hotels)
    .post(`/`, newHotel)
    .reply(201, hotel)

  let result = await client.saveHotel(newHotel)

  t.deepEqual(result, hotel)
})

test('listHotels', async t => {
  const client = t.context.client

  let hotels = fixtures.getHotels(5)

  nock(options.endpoints.hotels)
    .get('/list')
    .reply(200, hotels)

  let result = await client.listHotels()

  t.deepEqual(hotels, result)
})
