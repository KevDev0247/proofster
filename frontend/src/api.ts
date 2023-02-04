import axios from 'axios'

let baseURL = "http://localhost:5000/api";

export default axios.create({
    baseURL
});
