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
<table id="searchResult" class="table table-bordered table-striped nowrap dt-responsive collapsed table-hover custom-tb" 
role="grid" aria-controls="searchResult" 
style="width:100%">
  <thead class="bg-light bg-gradient">
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

