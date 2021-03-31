import axios from 'redaxios'

const http = axios.create({
  withCredentials: true
})
export default http
