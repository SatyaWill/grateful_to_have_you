const commonHeaders = {
  headers:{
  "Content-Type": "application/json",
  Accept: "application/json"
  }
}

const authAPI = {
  login(id, password) {
      return axios.put("/auth", {"id":id, "password":password}, commonHeaders)
  },
  logout() {
    return authAxios.delete("/auth")
  },
  userInfo() {
    return authAxios.get("/auth/userInfo")
  }
}
const infoAPI = {
  // search(data) {return authAxios.post("/vol/info", data, commonHeaders)},
  volId(data) {
    return authAxios.post("/vol/volId", data, commonHeaders)
  },
  picUrl(folderName) {
    return authAxios.get("/vol/picUrl", { params: folderName})
  },
  // 上傳至S3
  uploadPic(url, file) {
    const headers = {
        "Content-Type": "multipart/form-data"
    }
    return axios.put(url, file, headers)
  },
  newVol(data) {
    return authAxios.post("/vol/newVol", data, commonHeaders)
  },
  editPage(volId) {
    return authAxios.post("/vol/editPage/"+volId, commonHeaders)
  },
  editVol(data) {
    return authAxios.patch("/vol/editVol", data, commonHeaders)
  },
  intoGroup(data) {
    return authAxios.patch("/vol/intoGroup", data, commonHeaders)
  }
}

