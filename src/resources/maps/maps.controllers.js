import { Client } from '@googlemaps/google-maps-services-js'
import config from '../../config'

const client = new Client({})
const key = config.secrets.gmapsKey

export const getElevation = async (req, res) => {
  try {
    console.log('key: ' + key)
    client
      .elevation({
        params: {
          locations: [{ lat: 45, lng: -110 }],
          key: key
        },
        timeout: 1000 // milliseconds
      })
      .then(r => {
        console.log('Elevation: ' + r.data.results[0].elevation)
        res.json(r.data)
      })
      .catch(e => {
        console.log(e.response.data.error_message)
      })
  } catch (e) {
    console.log(e)
    res.status(400).end()
  }
}

export const getRestaurants = async (req, res) => {
  const keyword = req.query.keyword
  try {
    client
      .placesNearby({
        params: {
          // fields: [
          //   'photos',
          //   'formatted_address',
          //   'name',
          //   'opening_hours',
          //   'rating'
          // ],
          keyword: keyword,
          location: '40.5982188,-111.8479408',
          radius: 3000,
          type: 'restaurant',
          key: key
        },
        timeout: 1000
      })
      .then(r => {
        let restaurants = r.data.results
        res.json(restaurants)
      })
      .catch(e => {
        console.log('error: ' + e)
      })
  } catch (e) {
    console.log(e)
    res.status(400).end()
  }
}
