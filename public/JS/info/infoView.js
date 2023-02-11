const aSector = `<option value="A">總務</option>`
const bSector = `<option value="B">法務</option>`
const cSector = `<option value="C">慈務</option>`
const lSector = `<option value="L">啟蒙</option>`
const allSector = aSector+bSector+cSector+lSector
const aGroup = `
<option value="A1">接待</option>
<option value="A2">清潔</option>
<option value="A3">茶水</option>
<option value="A4">香積</option>
<option value="A5">資訊</option>
<option value="A6">安全</option>
<option value="A7">交通</option>`
const bGroup = `
<option value="B1">護七</option>
<option value="B2">法器</option>
<option value="B3">關懷</option>`
const cGroup = `
<option value="C1">書務</option>
<option value="C2">護生</option>
<option value="C3">救濟</option>`
const lGroup = `<option value="L">啟蒙</option>`
const allGroup = aGroup + bGroup + cGroup + lGroup

const infoSearchView = `
<form id="info1Form" class="align-items-center">
<div class="row row-cols-auto g-2 align-items-center">
    <!--姓名-->
    <label class="col-form-label text-sm-end" style="width:64px;">姓名</label>
    <div class="col-xs-3">
        <input id="iName" name="name" type="text" class="form-control">
    </div>
    <!--性別-->
    <div class="col ">
        <select id="iGender" name="gender" class="form-select form-select-sm lh-1" aria-label=".form-select-sm example">
            <option value="">性別</option>
            <option value="男">男</option>
            <option value="女">女</option>
        </select>
    </div>
    <!--收編狀態-->
    <div class="col ">
        <select id="iStatus" name="status" class="form-select form-select-sm lh-1" aria-label=".form-select-sm example">
            <option value="Y">收編</option>
            <option value="N">離隊</option>
            <option value="D">往生</option>
        </select>
    </div>
    <!--部門別-->
    <div class="col-xs-3">
        <select id="iSector" name="sector" class="form-select form-select-sm lh-1" aria-label=".form-select-sm example">
            <option value="">部門</option>
            ${allSector}
        </select>
    </div>
    <!--組別-->
    <div class="col ">
        <select id="iGroup" name="group" class="form-select form-select-sm lh-1" aria-label=".form-select-sm example">
            <option value="">組別</option>    
            ${allGroup}
        </select>
    </div>
    <!--小組成員-->
    <div class="col ">
        <select id="iGstatus" name="member" class="form-select form-select-sm lh-1" aria-label=".form-select-sm example">
            <option value="">小組進階</option>
            <option value="組長">組長</option>
            <option value="0">退出組員</option>
        </select>
    </div>
</div>
<div class="row row-cols-auto g-2 align-items-center">
    <!--志工編號-->
    <label class="col-form-label text-sm-end" style="width:64px;">志工編號</label>
    <div class="col-xs-3">
        <input id="iVolID" name="volID" type="text" class="form-control">
    </div>
    <!--加入年度-->
    <label class="col-form-label">加入年度</label>
    <div class="col-xs-2">
        <input id="iYearS" name="joinYS" type="number" class="form-control" style="width:60px;">
    </div>
    <label class="col-form-label">~</label>
    <div class="col-xs-2">
        <input id="iYearE" name="joinYE" type="number" class="form-control" style="width:60px;">
    </div>
</div>
<div class="row row-cols-auto g-2 align-items-center">
    <!--身分證-->
    <label class="col-form-label text-sm-end" style="width:64px;">身分證</label>
    <div class="col-xs-3">
        <input id="iID" name="idNum" type="text" class="form-control">
    </div>
    <!--年齡區間-->
    <label class="col-form-label">年齡區間</label>
    <div class="col-xs-2">
        <input id="iAgeS" name="ageS" type="number" class="form-control" style="width:60px;">
    </div>
    <label class="col-form-label">~</label>
    <div class="col-xs-2">
        <input id="iAgeE" name="ageE" type="number" class="form-control" style="width:60px;">
    </div>
</div>
<button type="button" class="badge bg-primary bg-gradient mt-2 shadow-sm" id="isubmit">送出</button>
<button type="button" class="badge bg-secondary bg-gradient mt-2 shadow-sm" id="iclear">清除條件</button>
<button type="button" class="badge bg-success bg-gradient mt-2 shadow-sm" id="iexcel">匯出Excel</button>
</form>`

const infoOutcomeView = `
<table id="searchResult" class="table table-bordered nowrap table-striped  dt-responsive collapsed table-hover" 
role="grid" aria-controls="searchResult" 
style="width:100%">
  <thead class="bg-light bg-gradient">
    <tr>
        <th class="th-sm"></th>
        <th class="th-sm"></th>
        <th class="th-sm"></th>
        <th class="th-sm">志工編號</th>
        <th class="th-sm">姓名</th>
        <th class="th-sm">性別</th>
        <th class="th-sm">生日</th>
        <th class="th-sm">電話</th>
        <th class="th-sm">加入日</th>
        <th class="th-sm">狀態</th>
        <th class="th-sm">保險狀態</th>
        <th class="th-sm text-center">組別</th>
    </tr>
  </thead>
</table>`

const datatableLang = {
	"sProcessing":   "處理中...",
	"sLengthMenu":   "每頁顯示 _MENU_ 項結果",
	"sZeroRecords":  "沒有符合的結果",
	"sInfo":         "顯示第 _START_ 至 _END_ 項結果，共 _TOTAL_ 項",
	"sInfoEmpty":    "顯示第 0 至 0 項結果，共 0 項",
	"sInfoFiltered": "(從 _MAX_ 項結果中過濾)",
	"sInfoPostFix":  "",
	"sSearch":       "搜尋:",
	"sUrl":          "",
	"sEmptyTable":     "沒有可用的資料",
	"sLoadingRecords": "載入中...",
	"sInfoThousands":  ",",
	"oPaginate": {
		"sFirst":    "第一頁",
		"sPrevious": "上一頁",
		"sNext":     "下一頁",
		"sLast":     "最後一頁"
	},
	"oAria": {
		"sSortAscending":  ": 升冪排列",
		"sSortDescending": ": 降冪排列"
	},
    "select": {
        "rows": {
            "_": "已選取 %d 筆資料",
            "0": "",
            "1": "已選取 %d 筆資料"
        }
    },
    "buttons": {
        "selectAll": "全選",
        "selectNone":"取消全選",
        "delete":"刪除"
    }
}
