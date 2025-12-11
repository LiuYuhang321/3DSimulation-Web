import axios from "axios";

const instance = axios.create();
instance.interceptors.response.use((response) => {
    const { data, status } = response;
    if (status === 200) {
        if(data.code === 1){
            return data.data;
        }else{
            return data;
        }
    }else if(data){
        return data;
    }
    return Promise.reject(response.data);
});
//状态码校验
export default instance;
