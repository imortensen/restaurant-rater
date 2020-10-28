import { User } from '../resources/user/user.model'
import { Review } from '../resources/review/review.model'
import { Restaurant } from '../resources/restaurant/restaurant.model'
import { _ } from 'lodash'
import { model } from 'mongoose'

var users = [
  {
    username: 'MichaelScott',
    email: 'bestboss@dundermifflin.com',
    password: '12345'
  },
  {
    username: 'DwightSchrute',
    email: 'dwightschrute@dundermifflin.com',
    password: '12345'
  },
  {
    username: 'JimHalpert',
    email: 'jim.halpert@dundermifflin.com',
    password: '12345'
  }
]

var restaurants = [
  {
    name: 'Cafe Rio',
    vicinity: '9320 Village Shop Dr, Sandy',
    place_id: 'ChIJJSdO4v2HUocRRZq7qE00h2k'
  },
  {
    name: 'Five Guys',
    vicinity: '1082 East, Fort Union Blvd, Midvale',
    place_id: 'ChIJ4efx09SJUocRHYzDu2c9nU0'
  },
  {
    name: 'Waffle Love',
    vicinity: '1142 Fort Union Blvd, Midvale',
    place_id: 'ChIJtywYKyuIUocRqDMZ8KRf1aM'
  },
  {
    name: 'Chipotle',
    vicinity: '6924 S Park Centre Dr, Cottonwood Heights',
    place_id: 'ChIJrySuroBiUocRlqs_5a6Ilx8'
  },
  {
    name: 'Saigon Sandwich',
    vicinity: '8528 1300 E, Sandy',
    place_id: 'ChIJzbEq0KdiUocRr79__g7SzLQ'
  },
  {
    name: 'Fratelli Ristorante',
    vicinity: '8612 1300 E, Sandy',
    place_id: 'ChIJf0at_P2HUocROAafSqI6Ov8'
  },
  {
    name: 'Mandarin Garden',
    vicinity: '8627 Highland Dr, Sandy',
    place_id: 'ChIJbyKHE8piUocReaKJM_tBM9Q'
  },
  {
    name: 'Café Zupas',
    vicinity: '9242 Village Shop Dr, Sandy',
    place_id: 'ChIJVaZm4v2HUocR22Ie6p0r94k'
  }
]

// var cafeRio = { name: 'Cafe Rio' }
// var fiveGuys = { name: 'Five Guys' }
// var waffleLove = { name: 'Waffle Love' }

var cafeRioReviews = [
  { comment: 'Pulled pork salads and burritos are the best.', stars: '5' },
  {
    comment: 'Fast service. Thanks for the free nino quesadillas!',
    stars: '5'
  },
  {
    comment: 'Good food. Could be a little better.',
    stars: '4'
  }
]

var fiveGuysReviews = [
  {
    comment:
      'My favorite burgers. You leave feeling good. Meat is high quality.',
    stars: '5'
  },
  {
    comment: 'Good but there are better burgers out there.',
    stars: '4'
  },
  {
    comment: 'I love to eat the peanuts while waiting. Love the fries.',
    stars: '5'
  }
]

var waffeLovereviews = [
  {
    comment: 'Portions and plates are too small but the food is very good.',
    stars: '4'
  },
  { comment: 'Good value', stars: '4' },
  { comment: 'Not too impressed', stars: '3' }
]

var createDoc = (Model, doc) => {
  return new Promise((resolve, reject) => {
    new Model(doc).save((err, saved) => {
      return err ? reject(err) : resolve(saved)
    })
  })
}

var cleanDB = function() {
  console.log('... cleaning the DB')
  var cleanPromises = [User, Restaurant, Review].map(function(model) {
    return model.remove().exec()
  })
  return Promise.all(cleanPromises)
}

var createUsers = data => {
  var promises = users.map(user => {
    return createDoc(User, user)
  })
  return Promise.all(promises).then(users => {
    return _.merge({ users: users }, data || {})
  })
}

var createRestaurants = data => {
  var promises = restaurants.map(restaurant => {
    return createDoc(Restaurant, restaurant)
  })
  return Promise.all(promises).then(restaurants => {
    return _.merge({ restaurants: restaurants }, data || {})
  })
}

var createReviews = (reviewList, num, data) => {
  var addRestaurant = (review, restaurant) => {
    review.restaurant = restaurant

    return new Promise((resolve, reject) => {
      review.save((err, saved) => {
        return err ? reject(err) : resolve(saved)
      })
    })
  }

  var newReviews = reviewList.map((review, i) => {
    review.createdBy = data.users[i]._id
    review.restaurant = data.restaurants[num]._id
    return createDoc(Review, review)
  })

  return (
    Promise.all(newReviews)
      // .then(savedReviews => {
      //   return Promise.all(
      //     savedReviews.map((review, i) => {
      //       return addRestaurant(review, data.restaurants[num]._id)
      //     })
      //   )
      // })
      .then(() => {
        return data
      })
  )
}

cleanDB()
  .then(createUsers)
  .then(createRestaurants)
  .then(createReviews.bind(null, cafeRioReviews, 0))
  .then(createReviews.bind(null, fiveGuysReviews, 1))
  .then(createReviews.bind(null, waffeLovereviews, 2))
  .catch('Error: ')
