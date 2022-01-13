import axios from 'axios';

const instance = axios.create({
    baseURL: `http://130.211.254.99:4000`,
});

export default instance;