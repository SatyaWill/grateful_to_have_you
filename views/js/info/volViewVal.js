'use strict'
const formFields = {
    v_name: {required: true, regex: RE.name},
    v_gender: {required: true, regex: RE.gender},
    v_id_num: {required: true, regex: RE.id},
    v_birthday: {required: true, regex: RE.date},
    v_job_category: {required: true, regex: RE.job_category},
    v_issue_date: {required: false, regex: RE.date},
    v_quit_date: {required: false, regex: RE.date},
    v_join_date: {required: true, regex: RE.date},
    v_education: {required: true, regex: RE.education},
    v_has_book: {required: true, regex: RE.bit},
    v_status: {required: true, regex: RE.status},
    v_tel: {required: false, regex: RE.L20},
    v_mobile: {required: false, regex: RE.L20},
    v_address: {required: false, regex: RE.L30},
    v_school: {required: false, regex: RE.L30},
    v_job: {required: false, regex: RE.L30},
    v_note: {required: false, regex: RE.L85},
};
// 輸入驗證 =========================================================
checkedResp("no_id_num", "v_id_num", "A100000000")
checkedResp("no_birthday", "v_birthday", "0010101")
blurCheck(formFields)

i("v_has_book").addEventListener("blur", function(){
    if(this.value!=1){
        i("v_book_pic").value= ""
        i(("v_issue_date")).value= ""
        i(("v_issue_date")).classList.remove("is-invalid")
        disabled("v_book_pic")
        disabled("v_issue_date")
    }else{
        abled("v_book_pic")
        abled("v_issue_date")
    }
})

// 驗證函式 =================================================================
function checkedResp(id, effectedId, effectedValue){
    i(id).addEventListener("click", function(){
        if(this.checked){
            i(effectedId).value=effectedValue;
            disabled(effectedId);
            i(effectedId).classList.remove("is-invalid")
        }else{
            i(effectedId).value="";
            abled(effectedId);
        }
    })
}
// 輸入完驗證
function blurCheck(fields) {
    Object.entries(fields).forEach(([selector, config]) => {
      chgHint(selector, config.required, config.regex)
    });
}
function chgHint(id, required, rule){
    i(id).addEventListener("blur", function(){ invalidHint(id, required, rule) })
}
// 按送出時驗證 (invalidHint 在 user.js)
function sendCheck(fields) {
    let status = 0
    Object.entries(fields).map(([selector, config]) => {
        let a = invalidHint(selector, config.required, config.regex);
        if (!a) return status+=1
    });
    return status
}
// 第一區塊送出驗證
function volCheckValidate(){
    const nameStatus = invalidHint("v_name", 1, RE.name)
    const genderStatus = invalidHint("v_gender", 1, RE.gender)
    const idStatus = invalidHint("v_id_num", 1, RE.id)
    const birthdayStatus = invalidHint("v_birthday", 1, RE.date)
    const genderId = function(){
        const g = i("v_gender").value
        const n = i("v_id_num").value.substr(1,1)
        if(i("no_id_num").checked) return true
        if( (g ==="女" && n ==="2") || (g ==="男" && n ==="1")) return true
            invalidHint("v_id_num", 1, "", "vIdHint", "身分證與性別不符")
    }
    return nameStatus*genderStatus*idStatus*birthdayStatus*genderId()
}
// 大頭照預覽 =========================================================
$("#upPicBtn").click(function(){ jQuery('#v_id_photo').click(); });
$('#v_id_photo').change(function(){
    var i = $(this).prev('label').clone();
    var file = $('#v_id_photo')[0].files[0].name;
    jQuery('#picSelFileName').html(file);
    $('#picPreview').css('background-image','url('+URL.createObjectURL($('#v_id_photo')[0].files[0])+')');
});

// 取得照片Url ==================================================
async function getPicName(id, folderName){
    try{
        if(!i(id).files[0]) {
            return ""
        }else if(/^image/.test(i(id).files[0].type)){
            const resp = await infoAPI.picUrl({ params: folderName })
            const { url } = await resp.data
            const res = await infoAPI.uploadPic(url, i(id).files[0])
           if (res.status===200) 
           return new URL(url.split('?')[0]).pathname.split("/")[2]
        }
    }catch(err){
        console.log(err);
    }
}



// 複選處理  ===========================================================
vGroupList.forEach(g=>{
    const option = auth ==="All" ? "" : 
                   !new RegExp(`^(${auth})`).test(g.id) ? "disabled" : ""
    checkbox("v_group", g, "", option)
    checkbox("v_group_leader", g, "L", "disabled")
    checkbox("v_group_vice", g, "V", "disabled")
    function checkbox(itemId, data , idPlus, disabled){
        i(itemId).innerHTML += `
        <input name=${itemId} class="form-check-input vGroupInput" 
        type="checkbox" value="${data.id}" id="${data.id}${idPlus}" ${disabled}>
        <label class="form-check-label vGroupLabel" for="${data.id}${idPlus}">${data.name}</label>`
    }
})
// 組別勾選後，開放勾選(副)組長相對應的框
i("v_group").querySelectorAll('input[type="checkbox"]').forEach((c) => {
    c.addEventListener('click', () => {
      if (c.checked) {
        abled(c.value+"L")
        abled(c.value+"V")
      } else {
        disabled(c.value+"L")
        disabled(c.value+"V")
      }
    });
});

i("v_group_leader").querySelectorAll('input[type="checkbox"]').forEach((c) => {
    c.addEventListener('click', () => {
      if (c.checked) return disabled(c.value+"V")
      abled(c.value+"V")
    });
});
i("v_group_vice").querySelectorAll('input[type="checkbox"]').forEach((c) => {
    c.addEventListener('click', () => {
      if (c.checked) return disabled(c.value+"L")
      abled(c.value+"L")
    });
});


