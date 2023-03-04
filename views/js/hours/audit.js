// 初始化表單資料
$(document).ready(async function() {
    await getAuditCount("N", "L")
    loadTableData( "Y", "L", "NO" ); // "L"上個月 "L2"前二月 "T"這個月
});
async function getAuditCount(isOver, month){
    const res = await hoursAPI.hourAuditCount(isOver, month)
    const data = res.data.data
    const checkedGroup = q1('input[name="group"]:checked');
    i("groupBtn").innerHTML = ""
    data.forEach((g) => {
        const checked = checkedGroup !== null && g.id === checkedGroup.value ? "checked" : "";
        i("groupBtn").innerHTML += `
            <input type="radio" class="btn-check" name="group" id="a_${g.id}" value="${g.id}" autocomplete="off" ${checked}>
            <label class="btn btn-light" for="a_${g.id}">${g.name}
                <i class="count">${g.count}</i>
            </label>`;
    }); // 參數 是否完成審查(Y.N)、月份、組別
}

i("periodGroup").addEventListener("change", async function(e){
    const month = i("month").value
    const group = q1('input[name="group"]:checked') !== null ? q1('input[name="group"]:checked').value : ""
    const isAuditOver = i("auditOver").checked ? "Y" : "N"
    if (e.target.name==="isAuditOver" || e.target.name==="month"){
        getAuditCount(isAuditOver , month)
    }
    if (month && group){
        $('#hoursAudit').DataTable().clear();
        $('#hoursAudit').DataTable().destroy(); // 先銷毀原有的 dataTable
        loadTableData(isAuditOver, month, group) // 再以新的參數建立 dataTable
    }
})

i("tableForm").addEventListener("change", function(e){
    if (e.target.name==="hours") return  e.target.value = Math.round(e.target.value * 2) / 2
})

function loadTableData(isAuditOver, month, group, ) {
const TB = $("#hoursAudit").DataTable({
        columnDefs: [ { className: "control", targets: 0 } ],
        select: true,
        autoWidth: true,
        processing: 10,
        language: datatableLang,
        responsive: { details: { type: "column", target: 0 } }, //頁面變窄之後出現展開結果按鈕
        deferLoading: true, //載入時不執行查詢
        ajax: {
            url: `/vol/hourAudit/${isAuditOver}/${month}/${group}`,
            headers: {
                contentType: "application/json; charset=utf-8",
                Accept: "application/json",
                Authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
            },
            error: function (xhr, error, thrown) {
                if (xhr.status === 401) return refreshToken(xhr.config);
            },
        },
        dom:
            "<'row'<'col-sm-4'l>>" + // 1每頁顯示
            "<'row'" +
            "<'col-sm-6'B>" + // 全選
            "<'col-sm-6 'f>>" +
            "<'row'<'col-sm-12'tr>>" + // 主表
            "<'row'<'col-sm-5'i><'col-sm-7'p>>", //顯示幾頁 第幾頁
        columns: [
            {
                data: null,
                tittle: "",
                orderable: false,
                defaultContent: "",
                width: "3%",
                editable: false
            },
            { data: "id", className: "f14cm"},
            { data: "vol_id", className: "f14cm"},
            { data: "name", className: "f14cm"},
            { data: "date", className: "f14cm", 
                render: function (data, type, row) { return data.substr(3,4) },
            },
            { data: {criteria_id: "criteria_id", criteria_name: "criteria_name"},  className: "f14cm",
                render: function (data, type, row) {
                    return !data.criteria_name ? "-" : `${data.criteria_name}(${data.criteria_id})`
                },
            },
            { data: {start_time: "start_time", end_time: "end_time"}, className: "f14cm",
                render: function (data, type, row) {
                    return data.start_time + "~" + data.end_time
                },
            },
            { data: "original_hours", className: "f14cm" },
            { data: "audit_hours", className: "f14cm",
                render: function (data, type, row) {
                return `<input type="number" class="tableInput audit_hours" name="hours" id="h${row.id}" value="${data}">`;
                },
            },
            { data: "note", className: "f14cm",
                render: function (data, type, row) {
                    return `<input type="text" class="tableInput" name="note" id="n${row.id}" value="${data}">`
                },
            },
            { data: "agent_name", className: "f14cm" },
        ],
        buttons: [
            "selectAll",
            "selectNone",
            {
                text: "批次修改",
                className: "btn btn-warning bg-gradient btn-sm shadow-sm notOver",
                name: "batch",
                enabled: false,
                action: function (e, dt, node, config) {
                    batchEdit(this);
                },
            },
            {
                text: "儲存輸入資料",
                className: "btn btn-dark bg-gradient btn-sm shadow-sm notOver",
                name: "manual",
                enabled: false,
                action: function (e, dt, node, config) {
                    manualEdit(this);
                },
            },
            {
                text: "提交",
                className: "btn btn-success bg-gradient btn-sm shadow-sm notOver",
                name: "auditOver",
                enabled: false,
                action: function (e, dt, node, config) {
                    auditOver(this);
                },
            },
        ],
    });
    TB.on( 'select deselect', function () {
        const cnt = TB.rows( { selected: true } ).count();
        TB.buttons( ['.notOver'] ).enable( 
            !i("auditOver").checked && cnt > 0 ? true : false
        );
        // TB.buttons( ['batch:name, manual:name'] ).enable(
        //     auth == "All" && cnt > 0 ? true : false
        // );
    });
 }

