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
    const { data: { userInfo } } = await authAPI.userInfo()
    const userInfoStr = JSON.stringify(userInfo)
    localStorage.setItem('userInfo', userInfoStr)
}

function localUserInfo(){
    return JSON.parse(localStorage.getItem('userInfo'))
}

async function navInfo(ID){
    const {authId, name} = await localUserInfo()
    if(ID==="navUser"){
        i("navUser").textContent = name
        if(authId.includes("All"))
        return qO(".nav_board_item").forEach(el=>{el.classList.remove("hidden")})
        // return qO("#n_train, #n_data, #n_auth").forEach(el=>{el.classList.remove("hidden")})
        if(authId.includes("public")){
            if (authId.length === 1){
                qO(".nav_board_item").forEach(el=>{el.classList.add("hidden")})
                i("n_checkIn").classList.remove("hidden")
            } else {
                i("n_checkIn").classList.remove("hidden")
            }
        }
    }
    if(ID==="boardUser"){
        i("boardUser").textContent = name
        if(authId.includes("All"))  
        return qO(".item").forEach(el=>{el.classList.remove("hidden")}) 
        if(authId.includes("public")){
            if (authId.length === 1){
                qO(".item").forEach(el=>{el.classList.add("hidden")})
                i("i_checkIn").classList.remove("hidden")
            }else{
                i("i_checkIn").classList.remove("hidden")
            }
        }
    }
}

function toPage(name){
    const path = name.split("_")[1]
    i(name).addEventListener("click", ()=>{
    location.href = "/admin/" + path
    qO(".nav_board_item").forEach(el=>{
        el.classList.remove("itemActive")
        el.getElementsByTagName("h6")[0].classList.remove("h6Active")
    })
    i("i"+path).classList.add("itemActive")
    i("i"+path).getElementsByTagName("h6")[0].classList.add("h6Active")
    })
}

function logout(elmentId){
    i(elmentId).addEventListener("click", async ()=>{
        const resp = await authAPI.logout()
        if (await resp.status===204) {
          removeToken()
          localStorage.clear()
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

