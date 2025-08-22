// import axios from "axios";

// const baseURL = process.env.NEXT_PUBLIC_API_URL || '';

// //creating an instance of axios with the baseURL
// // and withCredentials set to true
// const Axios = axios.create({
//     baseURL : baseURL,
//     withCredentials : true
// })

// //sending access token in the header
// Axios.interceptors.request.use(
//     async(config)=>{
//         const accessToken = localStorage.getItem('accesstoken')

//         if(accessToken){
//             config.headers.Authorization = `Bearer ${accessToken}`
//         }

//         return config
//     },
//     (error)=>{
//         return Promise.reject(error)
//     }
// )

// //extend the life span of access token with 
// // the help refresh
// Axios.interceptors.request.use(
//     (response)=>{
//         return response
//     },
//     async(error)=>{
//         let originRequest = error.config 

//         if(error.response.status === 401 && !originRequest.retry){
//             originRequest.retry = true

//             const refreshToken = localStorage.getItem("refreshToken")

//             if(refreshToken){
//                 const newAccessToken = await refreshAccessToken(refreshToken)

//                 if(newAccessToken){
//                     originRequest.headers.Authorization = `Bearer ${newAccessToken}`
//                     return Axios(originRequest)
//                 }
//             }
//         }
        
//         return Promise.reject(error)
//     }
// )


// const refreshAccessToken = async(refreshToken)=>{
//     try {
//         const response = await Axios({
//             ...SummaryApi.refreshToken,
//             headers : {
//                 Authorization : `Bearer ${refreshToken}`
//             }
//         })

//         const accessToken = response.data.data.accessToken
//         localStorage.setItem('accesstoken',accessToken)
//         return accessToken
//     } catch (error) {
//         console.log(error)
//     }
// }

// export default Axios



import axios from "axios";
import SummaryApi from "../common/SummaryApi";

const baseURL = process.env.NEXT_PUBLIC_API_URL || '';

// Creating an instance of axios with the baseURL
// and withCredentials set to true
const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

// Sending access token in the header
Axios.interceptors.request.use(
    async (config) => {
        // Only access localStorage on client side
        if (typeof window !== 'undefined') {
            const accessToken = localStorage.getItem('accesstoken');

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Extend the life span of access token with
// the help of refresh token
Axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Only run this on client side
        if (typeof window === 'undefined') {
            return Promise.reject(error);
        }

        let originRequest = error.config;

        if (error.response?.status === 401 && !originRequest.retry) {
            originRequest.retry = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                const newAccessToken = await refreshAccessToken(refreshToken);

                if (newAccessToken) {
                    originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return Axios(originRequest);
                }
            }
        }
        
        return Promise.reject(error);
    }
);

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await Axios({
            ...SummaryApi.refreshToken,
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        });

        const accessToken = response.data.data.accessToken;
        localStorage.setItem('accesstoken', accessToken);
        return accessToken;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default Axios;