const authAxios = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
  },
  withCredentials: true,
  timeout: 30000,
})
const updateToken = (token) => {
    window.localStorage.setItem("accessToken", token)
    authAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

const removeToken = () => {
  window.localStorage.removeItem('accessToken')
  authAxios.defaults.headers.common['Authorization'] = ''
};

authAxios.interceptors.request.use(async function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})

authAxios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        {
          const { message } = error.response.data
          console.log(`${error.response.status}: ${message || '資料錯誤'}。`)
        }
        break

      case 401:
        {
          const refreshTokeUrl = `/auth/refresh`
          if (error.config.url !== refreshTokeUrl) {
            const originalRequest = error.config
            return axios.post(refreshTokeUrl).then((res) => {
                localStorage.setItem("accessToken", res.data.accessToken)
                originalRequest.headers.Authorization = 'Bearer ' + res.data.accessToken
                console.log("重發")
                return axios(originalRequest)
              }).catch((err) => {
                localStorage.removeItem("accessToken")
                alert(`${err.response.status}: 作業逾時或無相關使用授權，請重新登入`)
                window.location.href = '/admin/login'
                return Promise.reject(error)
              })
          }
        }
        break

      case 403:
        alert("使用時間到，請重新登入")
        window.location.href = '/admin/login'
        break

      case 404:
        console.log(`${error.response.status}: 資料來源不存在`)
        break

      case 422:
        console.log(`${error.response.status}: 帳號或密碼錯誤`)
        break

      case 500:
        console.log(`${error.response.status}: 內部系統發生錯誤`)
        break

      default:
        alert(`${error.response.status}: 請重新登入`)
        break
    }
  } else {
    if (error.code === 'ECONNABORTED' && error.message && error.message.indexOf('timeout') !== -1)
    return alert('網路連線逾時')
    alert('網路連線不穩定，請稍候再試')
  }

  return Promise.reject(error)
})


/*
authAxios.interceptors.response.use(null, async (error) => {
  const { response } = error
  if (response && response.status === 401) {
    const refreshUrl = `/auth/refresh`
    if (error.config.url !== refreshUrl) {
      const originalRequest = error.config
      const resp = await axios.post(refreshUrl)
      const accessToken = resp.data.accessToken
      updateToken(accessToken)
      console.log("換好");
      return axios(originalRequest)
    }else{
      removeToken()
      window.location.href = '/admin/login'
    }
  }
})*/
