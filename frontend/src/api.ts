import axios from 'axios'

let baseURL = "localhost:5000";

export default axios.create({
    baseURL
});