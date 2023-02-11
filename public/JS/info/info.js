// 依據登入者顯示nav、登出
haveToken()
navInfo("navUser")
logout("navLogout")
i("n_info").classList.add("itemActive")
i("n_info").getElementsByTagName("h6")[0].classList.add("h6Active")
// 跳轉至各頁面
const navList =["n_info","n_train", "n_shift", "n_hours", "n_input", "n_honor", "n_data", "n_auth", "n_newVol"]
navList.forEach(e=>{
    toPage(e)
})

// 區塊一：查詢條件
i("searchCondition").innerHTML=infoSearchView
i("searchOutcome").innerHTML=infoOutcomeView
i("iSector").addEventListener("blur", function() {
    const sector = i("iSector").value
    const s = `<option value="">組別</option>`
    i("iGroup").innerHTML = 
    sector === "A" ? s+aGroup : sector === "B" ? s+bGroup 
    : sector === "C" ? s+cGroup : sector === "L" ? s+lGroup : s+allGroup
})

qO("#iYearS, #iYearE, #iAgeS, #iAgeE").forEach(e=>{
    e.addEventListener("blur", function(){
        this.value = this.value.replace(/\D/g, '')
    })
})

i("iclear").addEventListener("click", function() {
    i("info1Form").reset()
})

// 區塊二：查詢結果
let infoTable= $('#searchResult').dataTable({
    columnDefs: [ {
        orderable: false,
        className: 'select-checkbox select-checkbox-all',
        targets: 0
    },
    {
      className: 'dtr-control',
      orderable: false,
      targets:   2
  } 
   ],
    select: {
        style: 'multi',
        items: "row",
        selector: 'td:first-child'
    },
    // autoWidth: true,
    searching: false, //關閉及時查詢的欄位,serverSide若開啟此項,會造成每輸入一個字就對server做查詢
    processing: 10,
    // serverSide: true, //分頁&顯示筆數之操作由server控制
    // stateSave: true,
    // stateSaveCallback: function (settings, data) {
    //     var formdata = $("#info1Form").serializeArray();
    //     $(formdata).each(function (index, obj) {
    //       data[obj.name] = obj.value;
    //     });
    //     localStorage.setItem( 'DataTables_' + settings.sInstance, JSON.stringify(data) )
    // },
    // stateLoadCallback: function (settings) {
    //     return JSON.parse( localStorage.getItem( 'DataTables_' + settings.sInstance ) )
    // },
    language: datatableLang,
        // url: "https://cdn.datatables.net/plug-ins/1.13.2/i18n/zh-HANT.json" 
    responsive: {
        details: {
            type: "column",
            target: 2
        },
    }, //頁面變窄之後出現展開結果按鈕
    deferLoading: true, //載入時不執行查詢
    ajax: {
        url: "/vol/info",
        data: function (d) {
            var frm_data = $("#info1Form").serializeArray();
            $.each(frm_data, function (key, val) {
              d[val.name] = val.value;
            });
            console.log(d);
          },
        type: "POST",
        headers: {
            contentType : "application/json; charset=utf-8",
            Accept: "application/json",
            Authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
        }
    },
    ordering: false,
    dom:
    "<'row'<'col-sm-12'l>>" + // 1每頁顯示
    "<'row'<'col-sm-6'B>" + // 全選
    "<'col-sm-6'f>>" +
    "<'row'<'col-sm-12'tr>>" + // 主表
    "<'row'<'col-sm-5'i><'col-sm-7'p>>", //顯示幾頁 第幾頁
    columns: [
        {
            data: null,
            tittle: "",
            orderable: false,
            defaultContent: "",
            width: "3%",
            className: "select-checkbox text-middle",
        },
        {
            data: "vol_id",
            className: "text-center text-middle",
            render: function (data, type, row) {
                if (!data) {
                    var btn = "";
                } else {
                    var url = "/admin/edit/" + row.vol_id;
                    var btn =
                    '<a class="btn btn-primary btn-sm" onclick="PopupCenter(\'' +
                    url +
                    "','',1000,600)\">查看</a>";
                }
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
        { data: "vol_id", className: "f14cm " },
        { data: "name", className: "text-center f14cm " },
        { data: "gender", className: "f14cm " },
        { data: "birthday", className: "text-center f14cm " },
        { data: "tel", className: "text-center f14cm lh-sm" },
        { data: "join_date", className: "text-center f14cm " },
        { data: "status", className: "f14cm " },
        { data: "policy", title:"保險狀態<br/>結束日",className: "text-center f14cm text-wrap" },
        { data: "group_name", className: "f14cml text-wrap" },
    ],
    buttons: [
        "selectAll",
        "selectNone",
        {
            text: "選取變更收編狀態",
            className: "btn btn-primary btn-sm",
            name: "modify",
            action: function (e, dt, node, config) {
                modlfySelected(infoTable);
            },
        },
    ],
});

$("#isubmit").click(function () {
    infoTable.api().ajax.reload();
    return false;
  });


function modlfySelected(datatable) {
    var cnt = datatable.rows({ selected: true }).count();
    var ids = "";
    var info = "";
    var v = i("iStatus").value;
  
    if (cnt > 0) {
      datatable
        .rows({ selected: true })
        .every(function (rowIdx, tableLoop, rowLoop) {
          var d = this.data();
          if (rowLoop === 0) {
            ids += "btSelectItem=" + d.vol_id;
            info += d.vol_id;
          } else {
            ids += "&btSelectItem=" + d.vol_id;
            info += "," + d.vol_id;
          }
        });
  
      swal({
        title: "確定批次變更所選資料?",
        text: "(依目前志工收編狀態變更，收編→離隊，離隊→收編)",
        type: "info",
        showCancelButton: true,
        confirmButtonText: "確認變更",
        cancelButtonText: "返回",
      })
        .then(function (isConfirm) {
          if (isConfirm) {
            // $.ajax({
            //   url: "/vols2/f100/modifyJoinStatus/?" + ids,
            //   data: $("#f12mForm").serialize(),
            //   type: "POST",
            //   success: function (json) {
            //     applyElementUpdates(json);
            //     swal({
            //       title: "批次變更作業完成",
            //       type: "success",
            //       confirmButtonText: "確定",
            //     });
            //     $("#search").click();
            //   },
            //   error: defaultAjaxError,
            //   beforeSend: startLoad,
            //   complete: endLoad,
            // });
            alert("功能待建構")
          }
        })
        .done();
    } else {
      swal({
        title: "請選取欲變更之資料",
        type: "info",
        confirmButtonText: "我知道了",
      });
    }
  }
  
