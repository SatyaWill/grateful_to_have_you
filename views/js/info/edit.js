// 頁面初始化，path的id若非法，不進後端，前端直接導回board ==================
const volId = new URL(location.href).pathname.split("/")[4];
let oldData = {}
let editedVolData = {}
let isCheckChanged = false
let isInputChanged = false
let isChanged = false;
let groupList = [] // 組別
let leaderGroup = [] // 組長組別
let viceGroup = [] // 副組長組別

getPageInfo()

async function getPageInfo() {
    const maxNum = ((new Date()).getFullYear() - 1911) * 1000 + 999;
    if (volId > maxNum) return window.location.href = '/admin/board';
    try {
        const { data: { data: res }, status } = await infoAPI.editPage(volId);
        if (status === 200 && res) {
            Object.entries(res).forEach(([key, value]) => {
                const noAction = ["id_photo", "book_pic", "group_id", "leader", "vice"]
                if (!noAction.includes(key)){              
                    const el = i(`v_${key}`);
                    if (el) return el.value = value;
                }  
            });
            oldData = res;
            groupList = res.group_id ? JSON.parse(res.group_id) : []
            leaderGroup = res.leader ? JSON.parse(res.leader) : [] 
            viceGroup = res.vice ? JSON.parse(res.vice) : [] 
            document.title = `${res.name}`;

            if (res.id_num) {
                disabled("no_id_num")
            }
            if (res.birthday) {
                disabled("no_birthday")
            }
            // 大頭照
            if (res.id_photo) {
                i("picPreview").style.backgroundImage = `url(${res.id_photo})`;
            }
            if (res.book_pic) {
                const a = document.createElement('a');
                a.innerHTML = `${res.name}-紀錄冊.jpg`;
                a.addEventListener('click', async () => {
                    if (!a.href.includes('blob')) {
                        const response = await fetch(res.book_pic);
                        const blob = await response.blob();
                        const url = URL.createObjectURL(blob);
                        a.href = url;
                        a.download = `${res.name}-紀錄冊.jpg`;
                    }
                });
                i("v_book_picUrl").appendChild(a);
            }           
              
            // 複選框處理
            arrayToCkeck(groupList, "");
            arrayToCkeck(leaderGroup, "L");
            arrayToCkeck(viceGroup, "V");
            if ( i("v_has_book").value ) {
                abled("v_book_pic")
                abled("v_issue_date")
            }
            // 複選框連動控制
            i("v_group").querySelectorAll('input[type="checkbox"]').forEach((c) => {
                if (!c.disabled && c.checked) {
                    abled(c.value+"L")
                    abled(c.value+"V")
                } else {
                    disabled(c.value+"L")
                    disabled(c.value+"V")
                }
            });
            i("vSave").disabled = true
        } else {
            window.close()
        }
    } catch (err) {
        console.log(err);
        // window.location.href = '/admin/board';
    }
}
function arrayToCkeck(array, plus) {
    array.forEach(v => {
        const id = v+plus
        if (i(id)) return i(id).checked = true;
    });
}

// 修改儲存控制 ========================================================
i("volForm").addEventListener("change", function (e) {
    const name = e.target.name;
    const checkList = ["v_group", "v_group_leader", "v_group_vice"];
    const idBirthdayCheck = ["no_id_num", "no_birthday"]
    if (checkList.includes(name)){
        const isGroupChg = !checkChg(groupList, toArray("v_group"));
        const isLeaderChg = !checkChg(leaderGroup, toArray("v_group_leader"));
        const isViceChg = !checkChg(viceGroup, toArray("v_group_vice"));
        isCheckChanged = isGroupChg || isLeaderChg || isViceChg;
    } else if (!idBirthdayCheck.includes(name)){
        if (oldData[name] != e.target.value){
            editedVolData[name] = e.target.value;
        } else {
            delete editedVolData[name];
        }
        isInputChanged = oldData[name] != e.target.value
    }
    isChanged = (isCheckChanged || isInputChanged)
    i("vSave").disabled = !isChanged;
});

function checkChg(x, y) { 
    return JSON.stringify(x) == JSON.stringify(y);
}
  

i("vSave").addEventListener('click', async function() {
    if (!isChanged || sendCheck(formFields) || !volCheckValidate()) {
        bodyModal(`<h5>資料格式不符，請確認。</h5>`);
        return
    }
    try {
        sendEditData()
    } catch (err) {
        console.log(err);
        waitModalClose()
        if(err.response.status===400){
            bodyModal(`<h5>資料格式不符</h5>`)
        }
        bodyModal(`<h5>出現異常：${err}</h5>`)
    }
    });


async function sendEditData(){
    const rmGroupId = groupList.filter((id) => !toArray("v_group").includes(id));
    const rmLeader = leaderGroup.filter((id) => !toArray("v_group_leader").includes(id));
    const rmVice = viceGroup.filter((id) => !toArray("v_group_vice").includes(id));
    const addGroupId = toArray("v_group").filter((id) => !groupList.includes(id));
    const addLeader = toArray("v_group_leader").filter((id) => !leaderGroup.includes(id));
    const addVice = toArray("v_group_vice").filter((id) => !viceGroup.includes(id));

    const groupData = {
        vol_id: i("v_vol_id").value,
        addGroupId,
        addLeader,
        addVice,
        rmGroupId,
        rmLeader,
        rmVice,
    }
    waitModal(`<h5>資料處理中，請稍候。</h5>`)
    const book_pic = await getPicName("v_book_pic", "book")
    const id_photo = await getPicName("v_id_photo", "idPhoto")
    if ( book_pic ) {
        editedVolData["book_pic"] = book_pic;
    }
    if ( id_photo ) {
        editedVolData["id_photo"] = id_photo;
    }
    const resp = await infoAPI.editVol({ ...editedVolData, ...groupData });
    const res = await resp.data
    if (resp.status===200 && res.message==="ok"){
        bodyModal(`<h5>資料更新完成</h5>`)
        waitModalClose()
        i('hintModal').addEventListener('hidden.bs.modal', event => {
            location.reload()
            window.opener.updateTable();
          })
    }else{
        bodyModal(`<h5>出現異常</h5>`)
        waitModalClose()
        i("modalClose").addEventListener("click", function(){
            location.reload()
        })
    }
}
