import axios from 'axios'

export default axios.create({
  baseURL: 'https://poker-board-api.onrender.com/api/v1/',
})
