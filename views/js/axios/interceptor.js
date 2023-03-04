function i(Nid){return document.getElementById(Nid)}
function c(Nid){return document.getElementsByClassName(Nid)}
function t(Nid){return document.getElementsByTagName(Nid)}
function n(Nid){return document.getElementsByName(Nid)}
function q1(Nid){return document.querySelector(Nid)}
function qO(Nid){return document.querySelectorAll(Nid)}
// 提示訊息Modal初始化 ===============================================================
const hintModal = new bootstrap.Modal(i('hintModal'), {rootElement: document.body})
const waitHintModal = new bootstrap.Modal(i('waitModal'))

i('hintModal').addEventListener('hidden.bs.modal', e => {
  i("hintModalHead").innerHTML = ""
  i("hintModalBody").innerHTML = ""
    i("toDo").classList.add("hidden")
})

i('waitModal').addEventListener('hidden.bs.modal', e => {
  i("waitModalBody").innerHTML = ""
})

function waitModal(body){
  i("waitModalBody").innerHTML = body
  waitHintModal.show()
}

function waitModalClose(){
  i("waitModalClose").click()
  // waitHintModal.hide()
}
function valBtnSetModalShow(content){
  i("toDo").disabled=true
  i("toDo").classList.remove("hidden")
  i("toDo").innerHTML = content
  hintModal.show()
  i('hintModal').addEventListener('hidden.bs.modal', event => {
    i("toDo").classList.add("hidden")
  })
}
function afterClick(){
  i("toDo").disabled = true
  setTimeout(function() {
    i("toDo").disabled = false;
  }, 3000); // 1000 毫秒 = 1 秒
}
function toDoSet(content, func){
  i("toDo").classList.remove("hidden")
  i("toDo").innerHTML = content
  i('hintModal').addEventListener('hidden.bs.modal', event => {
    i("toDo").classList.add("hidden")
  })
}


function bodyToDoModal(body, toDoContent, func){
  i("hintModalHead").innerHTML = ""
  i("hintModalBody").innerHTML = body
  i("toDo").classList.remove("hidden")
  i("toDo").innerHTML = toDoContent
  i('hintModal').addEventListener('hidden.bs.modal', event => {
    i("toDo").classList.add("hidden")
  })
  i("toDo").addEventListener("click", function(){
      func()
  })
  hintModal.show()
}

function bodyModal(body){
  i("toDo").classList.add("hidden")
  i("hintModalHead").innerHTML = ""
  i("hintModalBody").innerHTML = body
  hintModal.show()
}

function headBodyModal(head,body){
  i("toDo").classList.add("hidden")
  i("hintModalHead").innerHTML = head
  i("hintModalBody").innerHTML = body
  hintModal.show()
}


// 提示訊息tooltipList初始化 ===============================================================
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// const exampleEl = document.getElementById('example')
// const tooltip = new bootstrap.Tooltip(exampleEl, options)

// 以下均為axios ====================================================================
const authAxios = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
  withCredentials: true,
  timeout: 30000,
})
const updateToken = (token) => {
    localStorage.setItem("accessToken", token)
    authAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

async function refreshToken(originalRequest) { // 給datatable ajax用
  try {
    const res = await authAxios.post('/auth/refresh');
    localStorage.setItem('accessToken', res.data.accessToken);
    originalRequest.headers.Authorization = 'Bearer ' + res.data.accessToken
    return axios(originalRequest)
  } catch (error) {
    console.error(error);
    removeToken()
    bodyModal(`<h5>${err.response.status}: 作業逾時或無相關使用授權，請重新登入</h5>`)
    i('hintModal').addEventListener('hidden.bs.modal', e => {
      window.location.href = '/admin/login'
    })
    return Promise.reject(error)
  }
}

const removeToken = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userInfo');
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
          console.log(message);
          bodyModal(`<h5>${error.response.status}: '資料格式不符<br/>'${message || '資料錯誤'}。</h5>`)
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
                return axios(originalRequest)
              }).catch((err) => {
                removeToken()
                bodyModal(`<h5>${err.response.status}: 作業逾時或無相關使用授權，請重新登入</h5>`)
                i('hintModal').addEventListener('hidden.bs.modal', e => {
                  window.location.href = '/admin/login'
                })
                return Promise.reject(error)
              })
          }
        }
        break

      case 403:
        bodyModal(`<h5>使用時間到，請重新登入</h5>`)
        removeToken()
        i('hintModal').addEventListener('hidden.bs.modal', e => {
          window.location.href = '/admin/login'
      })
        
        break

      case 404:
        console.log(`${error.response.status}: 資料來源不存在`)
        break

      case 422:
        bodyModal(`<h5>${error.response.status}: 帳號或密碼錯誤</h5>`)
        break

      case 500:
        bodyModal(`<h5>${error.response.status}: 內部系統發生錯誤</h5>`)
        i('hintModal').addEventListener('hidden.bs.modal', e => {
          location.reload()
      })
        break

      default:
        bodyModal(`<h5>${error.response.status}: 請重新登入</h5>`)
        i('hintModal').addEventListener('hidden.bs.modal', e => {
          window.location.href = '/admin/login'
      })
        break
    }
  } else {
    if (error.code === 'ECONNABORTED' && error.message && error.message.indexOf('timeout') !== -1){
        bodyModal('<h5>網路連線逾時</h5>')
        i('hintModal').addEventListener('hidden.bs.modal', e => {
          location.reload()
        })
    } else {
      bodyModal('<h5>網路連線不穩定，請稍候再試</h5>')
      i('hintModal').addEventListener('hidden.bs.modal', e => {
        location.reload()
      })
    }  
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
