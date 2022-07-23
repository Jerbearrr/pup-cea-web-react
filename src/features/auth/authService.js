import Cookies from "js-cookie";
import { apiClient } from "./requests";
import { toast } from 'react-toastify';


const openbook = [];


// Register user
const register = async (userData) => {
  const response = await apiClient.post("/", userData)
  return response.data
}

// Login user
const login = async (userData) => {
  const response = await apiClient.post('/login', userData)

  if (response.data) {

    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 24 * 60 * 60 * 1000;
    now.setTime(expireTime);
    document.cookie = 'userpersist=true;expires=' + now.toUTCString() + ';path=/';
    //console.log(document.cookie);  // 'Wed, 31 Oct 2012 08:50:17 UTC'

  }
  
  
  return response.data
}

const delToken = async (refToken) => {
  await apiClient.post(`/deleteToken?findToken=${refToken}`)
}

const getuser = async () => {

  const response = await apiClient.get('/getuser')

  if (response.data) {

    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 24 * 60 * 60 * 1000;
    now.setTime(expireTime);
    document.cookie = 'userpersist=true;expires=' + now.toUTCString() + ';path=/';

    setTimeout(function () {
      delToken(response.data.refreshToken)
    }, 8000);
  }

  return response.data
}


const logoutuser = async () => {
  document.cookie = "userpersist=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  await apiClient.get('/logout', {
    withCredentials: true
  });

}


const ROLES = {
  ADMIN: "b521c",
  STUDENT: "4d3b",
};

const authService = {

  register,
  getuser,
  login,
  logoutuser,
  ROLES
}

export default authService