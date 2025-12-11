import axios from "axios";

const instance = axios.create();

instance.interceptors.response.use((response) => {
        const {data, status} = response;
        if (status === 200) {
            return data;
        } else if (data) {
            return data;
        }
        return Promise.reject(response.data);
    }
)

export const getConfigJson = (path) => instance.get(path);
