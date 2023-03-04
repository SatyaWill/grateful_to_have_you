let authData = []
$(document).ready(function() {
    const TB = $("#authSet").DataTable({
        columnDefs: [ { className: "control", targets: 0 } ],
        select: "single",
        autoWidth: true,
        processing: 10,
        language: datatableLang,
        responsive: { details: { type: "column", target: 0 } }, //頁面變窄之後出現展開結果按鈕
        deferLoading: true, //載入時不執行查詢
        ajax: {
            url: `/auth/agentAuthTable`,
            headers: {
                contentType: "application/json; charset=utf-8",
                Accept: "application/json",
                Authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
            },
            dataSrc: function (json) {
                authData = json.data;
                return json.data;
            },
            error: function (xhr, error, thrown) {
                if (xhr.status === 401) return refreshToken(xhr.config);
            },
        },
        dom:
            "<'row'<'col 'B><'col 'f>>" +
            "<'row'<'col-sm-12'tr>>",
        columns: [
            {
                data: null,
                title: "",
                orderable: false,
                defaultContent: "",
                width: "3%",
            },
            { data: "id", className: "f14cm"},
            { data: "name", className: "f14cm"},
            { data: "auth_area", className: "f14cm" },
            { data: "status", className: "f14cm",
                render: function (data, type, row) {
                    return data==="Y" ? "使用中" : "N"
                },    
            },
            { data: "agent_handle_time", className: "f14cm"},
            { data: "auth_handle_time", className: "f14cm" },
        ],
        buttons: [
            {
                text: "修改權限",
                className: "btn btn-warning bg-gradient btn-sm shadow-sm notOver",
                name: "editAuth",
                enabled: false,
                action: function (e, dt, node, config) {
                    editAuth(this);
                },
            },
            {
                text: "修改帳號",
                className: "btn btn-dark bg-gradient btn-sm shadow-sm notOver",
                name: "editAgent",
                enabled: false,
                action: function (e, dt, node, config) {
                    editAgent(this);
                },
            },
            {
                text: "新增帳號",
                className: "btn btn-success bg-gradient btn-sm shadow-sm notOver",
                name: "newAgent",
                action: function (e, dt, node, config) {
                    newAgent(this);
                },
            },
        ],
    });
    TB.on( 'select deselect', function () {
        const cnt = TB.rows( { selected: true } ).count();
        TB.buttons( ['editAgent:name','editAuth:name'] ).enable( 
            cnt === 1 ? true : false
        );
    });
})
// 修改資料 ===============================================================================
async function editAgent(tb){
    const d = tb.rows({ selected: true }).data()[0]
    i("hintModalHead").innerHTML = `修改帳號「${d.id}」資料`
    i('hintModalBody').innerHTML = agentModalContent(d)
    if (d.id==="public") {
        i("PW").classList.remove("hidden")
    }
    valBtnSetModalShow("確定修改")
    i("editForm").addEventListener("change", function(){
        const name = i("e_name").value
        const password = d.id === "public" ? i("e_PW").value : ""
        const status = i("e_status").value
        const ns = (d.name === name && d.status === status)
        const isSame = d.id!=="public" ? ns : ns && password===""
        const invalid = !RE.name.test(name)
        // const msg = !name ? "名稱未填寫" : invalid ? "名稱需二字以上" : "資料未修改" 
        i("toDo").disabled = !name || invalid || isSame
        const data = { id: d.id, name, status, password }
        i("toDo").addEventListener("click", function(){
            i("toDo").disabled = true
            authApiHandler("editAgent", data)
        })
    })
}

