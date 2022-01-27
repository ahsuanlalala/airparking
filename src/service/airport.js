import Api from './Api'

export default {
    // 登入
    login(info) {
        return Api().post('/userLogin', info)
    },
    //變更密碼
    password(id, info) {
        return Api().post(`/userPwd/${id}`, info)
    },
    // 車牌管理
    sPlate(ppid) {
        return Api().get(`/plate/${ppid}`)
    },
    cPlate(info) {
        return Api().post(`/plate`, info)
    },
    uPlate(plateId, info) {
        return Api().put(`/plate/${plateId}`, info)
    },
    dPlate(plateId, info) {
        return Api().delete(`/plate/${plateId}`, info)
    },
    sAllPlate(pInfo) {
        return Api().get(`/plate/all/${pInfo || ""}`)
    },

    // 月租管理
    sMember(type, info) {
        return Api().get(`/detail/${type}/${info || ""}`)
    },
    cMember(info) {
        return Api().post(`/`, info)
    },
    uMember(userId, info) {
        return Api().put(`/${userId}`, info)
    },
    dMember(userId) {
        return Api().delete(`/${userId}`)
    },
    // 帳號管理
    sAccMember(){
        return Api().get(`/login`)
    },
    cAccMember(info){
        return Api().post(`/login`,info)
    },
    uAccMember(memberId,info){
        return Api().put(`/login/${memberId}`,info)
    },
    dAccMember(memberId){
        return Api().delete(`/login/${memberId}`)
    },
    // 上傳
    uploadfile(info){
        return Api().post(`/upload`,info)
    }
}