// 區塊一：查詢條件
i("searchCondition").innerHTML=infoSearchView
i("searchOutcome").innerHTML=infoOutcomeView
iSectorList.forEach(sector => {showSector(sector);});
iGroupList.forEach(group => {showGroup(group)});
i("i_sector").addEventListener("blur", function() {
  const sector = i("i_sector").value
  if(sector===""){
    showAllGroups()
  }else{
    i("i_group").innerHTML = "<option value=''>組別</option>"
    iGroupList.forEach(group => {
      if (group.sector === sector) {showGroup(group)} 
    });
  } 
})

function showSector(sector){
  i("i_sector").innerHTML += `<option value="${sector.id}">${sector.name}</option>`;
}
function showGroup(group){
  i("i_group").innerHTML += `<option value="${group.id}">${group.name}</option>`;
}
// 顯示全部部門、組別=============================================
function showAllSections(){
  i("i_sector").innerHTML = "<option value=''>部門別</option>"
  iSectorList.forEach(sector => {
    i("i_sector").innerHTML += `<option value="${sector.id}">${sector.name}</option>`;
  });
}
function showAllGroups(){
  i("i_group").innerHTML = "<option value=''>組別</option>"
  iGroupList.forEach(group => {
    i("i_group").innerHTML += `<option value="${group.id}">${group.name}</option>`;
  });
}
// 根據部門選擇顯示對應的組別==============================================
function showGroupsBySector(sectorId) {
  i("i_group").innerHTML = "<option value=''>組別</option>"
  iGroupList.forEach(group => {
    if (group.sector === sectorId) {showGroup(group)} 
  });
}

qO("#iYearS, #iYearE, #iAgeS, #iAgeE").forEach(e=>{
    e.addEventListener("blur", function(){
        this.value = this.value.replace(/\D/g, '')
    })
})

i("n_newVol").onclick = () => window.open("/admin/info/newVol");
i("iclear").onclick = () => i("info1Form").reset();

// 區塊二：查詢結果 
$(infoTable)
async function infoTable(){
  const TB= $('#searchResult').DataTable({
    columnDefs: [ 
    {
      className: 'control',
      orderable: false,
      targets:   1
  } 
   ],
    autoWidth: true,
    searching: false, //關閉及時查詢的欄位,serverSide若開啟此項,會造成每輸入一個字就對server做查詢
    processing: 10,
    serverSide: true, //分頁&顯示筆數之操作由server控制
    stateSave: false,
    language: datatableLang,
        // url: "https://cdn.datatables.net/plug-ins/1.13.2/i18n/zh-HANT.json" 
    responsive: {
        details: {
            type: "column",
            target: 1
        },
    }, //頁面變窄之後出現展開結果按鈕
    deferLoading: true, //載入時不執行查詢
    ajax: {
        url: "/vol/info",
        data: function (d) {
            const frm_data = $("#info1Form").serializeArray();
            $.each(frm_data, function (key, val) {
              d[val.name] = val.value;
            });
          },
        type: "POST",
        headers: {
            contentType : "application/json; charset=utf-8",
            Accept: "application/json",
            // Authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
        },
        beforeSend: function (xhr, settings) {
          xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('accessToken')}`)
        },
        dataSrc: function (json) {
          oldData = json.data;
          return json.data;
        },
        error: function (xhr, error, thrown) {
          if (xhr.status === 401) return refreshToken("", ()=> TB.ajax.reload(null, false))
      },
    },
    ordering: false,
    dom:
    "<'row'<'col-sm-4'l>>" + // 1每頁顯示
    "<'row'" + // 全選 "<'row'<'col-sm-6'B>"
    "<'col-sm-6'f>>" +
    "<'row'<'col-sm-12'tr>>" + // 主表
    "<'row'<'col-sm-5'i><'col-sm-7'p>>", //顯示幾頁 第幾頁
    columns: [
      {
        data: "canEdit",
        className: "text-center align-middle",
        render: function (data, type, row) {
            if (data===0) {
              var btn = 
              `<div class="btn btn-secondary bg-gradient btn-sm shadow-sm"
                onclick="intoGroup(${row.vol_id})">加入</div>`
            } else {
              var btn = 
                `<div class="btn btn-primary bg-gradient btn-sm shadow-sm"
                onclick="openPage(${row.vol_id})">編輯</div>`
            }
            return btn;
            },
      },
      {
        data: null, title: "", orderable: false, 
        defaultContent: "", width: "3%",
      },
      { data: "vol_id", className: "f14cm"},
      { data: "name", className: "f14cm" },
      { data: "gender", className: "f14cm"},
      { data: "birthday", 
        className: "f14cm",
        render: function (data, type, row, meta) {
          if (!data) return data
          return data.replace(/^0*(\d{1,3})(\d{2})(\d{2})$/, '$1.$2.$3');
        } 
      },
      { data: "tel", className: "f14cm " },
      { data: "join_date", 
        className: "f14cm",
        render: function (data, type, row, meta) {
          if (!data) return data
          return data.toString().replace(/^0*(\d{1,3})(\d{2})(\d{2})[^0-9]*$/, '$1.$2.$3');
        } 
      },
      { data: "status", className: "f14cm" },
      // { data: "policy", title:"保險狀態<br/>結束日", className: "f14cm"},
      { data: "policy_end_date", 
        title:"保險狀態<br/>結束日",
        className: "f14cm",
        render: function (data, type) {
          const today = (new Date()).toLocaleDateString('zh-TW', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/\//g, '')-19110000
          if (!data) {
            return `<span style="color:brown">未保險</span>`
          }else{
            const status = data > today ? "未到期" : "已到期"
            const color = status === "未到期" ? 'green' : 'brown' 
            const date = data.replace(/^(\d{3})(\d{2})(\d{2})$/, '$1.$2.$3')
            return `<span style="color:${color}">${status}</span><br/><span>${date}</span>`
          }  
      }
      },
      { data: "group_name", className: "f14cm" },
    ],
  });
  $("#isubmit").click(function () {
    TB.ajax.reload(null, false);
    return false;
  }); 
}
const openPage = (id) => window.open(`/admin/info/edit/${id}`);

function intoGroup(id){
  i("hintModalHead").innerHTML = "請選取欲納入的組別"
  i('hintModalBody').innerHTML = `
  <div class="col-sm-12 row" id="intoGroupBox"></div>`
  vGroupList.forEach(g => {
    const authIdRegex = new RegExp(`^(${auth})`)   
    // authId為All全列出，否則就按照authIdRegex.test(g.id)列出
    if (auth ==="All" || authIdRegex.test(g.id)) {
      i('intoGroupBox').innerHTML += `
      <div class="col-6 col-sm-4">
        <input name="into_group" class="form-check-input intoGroup" 
        type="checkbox" value="${g.id}" id="${g.id}I">
        <label class="form-check-label intoGroupLabel" for="${g.id}I">${g.name}</label>
      </div>`
    }   
  })

  toDoSet("加入", async function(){
    const data = {
      vol_id: id,
      into_group: toArray("into_group")
    }
    const resp = await infoAPI.intoGroup(data);
    const res = await resp.data
    if (resp.status===200 & res.message==="ok"){
      bodyModal(`<h5>加入成功</h5>`)
      i('hintModal').addEventListener('hidden.bs.modal', async function() {
        updateTable()
      });
    }else{
        bodyModal(`<h5>系統異常</h5>`)
    }
  })
  hintModal.show()
}