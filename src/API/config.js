
import axios from "axios";
import {getStoredData} from "../utils/store";
import Globals from "../utils/Globals";
import {BASE_URL} from "./urls";

export const requestConfig = axios.interceptors.request.use(
    async (config) => {
        config.baseURL = BASE_URL;
        config.headers.common["Authorization"] = await getStoredData(Globals.kToken);
        // config.headers.contentType = "multipart/form-data";
        // config.headers.post["Content-Type"] = "multipart/form-data";
        config.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        return config;
    },
    error => Promise.reject(error)
);

export default axios.interceptors.response.use(response => {
    // Do something with response.data
    return response.data;
},
    // Do something with response error
    error => Promise.reject(error)
);