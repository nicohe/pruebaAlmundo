'use strict'

const co = require('co')
const r = require('rethinkdb')
const Promise = require('bluebird')
const uuid = require('uuid-base62')

const defaults = {
  host: 'localhost',
  port: '28015',
  db: 'almundo'
}

class Db {

  constructor (options) {
    options = options || {}
    this.host = options.host || defaults.host
    this.port = options.port || defaults.port
    this.db = options.db || defaults.db
    this.connected = false
    this.setup = options.setup || false
  }

  connect (callback) {
    this.connection = r.connect({
      host: this.host,
      port: this.port
    })

    this.connected = true

    let db = this.db
    let connection = this.connection

    if (!this.setup) {
      return Promise.resolve(connection).asCallback(callback)
    }

    let setup = co.wrap(function * () {
      let conn = yield connection

      let dbList = yield r.dbList().run(conn)
      if (dbList.indexOf(db) === -1) {
        yield r.dbCreate(db).run(conn)
      }

      let dbTables = yield r.db(db).tableList().run(conn)
      if (dbTables.indexOf('hotels') === -1) {
        yield r.db(db).tableCreate('hotels').run(conn)
        yield r.db(db).table('hotels').indexCreate('createdAt').run(conn)
      }

      return conn
    })

    return Promise.resolve(setup()).asCallback(callback)
  }

  disconnect (callback) {
    if (!this.connected) {
      return Promise.reject(new Error('Not connected')).asCallback(callback)
    }

    this.connected = false

    return Promise.resolve(this.connection)
      .then((conn) => conn.close())
  }

  saveHotel (hotel, callback) {
    if (!this.connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback)
    }

    let connection = this.connection
    let db = this.db

    let tasks = co.wrap(function * () {
      let conn = yield connection
      hotel.createdAt = new Date()

      let result = yield r.db(db).table('hotels').insert(hotel).run(conn)

      if (result.errors > 0) {
        return Promise.reject(new Error(result.first_error))
      }

      hotel.id = result.generated_keys[0]

      yield r.db(db).table('hotels').get(hotel.id).update({
        publicId: uuid.encode(hotel.id)
      }).run(conn)

      let created = yield r.db(db).table('hotels').get(hotel.id).run(conn)

      return Promise.resolve(created)
    })

    return Promise.resolve(tasks()).asCallback(callback)
  }

  getHotel (id, callback) {
    if (!this.connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback)
    }

    let connection = this.connection
    let db = this.db
    let hotelId = uuid.decode(id)

    let tasks = co.wrap(function * () {
      let conn = yield connection

      let hotel = yield r.db(db).table('hotels').get(hotelId).run(conn)

      if (!hotel) {
        return Promise.reject(new Error(`image ${hotelId} not found`))
      }

      return Promise.resolve(hotel)
    })

    return Promise.resolve(tasks()).asCallback(callback)
  }

  getHotels (callback) {
    if (!this.connected) {
      return Promise.reject(new Error('not connected')).asCallback(callback)
    }

    let connection = this.connection
    let db = this.db

    let tasks = co.wrap(function * () {
      let conn = yield connection

      yield r.db(db).table('hotels').indexWait().run(conn)

      let images = yield r.db(db).table('hotels').orderBy({
        index: r.desc('createdAt')
      }).run(conn)

      let result = yield images.toArray()

      return Promise.resolve(result)
    })

    return Promise.resolve(tasks()).asCallback(callback)
  }

}

module.exports = Db