async function editAuth(tb){
    const d = tb.rows({ selected: true }).data()[0]
    i("hintModalHead").innerHTML = `帳號「${d.id}」權限設定`
    i('hintModalBody').innerHTML = `
        <form class="col-sm-12 row" id="authList"></form>
        <div id="hintTemp"></div>
        <div class="invalid-feedback" id="hintMsg"></div>`
    const originalAuthId = d.auth_id.split(",")
    authModalContent(originalAuthId)
    valBtnSetModalShow("確定修改")
    authCheckboxCtrl()
    i("authList").addEventListener("change", function(){
        const auth_id = toArray("authArea")
        const isSame = JSON.stringify(originalAuthId) === JSON.stringify(auth_id)
        const rm = originalAuthId.filter((id) => !auth_id.includes(id)) 
        const add = auth_id.filter((id) => !originalAuthId.includes(id));
        const rm_auth_id = rm.includes('') ? [] : rm;
        const add_auth_id = add.includes('') ? [] : add;
        const data = { id: d.id, add_auth_id, rm_auth_id }
        i("toDo").disabled = isSame
        i("toDo").addEventListener("click", function(){
            i("toDo").disabled = true
            authApiHandler("editAuth", data)
        })
    })

}
async function newAgent(){
    i("hintModalHead").innerHTML = `新增帳號`
    i("hintModalBody").innerHTML = newAgentModalContent()
    newAgentModalContent2()
    valBtnSetModalShow("新增")
    authCheckboxCtrl()
    i("editForm").addEventListener("change", function(){
        const idList = authData.map(item => item.id)
        const id = i("e_id") ? i("e_id").value.trim() : ""
        const name = i("e_name") ? i("e_name").value.trim() : ""
        const idRE = RE.agent_id.test(id)
        const nameRE = RE.name.test(name)
        const idRpt = idList.includes(id)
        const data = { id, name, auth_id : toArray("authArea") }
        const ivalid = !idRE || !nameRE || idRpt
        const msg = !idRE && !nameRE ? "帳號需三字以上、名稱需二字以上" : idRpt ? "帳號已存在" : 
                    !idRE ? "帳號需三字以上" : "名稱需二字以上"
        const okMsgTitle = `帳號「${id}」新增成功`
        const okMsg = `<h5>密碼預設與帳號相同<br/>請「${name}」立即登入修改密碼。</h5>`
        valHint(ivalid , msg)
        i("toDo").disabled = ivalid
        i("toDo").addEventListener("click", function(){
            i("toDo").disabled = true
            authApiHandler("newAgent", data, okMsgTitle, okMsg)
        })
    })
}
// 功能 modal view ============================================================================
function agentModalContent(d){
    return`
    <form class="auditForm col-row-auto" id="editForm">
        <div class="form-floating col">
            <input type="text" class="form-control" id="e_name" name="name" value="${d.name}">
            <label for="e_name">名稱</label>
        </div>
        <div class="form-floating col hidden" id="PW">
            <input type="password" class="form-control" id="e_PW" name="PW" placeholder="修改密碼">
            <label for="e_PW">修改密碼</label>
        </div>
        <div class="form-floating col ">
            <select class="form-select" id="e_status" name="e_status">
                <option selected value="${d.status}">${d.status==="Y"?"使用":"停用"}</option>
                <option value='${d.status==="Y"?"N":"Y"}'>${d.status==="Y"?"停用":"使用"}</option>
            </select>
            <label for="is_active">使用狀態</label>
        </div>
    </form>
    <div id="hintTemp"></div>
    <div class="invalid-feedback" id="hintMsg">資料未填寫完整</div>`
}
function authModalContent(authIds){
    authList.forEach(g => {
        const checked = authIds.includes(g.id) ? "checked" : ""
        const disabled = (g.id.length>1 && authIds.includes(g.id.substr(0,1))) || 
                         authIds.includes('All') && g.id!=='All' ? "disabled" :  ""
        i('authList').innerHTML += `
        <div class="col-6 col-sm-4">
          <input name="authArea" class="form-check-input intoGroup" 
          type="checkbox" value="${g.id}" id="${g.id}" ${checked} ${disabled}>
          <label class="form-check-label intoGroupLabel" for="${g.id}">${g.name}</label>
        </div>
        `
    })
}

function authCheckboxCtrl(){ // Model checkbox選取控制====================================

}

function newAgentModalContent(){
    return `
    <form class="auditForm authForm" id="editForm">
        <div class="form-floating">
            <input type="text" class="form-control" id="e_name" name="name" >
            <label for="e_name">名稱</label>
        </div>
        <div class="form-floating">
            <input type="text" class="form-control" id="e_id" name="name" >
            <label for="e_id">帳號</label>
        </div>
    </form>
    <div class="col-sm-12 row newAgent" id="authList">
        <p class="newAgentTitle"><i class="bi bi-person-fill-gear"></i>權限設定</p>
    </div>
    <div id="hintTemp"></div>
    <div class="invalid-feedback" id="hintMsg"></div>`
}
function newAgentModalContent2(){
    authList.forEach(g => {
        i('authList').innerHTML += `
        <div class="col-6 col-sm-4">
          <input name="authArea" class="form-check-input intoGroup" 
          type="checkbox" value="${g.id}" id="${g.id}">
          <label class="form-check-label intoGroupLabel" for="${g.id}">${g.name}</label>
        </div>`
    })
}
// 資料驗證 ============================================================
function valHint(invalidStatus, invalidMsg){
    if ( invalidStatus ) {
        i("hintTemp").classList.add("is-invalid")
        i("hintMsg").innerHTML = invalidMsg
        return
    } else {
        i("hintTemp").classList.remove("is-invalid")
    }
}

// 驗證成功資料傳回server及接收作業訊息等相關處理 =========================
async function authApiHandler(type, data, okMsgTitle="", okMsg=`<h5>作業完成</h5>`){
    try{
        const api = type==="editAgent" ? authAPI.editAgent(data) : 
                    type==="editAuth" ? authAPI.editAgentAuth(data) : authAPI.newAgent(data)
        const resp = await api
        const res = resp.data
        if (resp.status===200 & res.message==="ok"){
            headBodyModal(okMsgTitle,okMsg)
            $("#authSet").DataTable().ajax.reload(null, false);
        }else{
            bodyModal(`<h5>系統異常</h5>`)
        }       
    }catch (err) {
        console.log(err);
        bodyModal(`<h5>出現異常：${err}</h5>`);
    }
}

