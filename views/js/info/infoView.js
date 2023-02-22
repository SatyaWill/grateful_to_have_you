const iSectorList = [
    {id:"A", name:"總務"},
    {id:"B", name:"法務"},
    {id:"C", name:"慈務"},
    {id:"L", name:"啟蒙"}
 ];

const iGroupList = [
    {sector:"A",id:"A1", name:"接待"},
    {sector:"A",id:"A2", name:"清潔"},
    {sector:"A",id:"A3", name:"茶水"},
    {sector:"A",id:"A4", name:"香積"},
    {sector:"A",id:"A5", name:"資訊"},
    {sector:"A",id:"A6", name:"安全"},
    {sector:"A",id:"A7", name:"交通"},
    {sector:"B",id:"B1", name:"護七"},
    {sector:"B",id:"B2", name:"法器"},
    {sector:"B",id:"B3", name:"關懷"},
    {sector:"C",id:"C1", name:"書務"},
    {sector:"C",id:"C2", name:"護生"},
    {sector:"C",id:"C3", name:"救濟"},
    {sector:"L",id:"L", name:"啟蒙班"},
]

const vGroupList = [
    {id:"A1a", name:"接待-辦公室"},
    {id:"A1b", name:"接待-紀念堂"},
    {id:"A2", name:"清潔"},
    {id:"A3", name:"茶水"},
    {id:"A4", name:"香積"},
    {id:"A5", name:"資訊"},
    {id:"A6", name:"安全"},
    {id:"A7", name:"交通"},
    {id:"B1", name:"護七"},
    {id:"B2", name:"法器"},
    {id:"B2a", name:"法器-蔡老師"},
    {id:"B2b", name:"法器-何老師"},
    {id:"B3", name:"關懷"},
    {id:"C1", name:"書務"},
    {id:"C2", name:"護生"},
    {id:"C3", name:"救濟"},
    {id:"L", name:"啟蒙班"},    
]

const infoSearchView = `
<form id="info1Form" class="align-items-center">
<div class="row row-cols-auto g-2 align-items-center">
    <!--姓名-->
    <label class="col-form-label text-sm-end" style="width:64px;">姓名</label>
    <div class="col-xs-3">
        <input id="i_name" name="name" type="text" class="form-control">
    </div>
    <!--性別-->
    <div class="col ">
        <select id="i_gender" name="gender" class="form-select form-select-sm lh-1" aria-label=".form-select-sm example">
            <option value="">性別</option>
            <option value="男">男</option>
            <option value="女">女</option>
        </select>
    </div>
    <!--收編狀態-->
    <div class="col ">
        <select id="i_status" name="status" class="form-select form-select-sm lh-1" aria-label=".form-select-sm example">
            <option value="Y">收編</option>
            <option value="N">離隊</option>
        </select>
    </div>
    <!--部門別-->
    <div class="col-xs-3">
        <select id="i_sector" name="sector" class="form-select form-select-sm lh-1" aria-label=".form-select-sm example">
            <option value="">部門</option>
        </select>
    </div>
    <!--組別-->
    <div class="col ">
        <select id="i_group" name="group" class="form-select form-select-sm lh-1" aria-label=".form-select-sm example">
            <option value="">組別</option>    
        </select>
    </div>
    <!--小組成員-->
    <div class="col ">
        <select id="i_member" name="member" class="form-select form-select-sm lh-1" aria-label=".form-select-sm example">
            <option value="">小組進階</option>
            <option value="組長">組長</option>
            <option value="退出">退出組員</option>
        </select>
    </div>
</div>
<div class="row row-cols-auto g-2 align-items-center">
    <!--身分證-->
    <label class="col-form-label text-sm-end" style="width:64px;">身分證</label>
    <div class="col-xs-3">
        <input id="i_id_num" name="id_num" type="text" class="form-control">
    </div>
    <!--年齡區間-->
    <label class="col-form-label">年齡區間</label>
    <div class="col-xs-2">
        <input id="i_ageS" name="ageS" type="number" class="form-control" style="width:60px;">
    </div>
    <label class="col-form-label">~</label>
    <div class="col-xs-2">
        <input id="i_ageE" name="ageE" type="number" class="form-control" style="width:60px;">
    </div>
    <!--生日-->
    <label class="col-form-label text-sm-end">生日</label>
    <div class="col-xs-3">
        <input id="i_birthday" name="birthday" type="text" class="form-control" placeholder="格式0880101">
    </div>
</div>
<div class="row row-cols-auto g-2 align-items-center">
    <!--志工編號-->
    <label class="col-form-label text-sm-end" style="width:64px;">志工編號</label>
    <div class="col-xs-3">
        <input id="i_vol_id" name="vol_id" type="text" class="form-control">
    </div>
    <!--加入年度-->
    <label class="col-form-label">加入年度</label>
    <div class="col-xs-2">
        <input id="i_joinYS" name="joinYS" type="number" class="form-control" style="width:60px;">
    </div>
    <label class="col-form-label">~</label>
    <div class="col-xs-2">
        <input id="i_joinYE" name="joinYE" type="number" class="form-control" style="width:60px;">
    </div>
</div>
<button type="button" class="badge bg-primary bg-gradient mt-2 shadow-sm" id="isubmit">查詢</button>
<button type="button" class="badge bg-secondary bg-gradient mt-2 shadow-sm" id="iclear">清除條件</button>
</form>`;

const infoOutcomeView = `
<table id="searchResult" class="table table-bordered table-striped nowrap dt-responsive collapsed table-hover" 
role="grid" aria-controls="searchResult" 
style="width:100%">
  <thead class="bg-light bg-gradient" id="searchResult_td">
    <tr>
        <th class="th-sm"data-priority="1">操作</th>
        <th class="th-sm"></th>
        <th class="th-sm" data-priority="3">編號</th>
        <th class="th-sm" data-priority="1">姓名</th>
        <th class="th-sm" data-priority="9">性別</th>
        <th class="th-sm" data-priority="5">生日</th>
        <th class="th-sm" data-priority="2">電話</th>
        <th class="th-sm" data-priority="8">加入日</th>
        <th class="th-sm" data-priority="7">狀態</th>
        <th class="th-sm" data-priority="6">保險狀態</th>
        <th class="th-sm" data-priority="4">組別</th>
    </tr>
  </thead>
</table>`;

const datatableLang = {
  sProcessing: "處理中...",
  sLengthMenu: "每頁顯示 _MENU_ 項結果",
  sZeroRecords: "沒有符合的結果",
  sInfo: "顯示第 _START_ 至 _END_ 項結果，共 _TOTAL_ 項",
  sInfoEmpty: "顯示第 0 至 0 項結果，共 0 項",
  sInfoFiltered: "(從 _MAX_ 項結果中過濾)",
  sInfoPostFix: "",
  sSearch: "搜尋:",
  sUrl: "",
  sEmptyTable: "沒有可用的資料",
  sLoadingRecords: "載入中...",
  sInfoThousands: ",",
  oPaginate: {
    sFirst: "第一頁",
    sPrevious: "上一頁",
    sNext: "下一頁",
    sLast: "最後一頁",
  },
  oAria: {
    sSortAscending: ": 升冪排列",
    sSortDescending: ": 降冪排列",
  },
  select: {
    rows: {
      _: "已選取 %d 筆資料",
      0: "",
      1: "已選取 %d 筆資料",
    },
  },
  buttons: {
    selectAll: "全選",
    selectNone: "取消全選",
    delete: "刪除",
  },
};