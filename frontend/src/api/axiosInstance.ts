import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

export default axiosInstance