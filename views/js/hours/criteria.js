// 區塊一：標準設定 =========================================================
let oldData = []
const criteriaTable = $('#hoursCriteria').dataTable({
    columnDefs: [ 
    {className: 'control',
    //   orderable: true,
      targets:   1
  } 
   ],
    autoWidth: true,
    processing: 10,
    language: datatableLang,
    responsive: {
        details: {
            type: "column",
            target: 1
        },
    }, //頁面變窄之後出現展開結果按鈕
    deferLoading: true, //載入時不執行查詢
    ajax: {
        url: "/vol/hourCriteria",
        headers: {
            contentType : "application/json; charset=utf-8",
            Accept: "application/json",
            Authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
        },
        dataSrc: function (json) {
            oldData = json.data;
            return json.data;
        },
        error: function (xhr, error, thrown) {
            if (xhr.status === 401) return refreshToken(xhr.config)
        }
    },
    dom:
    "<'row'" + "<'#formWrapper.col ' >" +// 全選 "<'row'<'col-sm-6'B>"
    "<'col-sm-4 'f>>" +
    "<'row'<'col-sm-12'tr>>" + // 主表
    "<'row'>", //顯示幾頁 第幾頁 "<'row'<'col-sm-5'i><'col-sm-7'p>>"
    columns: [
    {
        data: null,
        className: "text-center align-middle",
        render: function (data, type, row) {
                var btn = 
                `<div class="btn btn-secondary bg-gradient btn-sm shadow-sm cedit_btn"
                onclick='editCriteria("${row.id}", "${row.group_name}", 
                    "${row.group_id+row.subgroup}", "${row.name}", "${row.is_active}", 
                    "${row.start_time}","${row.end_time}")'>編輯</div>`
            return btn;
            },
        },
      {
        data: null,
        tittle: "",
        orderable: false,
        defaultContent: "",
        width: "3%",
      },
      { data: "id", className: "f14cm"},
      { data: {group_id: "group_id",subgroup: "subgroup", group_name: "group_name"}, 
        className: "f14cm",
        render: function (data, type, row) {
            return  data.group_name
        },
      },
      { data: "name", className: "f14cm" },
      { data: {start_time: "start_time",end_time: "end_time"}, className: "f14cm",
        render: function (data, type, row) {
            return  data.start_time +"~"+ data.end_time
        },
      },
      { data: "is_active", className: "f14cm",
        render: function (data, type, row) {
            return  data === "Y" ? "使用中" : "暫停"
        },
      },
      { data: "handler_name" , className: "f14cm" },
      { data: "handle_time" , className: "f14cm" },
    ],
  });
  

// 標準新增表單 ===========================================================
i("formWrapper").innerHTML = `
<form class="input-group audit_selector" id="criteriaForm">
    <select class="form-select groupSelector" aria-label="Example select with button addon" 
    id="c_group" name="group"></select>
    <input type="text" class="form-control" placeholder="名稱" id="c_name" name="name">
    <input type="number" class="form-control" placeholder="開始時間" aria-label="start_time"
    data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="格式為hhmm 4位數字"
    id="start_time" name="start_time">
    <input type="number" class="form-control" placeholder="結束時間" aria-label="end_time"
    data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="格式為hhmm 4位數字"
    id="end_time" name="end_time">
    <button class="btn btn-secondary" type="button" id="addCriteria" disabled>新增標準</button>
</form>`

// 根據使用者權限顯示對應的部門和組別=======================================
qO(".groupSelector").forEach(i=>{
    i.innerHTML = "<option value=''>組別</option>"
    aGroupList.forEach(g => {
        if (auth === "All" || new RegExp(`^(${auth})`).test(g.id)) {
            i.innerHTML += `<option value="${g.id}">${g.name}</option>`;
        }       
    })
}) 

// 起訖時間限制 ===========================================
function timeCheck(ids){
    qO(ids).forEach(i=>{
        i.addEventListener("input", function(){
            if (this.value.length > 4) return this.value = this.value.slice(0, 4);
        })
        i.addEventListener("blur", function(){
            if (!RE.time.test(this.value))
            return i.classList.add("is-invalid")
            i.classList.remove("is-invalid")
        })
    })
}


