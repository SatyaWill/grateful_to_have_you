aGroupList.forEach(g => {
    if (auth === "All" || new RegExp(`^(${auth})`).test(g.id)) {
        i("audit_group").innerHTML += `
        <input type="radio" class="btn-check" name="group" id="a_${g.id}" autocomplete="off">
        <label class="btn btn-light" for="a_${g.id}">${g.name}</label>`;
    }       
})

const auditTable = $('#hoursAudit').dataTable({
    columnDefs: [ 
    {
    orderable: false,
    className: 'select-checkbox select-checkbox-all',
    targets: 0
    },
    {className: 'control',
      targets:   1
    }
   ],
     select: {
      style: 'multi',
      items: "row",
      selector: 'td:first-child'
  },
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
    // ajax: {
    //     url: "/vol/hourCriteria",
    //     headers: {
    //         contentType : "application/json; charset=utf-8",
    //         Accept: "application/json",
    //         Authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
    //     },
    //     dataSrc: function (json) {
    //         oldData = json.data;
    //         return json.data;
    //     },
    //     error: function (xhr, error, thrown) {
    //         if (xhr.status === 401) return refreshToken(xhr.config)
    //     }
    // },
    dom:
    "<'row'<'col-sm-4'l>>" + // 1每頁顯示
    "<'row'" + "<'col-sm-6'B>" +// 全選 
    "<'col-sm-6 'f>>" +
    "<'row'<'col-sm-12'tr>>" + // 主表
    "<'row'<'col-sm-5'i><'col-sm-7'p>>", //顯示幾頁 第幾頁 
    columns: [
      {
        data: null,
        tittle: "",
        orderable: false,
        defaultContent: "",
        id: "select-item",
        className: "select-checkbox",
      },
      {
        data: null,
        tittle: "",
        orderable: false,
        defaultContent: "",
        width: "3%",
      },
      { data: "id", className: "f14cm" },
      { data: "vol_id", className: "f14cm" },
      { data: "name", className: "f14cm" },
      { data: "date", className: "f14cm" },
      { data: "start_time", className: "f14cm"},
      { data: "end_time", className: "f14cm"},
      { data: "criteria_name" , className: "f14cm" },
      { data: "hours" , className: "f14cm" },
      { data: "audit_hours" , className: "f14cm" },
      { data: "note" , className: "f14cm" },
    ],
  buttons: [
      "selectAll",
      "selectNone",
      {
          text: "審核時數",
          className: "btn btn-primary bg-gradient btn-sm shadow-sm",
          name: "modify",
          action: function (e, dt, node, config) {
              modlfySelected(auditTable);
          },
      },
      {
        text: "審核時數",
        className: "btn btn-primary bg-gradient btn-sm shadow-sm",
        name: "modify",
        action: function (e, dt, node, config) {
            modlfySelected(auditTable);
        },
    },
  ],
  });