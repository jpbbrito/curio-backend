import axios from 'axios'

export async function getInfoByGeolocation (apiKey, latitude, longitude) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`

  const result = await axios({
    method: 'GET',
    url
  })
  return result
}
