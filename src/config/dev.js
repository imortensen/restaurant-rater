export const config = {
  secrets: {
    jwt: 'thisisfun',
    issuer: 'restaurant-rater',
    audience: 'restuarant-rater'
  },
  dbUrl: 'mongodb://localhost:27017/restaurant-rater',
  seed: true
}
