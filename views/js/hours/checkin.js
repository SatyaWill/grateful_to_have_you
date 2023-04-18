// 志工編號輸入 ====================================================================
i("vol_id").addEventListener("input", function(){
    if (this.value.length > 6) return this.value = this.value.slice(0, 6);
    if (this.value.length >= 5) return abled("check")
    disabled("check")
});
// 志工編號格式檢查 
function idCheck(){
    const maxNum = ((new Date()).getFullYear() - 1911) * 1000 + 300;
    const volId = i("vol_id")
    const volIdStatus = volId.value >= 94001 && volId.value < maxNum
    if ( !volIdStatus) {
        i("hint1").classList.add("is-invalid")
        i("hint").innerHTML = "志工編號錯誤"
    }else {
        i("hint1").classList.remove("is-invalid")
        i("hint").innerHTM = ""
    }
    return volIdStatus
}
let checkin_id = ""
// 查詢 簽到 或 簽退 ======================================================================
i("check").addEventListener("click", async function(e){
    e.preventDefault()
    if (!idCheck()) return
    checkReset()
    try{
        const volId = i("vol_id").value
        const resp = await hoursAPI.checkinType(volId)
        const d = await resp.data.data[0]
        if (resp.status === 200) {
            if (!d || d.group_list===null) {
                const msg = !d ? `<h5>查無編號 ${volId} 的資料</h5>` : `<h5>編號 ${volId} 目前沒有加入的組別</h5>`
                bodyModal(msg)
                i('hintModal').addEventListener('hidden.bs.modal', e => {
                    i("vol_id").value = ""
                })
            } else {
                disabled("vol_id")
                if (d.checkin_id && !d.end_time) {
                    checkin_id = d.checkin_id
                    i("infoCheck").innerHTML = `　　姓名： ${d.name} <br/>　　組別： ${d.group_name} <br/>簽到時間： ${d.start_time.substr(0,2)}:${d.start_time.substr(2,2)}`
                    qO("#checkinBtn, #end").forEach(i=>{i.classList.remove("hidden")})
                    
                } else {
                    showGroups(d.group_list);
                    i("infoCheck").innerHTML = d.group_list.length===1 ? 
                                            `${d.name}，您好： 請確認組別後，再按簽到。` :
                                            `${d.name}，您好： 請選取組別後，再按簽到。`
                    qO("#checkinBtn, #start").forEach(i=>{i.classList.remove("hidden")})
                }  
            } 
          }
    } catch (err) {
        bodyModal(`<h5>出現異常：${err}</h5>`);
    }
})

function showGroups(d){  // 顯示志工的組別 ===================================================
    aGroupList.forEach( g => { if (d.includes(g.id)) {
            if (d.length===1) return checkbox(g , "checked", "disabled")
            checkbox(g , "", "")
    }})
    function checkbox(data , checked, disabled){ 
            i("group").innerHTML += `  
            <input type="radio" class="btn-check" name="group" id="${data.id}" value="${data.id}" autocomplete="off" ${checked} ${disabled}>
            <label class="btn btn-outline-secondary m-2" for="${data.id}">${data.name}</label>`
    }
}
// 取消後重置畫面 =========================================================================
i("cancel").addEventListener("click", ()=>{checkinReset()})
function checkReset(){
    abled("vol_id")
    disabled("check")
    qO("#infoCheck, #group").forEach(i=>{i.innerHTML = ""})
    qO("#checkinBtn, #start, #end").forEach(i=>{i.classList.add("hidden")})
}
function checkinReset(){
    checkReset()
    i("vol_id").value = ""
    i("vol_id").focus()
}

// 簽到 ===================================================================================
i("start").addEventListener("click", async () => {
    if (!groupCheck()) return
    const data = {
        vol_id: i("vol_id").value,
        group: q1('input[name="group"]:checked').value,
    }
    try {
        const resp = await hoursAPI.checkinStart(data)
        const res = resp.data;
        if (resp.status === 200 && res.message === "ok") {
            headBodyModal("簽到完成",`<h5>服務完記得回來簽退喔～感謝您</h5>`)
            i('hintModal').addEventListener('hidden.bs.modal', () => {checkinReset()})
        }
    } catch (err) {
        bodyModal(`<h5>出現異常：${err}</h5>`);
    }
})

// 簽退 ===================================================================================
i("end").addEventListener("click", async () =>{
    try {
        const resp = await hoursAPI.checkinEnd({checkin_id: checkin_id})
        const res = resp.data;
        if (resp.status === 200 && res.message === "ok") {
            headBodyModal("簽退完成",`<h5>感謝您用心的服務，祝福您順心愉快～</h5>`)
            i('hintModal').addEventListener('hidden.bs.modal', () => {checkinReset()})
        }
    } catch (err) {
        bodyModal(`<h5>出現異常：${err}</h5>`);
    }
})


function groupCheck(){
    const group = q1('input[name="group"]:checked') !== null
    if ( !group ) {
        bodyModal("<h5>請先選取組別</h5>")
    } 
    return group
}

