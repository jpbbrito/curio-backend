import axios from 'axios'

export async function getInfoByGeolocation (apiKey, latitude, longitude) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`

  try {
    const result = await axios({
      method: 'GET',
      url
    })
    console.log('[getInfoByGeolocation] result -', result)
    return result.data
  } catch (error) {
    console.log('[getInfoByGeolocation] error -', error)
    return 'error_api'
  }
}
