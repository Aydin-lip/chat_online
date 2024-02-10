import axios from 'axios'
import { toast } from 'react-toastify'
import Routes from '../routes/routes';

const httpService = axios.create({
  baseURL: "http://localhost:8080",
  // baseURL: "http://192.168.10.19:8080",
});

// httpService.interceptors.request.use(config => {
//   if (!config.url) {
//     return config;
//   }

//   let url = config.url
//   Object.entries(config.urlParams || {}).forEach(([k, v]) => {
//     url = url.replace(`:${k}`, encodeURIComponent(v));
//   });

//   return {
//     ...config,
//     url
//   };
// });

httpService.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status
    const statusCode = error?.statusCode

    if (status === 401) {
      localStorage.clear()
      toast.warning('You do not have the required access!')
      Routes.navigate('/sign-in')
    }
    if (statusCode === 500)
      toast.error('We have a problem pls try later!')

    return Promise.reject(error);
  });


export default httpService