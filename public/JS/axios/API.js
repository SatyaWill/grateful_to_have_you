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
  search(data) {
    return authAxios.post("/vol/info", data, commonHeaders)
  },
}
