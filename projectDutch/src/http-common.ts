import axios from "axios";

const process = import.meta.env

export default axios.create({
    baseURL: process.VITE_SERVER,
    headers: {
        "Content-type": "application/json"
    }
});