import axios from 'axios'

const httpService = axios.create({
  baseURL: "http://192.168.10.19:8080",
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

// httpService.interceptors.response.use(
//   response => response,
//   error => {
//     const status = error?.response?.status
//     const statusCode = error?.statusCode

//     if (status === 401) {
//       localStorage.removeItem('token')
//       localStorage.removeItem('access-token')
//       location.pathname = '/'
//     }
//     if (statusCode === 500)
//       toast.error('مشکلی پیش آمده لطفا بعدا دوباره امتحان نمایید!')

//     return Promise.reject(error);
//   });


export default httpService