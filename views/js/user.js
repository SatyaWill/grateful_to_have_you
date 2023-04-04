i("editPW").addEventListener("click", function(){
    i("hintModalHead").innerHTML = `修改密碼`
    i("hintModalBody").innerHTML = `
    <form class="auditForm col-row-auto" id="editForm">
        <div class="form-floating col">
            <input type="password" class="form-control" id="old_pw" name="old_pw" placeholder="舊密碼">
            <label for="old_pw">請輸入舊密碼</label>
        </div>
        <div class="form-floating col">
            <input type="password" class="form-control" id="new_pw" name="new_pw" placeholder="新密碼">
            <label for="new_pw">請輸入新密碼</label>
        </div>
    </form>
    <div id="hintTemp"></div>
    <div class="invalid-feedback" id="hintMsg">資料未填寫完整</div>`
    hintModal.show()
    toDoSet("確定修改", async function(){
        const old_pw = i("old_pw").value
        const new_pw = i("new_pw").value
        const isSame = old_pw === new_pw 
        const invalid = !/^[^\s]{3,30}$/.test(new_pw)
        const msg = isSame ? "新密碼不可跟舊密碼一樣" : "密碼需3字以上" 
        const data = { old_pw, new_pw }
        if ( isSame || invalid ) {
            i("hintTemp").classList.add("is-invalid")
            i("hintMsg").innerHTML = msg
        } else {
            i("hintTemp").classList.remove("is-invalid")
            try{
                const resp = await authAPI.editPassword(data)
                const res = resp.data
                if (resp.status===200 & res.message==="ok"){
                    headBodyModal("密碼修改成功",'<h5>請重新登入。</h5>')
                    i('hintModal').addEventListener('hidden.bs.modal', e => {
                        removeToken()
                        window.location.href = '/admin/login'
                      })
                }else{
                    bodyModal(`<h5>系統異常</h5>`)
                }       
            }catch (err) {
                console.log(err);
                bodyModal(`<h5>出現異常：${err}</h5>`);
            }
        }
    }); 
})


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

function accessToken(){
    return window.localStorage.getItem("accessToken")
}

function localUserInfo(){
    return JSON.parse(localStorage.getItem('userInfo'))
}
const auth = localUserInfo().authId.map(value => `${value}`).join('|');

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
                i("n_checkin").classList.remove("hidden")
                i("dropdownWrapper").classList.remove("dropdown-toggle")
                i("dropdownWrapper").classList.add("public_cursor")
                i("dropdownMenu").classList.remove("dropdown-menu")
                i("dropdownMenu").classList.add("hidden")
            } else {
                i("n_checkin").classList.remove("hidden")
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
                i("i_checkin").classList.remove("hidden")
                i("dropdownWrapper").classList.remove("dropdown-toggle")
                i("dropdownWrapper").classList.add("public_cursor")
                i("dropdownMenu").classList.remove("dropdown-menu")
                i("dropdownMenu").classList.add("hidden")
            }else{
                i("i_checkin").classList.remove("hidden")
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
    // console.log(i("i"+path));
    // i("i"+path).classList.add("itemActive")
    // i("i"+path).getElementsByTagName("h6")[0].classList.add("h6Active")
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

