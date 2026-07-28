const axios = require('axios')

/**
 * Axios instance configured for JSearch RapidAPI
 */
const jsearchClient = axios.create({
  baseURL: 'https://jsearch.p.rapidapi.com',
  headers: {
    'x-rapidapi-key': process.env.JSEARCH_API_KEY,
    'x-rapidapi-host': process.env.JSEARCH_API_HOST,
    'Content-Type': 'application/json',
  },
})

module.exports = jsearchClient
