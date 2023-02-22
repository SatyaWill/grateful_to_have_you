let userInfo = {}
function disabled(ID){
    i(ID).setAttribute('disabled', true)
    $("#"+ID).prop('checked', false)
}
function abled(ID){
    return i(ID).removeAttribute('disabled')
}

function haveToken(){
    window.addEventListener("load", function() {
        if (!localStorage.getItem("accessToken")) return location.href = "/admin/login"
    })
}

async function getUserInfo(){
    const resp = await authAPI.userInfo()
    const res = await resp.data
    // 將userInfo轉換為JSON字符串
    const userInfoStr = JSON.stringify(res.userInfo)
    // 將userInfo存儲在localstorage中
    localStorage.setItem('userInfo', userInfoStr)
    return userInfo = res.userInfo
}

async function navInfo(ID){
    await getUserInfo()
    const authId = userInfo.auth_id
    if(ID==="navUser"){
        i("navUser").textContent = userInfo.name
        if(authId.includes("All"))
        return qO("#n_train, #n_auth").forEach(el=>{el.classList.remove("hidden")})
        // return qO("#n_train, #n_data, #n_auth").forEach(el=>{el.classList.remove("hidden")})
        if(authId.includes("public"))
        return i("leftWrapper").innerHTML = `
        <div class="nav_board_item" id="n_ckeckIn"><h4>簽到簽退</h4></div>`
    }
    if(ID==="boardUser"){
        i("boardUser").textContent = userInfo.name
        if(authId.includes("All"))  
        return qO("#i_train, #i_data, #i_auth").forEach(el=>{el.classList.remove("hidden")}) 
        if(authId.includes("public")) 
        return i("boardWrapper").innerHTML = `<div class="item" id="i_checkIn">簽到簽退</div>`
    }
}

function toPage(name){
    i(name).addEventListener("click", ()=>{
      return location.href = "/admin/" + name.split("_")[1]
    })
}

function logout(elmentId){
    i(elmentId).addEventListener("click", async ()=>{
        const resp = await authAPI.logout()
        if (await resp.status===204) {
          removeToken()
          location.href = "/admin/login"
        }
    })
}

function invalidHint(id, required, rule, hintId=false, hintContent=false){
    if (!required && !i(id).value){
        i(id).classList.remove("is-invalid")
        return true
    }else{
        if (!rule || !rule.test(i(id).value)) {
            i(id).classList.add("is-invalid")
            if(!hintId && !hintContent) return
            i(hintId).innerHTML = hintContent
            return false
        } else {
            i(id).classList.remove("is-invalid")
            return true
        }
    }
}

