
import { apiClient } from "../auth/requests";

const tokenRefresher = () => {
  

    const refresh = async () => {
      
        const response =   await apiClient.get('/getuser')
      
        return response.accessToken;
    }
    return refresh;
};

export default tokenRefresher;