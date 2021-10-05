import decode from 'jwt-decode'
import axios from 'axios'

const AUTH_TOKEN_KEY = 'authToken'

export function loginUser(username, password) {
  console.log(`Getting token for ${username}`)
  return axios.post('/token', {
    username: username,
    password: password,
  }).then((res) => {
    console.log('response:' + res.data)
    setAuthToken(res.data)
  }).catch(err => console.log("Axios err: ", err))
}

export function logoutUser() {
  clearAuthToken()
}

export function setAuthToken(token) {
  console.log('Setting token: ' + token)
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  let sub = getTokenSub(token)
  console.log(`sub: ${sub}`)
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function clearAuthToken() {
  console.log('Clearing auth token')
  axios.defaults.headers.common['Authorization'] = ''
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function isLoggedIn() {
  let authToken = getAuthToken()
  let isLoggedIn = !!authToken && !isTokenExpired(authToken)
  console.log(`isLoggedIn: ${isLoggedIn}`)
  return isLoggedIn
}

export function getUserInfo() {
  if (isLoggedIn()) {
    return decode(getAuthToken())
  }
}

export function getUsername() {
  if (isLoggedIn()) {
    let token = decode(getAuthToken())
    if (!token.sub) {
      return null
    }

    return token.sub
  }
}

function getTokenSub(encodedToken) {
  let token = decode(encodedToken)
  if (!token.sub) {
    return null
  }

  return token.sub
}

function getTokenExpirationDate(encodedToken) {
  let token = decode(encodedToken)
  if (!token.exp) {
    return null
  }

  let date = new Date(0)
  date.setUTCSeconds(token.exp)

  return date
}

function isTokenExpired(token) {
  let expirationDate = getTokenExpirationDate(token)
  return expirationDate < new Date()
}