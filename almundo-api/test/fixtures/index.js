export default {
  getHotel () {
    return {
      id: '6a238b19-3ee3-4d5c-acb5-944a3c1fb407',
      publicId: '3ehqEZvwZByc6hjzgEZU5p',
      name: 'Hotel Emperador',
      stars: '3',
      price: '1596',
      createdAt: new Date().toString()
    }
  },
  getHotels () {
    return [
      this.getHotel(),
      this.getHotel(),
      this.getHotel()
    ]
  }
}
