import axios from 'axios'

export default axios.create({
  baseURL: 'https://poker-board.herokuapp.com/api/v1/',
})
