'use strict'

const test = require('ava')
const uuid = require('uuid-base62')
const r = require('rethinkdb')
const Db = require('../')
const fixtures = require('./fixtures')

test.beforeEach('setup database', async t => {
  const dbName = `almundo_${uuid.v4()}`
  const db = new Db({ db: dbName, setup: true })
  await db.connect()
  t.context.db = db
  t.context.dbName = dbName
  t.true(db.connected, 'should be connected')
})

test.afterEach.always('cleanup database', async t => {
  let db = t.context.db
  let dbName = t.context.dbName

  await db.disconnect()
  t.false(db.connected, 'should be disconnected')

  let conn = await r.connect({})
  await r.dbDrop(dbName).run(conn)
})

test('save hotel', async t => {
  let db = t.context.db

  t.is(typeof db.saveHotel, 'function', 'saveHotel is a function')

  let hotel = fixtures.getHotel()

  let created = await db.saveHotel(hotel)
  t.is(created.name, hotel.name)
  t.is(created.stars, hotel.stars)
  t.is(created.price, hotel.price)
  t.is(created.publicId, uuid.encode(hotel.id))
  t.is(typeof created.id, 'string')
  t.truthy(created.createdAt)
})

test('get hotel', async t => {
  let db = t.context.db

  t.is(typeof db.getHotel, 'function', 'getHotel is a function')

  let hotel = fixtures.getHotel()

  let created = await db.saveHotel(hotel)
  let result = await db.getHotel(created.publicId)

  t.deepEqual(created, result)
  t.throws(db.getHotel('asd'), /not found/)
})

test('list all hotels', async t => {
  let db = t.context.db

  t.is(typeof db.getHotel, 'function', 'getHotel is a function')

  let hotels = fixtures.getHotels(5)
  let saveHotels = hotels.map(hotel => db.saveHotel(hotel))
  let created = await Promise.all(saveHotels)
  let result = await db.getHotels()

  t.is(created.length, result.length)
})
