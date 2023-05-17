import axios from 'axios'

export default axios.create({
  baseURL: `${process.env.BASE_DOMAIN}/api/v1/`,
})
