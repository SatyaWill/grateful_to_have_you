'use strict'
// 確認志工是否重複及取得志工編號 =====================================================
async function IsExistVol(){
    try {
        const data = {
            name: i("v_name").value,
            gender: i("v_gender").value,
            id_num: i("v_id_num").value,
            birthday: i("v_birthday").value
        }
        if (volCheckValidate()) {
            const resp = await infoAPI.volId(data)
            const res = await resp.data
            i("v_vol_id").value = res.newVolId
            // 0 已有勿加 1 有找到相符資料，請確認 2 沒有找到相符資料
            if(res.status === 2) {
                bodyModal("<h5>沒有重複，可以新增此志工資料</h5>")
                i("vol2BoxWrapper").classList.remove("hidden")
            }else{
                i("vol2BoxWrapper").classList.add("hidden")
                i("hintModalHead").innerHTML = res.status === 0 ? 
                "已有此位志工資料，不須要新增。" :
                "找到以下志工資料，請確認沒有重複後，再加入。" 
                i('hintModalBody').innerHTML=`
                <table class="table table-bordered">
                <thead>
                <tr>
                    <th scope="col">志工編號</th>
                    <th scope="col">姓名</th>
                    <th scope="col">生日</th>
                    <th scope="col">狀態</th>
                </tr>
                </thead>
                <tbody id="hintModaltbody">
                </tbody>
            </table>`
                res.data.forEach(d=>{
                    i('hintModaltbody').innerHTML += `
                    <td>${d.vol_id}</td>
                    <td>${d.name}</td>
                    <td>${d.birthday}</td>
                    <td>${d.status}</td>`
                })
            }
            hintModal.show()
            if(res.status === 1) 
                return toDoSet("已確認未重複，需要新增", ()=>{
                    i("vol2BoxWrapper").classList.remove("hidden")
                })
        }
    } catch (err) {
        console.log(err);
    }
}

// 儲存新增志工 ================================================================
i("vSave").addEventListener("click", async function(){
    if ( sendCheck(formFields) || !volCheckValidate()) {
        return
    }
    i("vSave").disabled = true
    try{
        waitModal(`<h5>資料處理中，請稍候。</h5>`)
        const bookPic = await getPicName("v_book_pic", "book")
        const idPhoto = await getPicName("v_id_photo", "idPhoto")
        const data= {
            vol_id: i("v_vol_id").value,
            name: i("v_name").value,
            gender: i("v_gender").value,
            id_num: i("v_id_num").value,
            birthday: i("v_birthday").value,
            job_category: i("v_job_category").value,
            job: i("v_job").value,
            education: i("v_education").value,
            school: i("v_school").value,
            has_book: i("v_has_book").value,
            issue_date: i("v_issue_date").value,
            tel: i("v_tel").value,
            mobile: i("v_mobile").value,
            address: i("v_address").value,
            note: i("v_note").value,
            status: i("v_status").value,
            join_date: i("v_join_date").value,
            quit_date: i("v_quit_date").value,
            group_id: toArray("v_group"),
            leader: toArray("v_group_leader"),
            vice: toArray("v_group_vice"),
            book_pic: bookPic,
            id_photo: idPhoto,
        }
        const resp =  await infoAPI.newVol(data)
        const res = await resp.data
        if (resp.status===200 && res.message==="ok"){
            bodyToDoModal(`<h5>新增志工完成</h5>`, '新分頁查看', function(){
                window.open(`/admin/edit/${i("v_vol_id").value}`)
            })
            waitModalClose()
            i('hintModal').addEventListener('hidden.bs.modal', e => {
                location.reload()
            })
        }else{
            bodyModal(`<h5>出現異常</h5>`)
            waitModalClose()
            i('hintModal').addEventListener('hidden.bs.modal', e => {
                location.reload()
            })
        }
    } catch(err){
        console.log(err);
        if(err.response.status===400){
            bodyModal(`<h5>資料格式不符</h5>`)
            waitModalClose()
        }
    }
})





