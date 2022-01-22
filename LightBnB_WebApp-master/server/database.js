const { Pool } = require('pg');
const pool = new Pool;
const db = require('../db/index.js')


const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {

  db.query(`SELECT * FROM users WHERE email = $1`, email)
    .then((res) => {
      return res.rows[0];
    });

}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  db.query(`SELECT * FROM users WHERE id = $1`, id)
    .then((res) => {
      return res.rows[0];
    });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  db.query(`INSERT INTO users ('name','password','email') VALUES ($1,$2,$3);`, [user.name,user.password,user.email])
    .then((res) => {
      return res.rows[0];
    });

}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  db.query(`SELECT * 
  FROM reservations 
  WHERE guest_id = $1
  WHERE start_date <> DATE(NOW());
  LIMIT $2`, [guest_id, limit])
  .then((res) => {
    return res.rows[0];
  });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {

  const getAllProperties = function (options, limit = 10) {
    // 1
    const queryParams = [];
    // 2
    let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;
  
    // 3
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `WHERE city LIKE $${queryParams.length} `;
    }
  
    // 4
    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  
    // 5
    console.log(queryString, queryParams);
  
    // 6
    return pool.query(queryString, queryParams).then((res) => res.rows);
  };
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {

  db.query(`INSERT INTO properties
  (owner_id ,
    title,
    description ,
    thumbnail_photo_url ,
    cover_photo_url ,
    cost_per_night ,
    street ,
    city ,
    province ,
    post_code ,
    country ,
    parking_spaces ,
    number_of_bathrooms ,
    number_of_bedrooms 
  ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
  [property.owner_id ,
    property.title,
    property.description ,
    property.thumbnail_photo_url ,
    property.cover_photo_url ,
    property.cost_per_night ,
    property.street ,
    property.city ,
    property.province ,
    property.post_code ,
    property.country ,
    property.parking_spaces ,
    property.number_of_bathrooms ,
    property.number_of_bedrooms ]
  )};

  return Promise.resolve(property);
}
exports.addProperty = addProperty;
