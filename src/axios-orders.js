import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-my-burger-e7b05.firebaseio.com/',
});

export default instance;
