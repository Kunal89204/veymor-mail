import axiosInstance from "./axiosInstance";

const BASE_URL = '/auth'

const authQuery = {
    login: async (body: { email: string, password: string }) => {
        const response = await axiosInstance.post(`${BASE_URL}/login`, body)
        return response.data
    },
    register: async (body: { firstName: string, lastName: string, email: string, password: string }) => {
        const response = await axiosInstance.post(`${BASE_URL}/register`, body)
        return response.data
    },
    logout: async () => {
        const response = await axiosInstance.post(`${BASE_URL}/logout`)
        return response.data
    },
    me: async () => {
        const response = await axiosInstance.get(`${BASE_URL}/me`)
        return response.data
    }
}

export default authQuery