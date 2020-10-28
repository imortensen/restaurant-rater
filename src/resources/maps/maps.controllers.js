import { Client } from '@googlemaps/google-maps-services-js'
import config from '../../config'

const client = new Client({})
const key = config.secrets.gmapsKey

export const getElevation = async (req, res) => {
  try {
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
  try {
    client
      .findPlaceFromText({
        params: {
          input: 'Mongolian Grill',
          inputtype: 'textquery',
          fields: [
            'photos',
            'formatted_address',
            'name',
            'opening_hours',
            'rating'
          ],
          locationbias: 'circle:2000@47.6918452,-122.2226413',
          key: key
        },
        timeout: 1000
      })
      // .elevation({
      //   params: {
      //     locations: [{ lat: 45, lng: -110 }],
      //     key: key
      //   },
      //   timeout: 1000 // milliseconds
      // })
      .then(r => {
        // console.log('Elevation: ' + r.data.results[0].elevation)
        console.log('test 1')
        res.json(r.data)
      })
      .catch(e => {
        console.log('test 2')
        console.log('error: ' + e.response.data)
      })
  } catch (e) {
    console.log(e)
    res.status(400).end()
  }
}
