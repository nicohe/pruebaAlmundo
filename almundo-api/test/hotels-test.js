'use strict'

import test from 'ava'
import micro from 'micro'
// import uuid from 'uuid-base62'
import listen from 'test-listen'
import request from 'request-promise'
import hotels from '../hotels'
import fixtures from './fixtures/'

test.beforeEach(async t => {
  let srv = micro(hotels)
  t.context.url = await listen(srv)
})

test('GET /:id', async t => {
  let hotel = fixtures.getHotel()
  let url = t.context.url

  let body = await request({ uri: `${url}/${hotel.publicId}`, json: true })
  t.deepEqual(body, hotel)
})

test('POST /', async t => {
  let hotel = fixtures.getHotel()
  let url = t.context.url

  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      name: hotel.name,
      stars: hotel.stars,
      price: hotel.price
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)
  t.is(response.statusCode, 201)
  t.deepEqual(response.body, hotel)
})

test('GET /list', async t => {
  let hotels = fixtures.getHotels()
  let url = t.context.url

  let options = {
    method: 'GET',
    uri: `${url}/list`,
    json: true
  }

  let body = await request(options)

  t.deepEqual(body, hotels)
})