function batchEdit(tb) {
    const ids = [];
    tb.rows({ selected: true }).every(function (rowIdx, tableLoop, rowLoop) {
      const d = this.data();
      ids.push(d.id);
    });
    i("hintModalHead").innerHTML = `批次修改`
    i("hintModalBody").innerHTML =`
    <form class="auditForm" id="batchEdit">
        <div class="form-floating">
            <input type="number" class="form-control" id="b_audit_hours" name="audit_hours" required>
            <label for="b_audit_hours">審核時間</label>
        </div>
        <div class="form-floating">
            <input type="text" class="form-control" id="b_note" name="b_note">
            <label for="b_note">備註</label>
        </div>
    </form>`
    hintModal.show()
    i("b_audit_hours").addEventListener("blur", function(){
        this.value = Math.round(this.value * 2) / 2
    })
    toDoSet("確定修改", function(){
        const hours = i("b_audit_hours").value;
        const note = i("b_note").value;
        const data = { ids, hours, note };
        if (!i("b_audit_hours").value) {
            i("b_audit_hours").classList.add("is-invalid")
        } else {
            i("b_audit_hours").classList.remove("is-invalid")
            saveAudit("batch", data)
        }
    });   
}

function manualEdit(tb){
    const selectedRows = tb.rows({ selected: true }).data();
    const data = selectedRows.toArray().map(row => {
        return {
            id: row.id,
            hours: i(`h${row.id}`).value,
            note: i(`n${row.id}`).value
        };
    });
    saveAudit("manual",data);
}

function auditOver(tb){
    const ids = [];
    const invalidIds = []
    tb.rows({ selected: true }).every(function (rowIdx, tableLoop, rowLoop) {
      const d = this.data();
      if( i(`h${d.id}`).value < 0.5 ) return invalidIds.push(d.id)
      ids.push(d.id);
    });
    i("hintModalHead").innerHTML = `提交作業`
    i("hintModalBody").innerHTML =`<h5>請確認資料無誤後再提交。<br/>提交後如欲修改，須請管理員協助。</h5>`
    hintModal.show()
    toDoSet("確定提交", function(){
        const data = {ids, invalidIds}
        saveAudit("over", data);
    });
}

async function saveAudit(type, data){
    try{
        const api = type==="over" ? hoursAPI.toRecords(data) : hoursAPI.hourAudit(type, data)
        const resp = await api
        const res = resp.data
        if (resp.status===200 & res.message==="ok"){
            bodyModal(`<h5>作業完成</h5>`)
            $("#hoursAudit").DataTable().ajax.reload(null, false);
        }else{
            bodyModal(`<h5>系統異常</h5>`)
        }       
    }catch (err){
        console.log(err);
        bodyModal(`<h5>出現異常：${err}</h5>`);
    }
}

