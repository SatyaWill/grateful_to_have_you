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
  },
  newAgent(data) {
    return authAxios.post("/auth/agent", data, commonHeaders)
  },
  editAgent(data) {
    return authAxios.patch("/auth/agent", data, commonHeaders)
  },
  editAgentAuth(data) {
    return authAxios.patch("/auth/agentAuth", data, commonHeaders)
  },
  editPassword(data) {
    return authAxios.patch("/auth/password", data, commonHeaders)
  }
}

const infoAPI = {
  // search(data) {return authAxios.post("/vol/info", data, commonHeaders)},
  volId(data) {
    return authAxios.post("/vol/volId", data, commonHeaders)
  },
  picUrl(folderName) {
    return authAxios.get("/vol/picUrl", {params: folderName})
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

const hoursAPI = { 
  newCriteria(data) {
    return authAxios.post("/vol/hourCriteria", data, commonHeaders)
  },
  editCriteria(data) {
    return authAxios.patch("/vol/hourCriteria", data, commonHeaders)
  },
  checkinType(volId) {
     return authAxios.get("/vol/checkin/"+volId)
  },
  checkinStart(data) {
    return authAxios.post("/vol/checkin", data, commonHeaders)
  },
  checkinEnd(data) {
    return authAxios.patch("/vol/checkin", data, commonHeaders)
  },
  hourAuditCount(isOver, month) {
    return authAxios.get(`/vol/hourAuditCount/${isOver}/${month}`, commonHeaders)
  },
  hourAudit(type, data) {
    return authAxios.patch("/vol/hourAudit/"+type, data, commonHeaders)
  },
  toRecords(data) {
    return authAxios.post("/vol/hourRecords", data, commonHeaders)
  },
}