// 是否可新增 ===========================================
let ifCanSend = false
timeCheck("#start_time, #end_time")
canSendData("criteriaForm", "addCriteria")

function canSendData(formId, btnId="") {
    const form = document.getElementById(formId)
    const e = form.elements

    form.addEventListener("change", function() {
      const timeStatis = RE.time.test(e["start_time"].value) && RE.time.test(e["end_time"].value);
      const allTimeStatus = e["end_time"].value > e["start_time"].value;

      const status = e["group"].value && e["name"].value && timeStatis && allTimeStatus;
      if (btnId){
        i(btnId).disabled = !status;
      }
      return ifCanSend = status;
    });
  }
function isDuplicate(oldData, data) {
    if (Array.isArray(oldData)) {
        return oldData.some(function(item) {
            return item.group_id === data.group_id && 
                   item.subgroup === data.subgroup &&
                   item.start_time === data.start_time &&
                   item.end_time === data.end_time;
        });
    }
}


// 新增標準 ==============================================
i("addCriteria").addEventListener("click", async function() {
    if (!ifCanSend) return;
    const data = {
      name: i("c_name").value,
      group_id: i("c_group").value.substr(0, 2),
      subgroup: i("c_group").value.substr(2, 1),
      start_time: i("start_time").value,
      end_time: i("end_time").value,
    };

    if (isDuplicate(oldData, data)) return bodyModal(`<h5>資料起訖時間與現有資料重複。</h5>`);
    try {
      const resp = await hoursAPI.newCriteria(data);
      const res = resp.data;
      if (resp.status === 200 && res.message === "ok") {
        bodyModal(`<h5>新增成功</h5>`);
        $('#hoursCriteria').DataTable().ajax.reload(null, false);
      }
    } catch (err) {
      bodyModal(`<h5>出現異常：${err}</h5>`);
    }
  });

function editCriteria(id, group_name, group, name, is_active, start_time, end_time){
    i("hintModalHead").innerHTML = `編號${id}-${group_name}`
    i("hintModalBody").innerHTML =`
    <form class="auditForm col-row-auto" id="editForm">
        <input type="text" class="form-control hidden" name="group" value="${group}">
        <div class="form-floating col">
            <input type="text" class="form-control" id="e_name" name="name" value="${name}">
            <label for="e_name">名稱</label>
        </div>
        <div class="form-floating col">
            <input type="number" class="form-control" id="eST" name="start_time" value="${start_time}">
            <label for="eST">開始時間</label>
        </div>
        <div class="form-floating col">
            <input type="number" class="form-control" id="eET" name="end_time" value="${end_time}">
            <label for="eET">結束時間</label>
        </div>
        <div class="form-floating col">
        <select class="form-select" id="is_active" name="is_active">
            <option selected value="${is_active}">${is_active==="Y"?"使用":"暫停"}</option>
            <option value='${is_active==="Y"?"N":"Y"}'>${is_active==="Y"?"暫停":"使用"}</option>
        </select>
        <label for="is_active">使用狀態</label>
        </div>
    </form>`
    hintModal.show()
    timeCheck("#eST, #eET")
    canSendData("editForm", "")
    toDoSet("確定修改", function(){
        const data = {
            id,
            name: i("e_name").value,
            start_time: i("eST").value,
            end_time: i("eET").value,
            is_active: i("is_active").value
        }
        if (!ifCanSend || isDuplicate(oldData, data) ){
            bodyModal("<h5>資料格式不符或重複</h5>")
        } else {
            sendEditCriteria(data)
        }
    })
}

async function sendEditCriteria(data){
    try{
        const resp = await hoursAPI.editCriteria(data)
        const res = resp.data
        if (resp.status===200 & res.message==="ok"){
            bodyModal(`<h5>修改成功</h5>`)
            $('#hoursCriteria').DataTable().ajax.reload(null, false);
        }else{
            bodyModal(`<h5>系統異常</h5>`)
        }       
    }catch (err){
        console.log(err);
        bodyModal(`<h5>出現異常：${err}</h5>`);
    }
}


