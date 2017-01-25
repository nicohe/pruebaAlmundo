'use strict'

import { send, json } from 'micro'
import HttpHash from 'http-hash'
import Db from 'almundo-db'
import config from './config'
import DbStub from './test/stub/db'

const env = process.env.NODE_ENV || 'production'
let db = new Db(config.db)

if (env === 'test') {
  db = new DbStub()
}

const hash = HttpHash()

hash.set('GET /list', async function list (req, res, params) {
  await db.connect()
  let hotels = await db.getHotels()
  await db.disconnect()
  send(res, 200, hotels)
})

hash.set('GET /:id', async function getHotel (req, res, params) {
  let id = params.id
  await db.connect()
  let hotel = await db.getHotel(id)
  await db.disconnect()
  send(res, 200, hotel)
})

hash.set('POST /', async function (req, res, params) {
  let hotel = await json(req)
  await db.connect()
  let created = await db.saveHotel(hotel)
  await db.disconnect()
  send(res, 201, created)
})

export default async function main (req, res) {
  let { method, url } = req
  let match = hash.get(`${method.toUpperCase()} ${url}`)

  if (match.handler) {
    try {
      await match.handler(req, res, match.params)
    } catch (e) {
      send(res, 500, { error: e.message })
    }
  } else {
    send(res, 404, { error: 'route not found' })
  }
}
