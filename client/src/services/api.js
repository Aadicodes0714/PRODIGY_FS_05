import axios from "axios";

const API = axios.create({
    baseURL: "https://prodigy-fs-05-9gjz.onrender.com/api"
});

export default API;