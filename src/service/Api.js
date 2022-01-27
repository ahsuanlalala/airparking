import axios from 'axios'

export default () => {
    let createData = {}
    let headerId = localStorage.getItem("id")

    if (headerId) {
        createData = {
            baseURL: '127.0.0.1/air', headers: { userId: headerId }
        }
    } else {
        createData = {
            baseURL: '127.0.0.1/air'
        }
    }
return axios.create(createData)
}