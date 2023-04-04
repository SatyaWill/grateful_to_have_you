// 初始化表單資料
const thisYear = new Date().getFullYear() - 1911;
$(document).ready(function () {
  groupHoursTB(thisYear, "NO"); // 參數 年份、組別
  volHoursTB(0);
  aGroupList.forEach((g) => {
    if (auth === "All" || new RegExp(`^(${auth})`).test(g.id))
      i("groupBtn").innerHTML += `
            <input type="radio" class="btn-check" name="group" id="a_${g.id}" value="${g.id}" autocomplete="off">
            <label class="btn btn-light" id="l_${g.id}" for="a_${g.id}">${g.name}</label>`;
  });
  i("n_otherYear").value = thisYear - 2;
});
i("yearStatsBtn").onclick = () => {
  const maxNum = (new Date().getFullYear() - 1911) * 1000 + 300;
  const volId = i("vol_id").value;
  const volIdStatus = volId >= 94001 && volId < maxNum;
  if (volIdStatus) {
    $("#volHours").DataTable().clear();
    $("#volHours").DataTable().destroy(); // 先銷毀原有的 dataTable
    volHoursTB(volId);
  }
};
let group_name = "";
i("periodGroup").addEventListener("change", async function (e) {
  const y = q1('input[name="year"]:checked').value;
  const otherYear = i("n_otherYear").value;
  i("otherYear").disabled = !(otherYear >= 94 && otherYear <= thisYear);
  const year = y === "T" ? thisYear 
      : y === "L" ? thisYear - 1 
      : otherYear < 100 ? `0${otherYear}` : otherYear;

  const group =
    q1('input[name="group"]:checked') !== null
      ? q1('input[name="group"]:checked').value
      : "";
  group_name = i(`l_${group}`).innerHTML;

  if (year && group) {
    $("#groupHours").DataTable().clear();
    $("#groupHours").DataTable().destroy(); // 先銷毀原有的 dataTable
    groupHoursTB(year, group);
  }
});

function volHoursTB(volId) {
  const TB = $("#volHours").DataTable({
    columnDefs: [
      {
        className: "control",
        orderable: false,
        targets: 0,
      },
    ],
    responsive: {
      details: {
        type: "column",
        target: 0,
      },
    },
    autoWidth: true,
    paging: false,
    language: datatableLang,
    ajax: {
      url: `/vol/hourStats/years/${volId}`,
      headers: {
        contentType: "application/json; charset=utf-8",
        Accept: "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
      },
      error: function (xhr, error, thrown) {
        if (xhr.status === 401) return refreshToken(TB, ()=> volHoursTB(volId));
      },
    },
    dom:
      "<'row'<'col 'l>>" +
      "<'row '>" + // 1每頁顯示
      "<'row'<'col-sm-12.mb-2'tr>>" + // 主表
      "<'row'>", //顯示幾頁 第幾頁
    columns: [
      {
        data: null,
        tittle: "",
        orderable: false,
        defaultContent: "",
        width: "3%",
      },
      { data: "name", className: "text-center" },
      { data: "group_name", className: "text-center" },
      {
        data: "start",
        className: "text-center",
        render: function (data, type, row, meta) {
          if (!data) return data;
          return data.replace(/^0*(\d{1,3})(\d{2})(\d{2})$/, "$1.$2.$3");
        },
      },
      {
        data: "end",
        className: "text-center",
        render: function (data, type, row, meta) {
          if (!data) return data;
          return data.replace(/^0*(\d{1,3})(\d{2})(\d{2})$/, "$1.$2.$3");
        },
      },
      { data: "years", className: "text-center" },
      { data: "hrs", className: "text-center" },
      { data: "days", className: "text-center" },
      { data: "hrs/y", className: "text-center" },
      { data: "days/y", className: "text-center" },
    ],
  });
}

function groupHoursTB(year, group) {
  const TB = $("#groupHours").DataTable({
    scrollX: true,
    scrollY: 450,
    columnDefs: [
      {
        sortable: false,
        searchable: false,
        class: "index",
        targets: 0,
      },
    ],
    order: [[1, "asc"]],
    fixedColumns: { left: 2 },
    fixedHeader: true,
    select: true,
    scrollCollapse: true,
    responsive: false,
    autoWidth: true,
    paging: true,
    language: datatableLang,
    ajax: {
      url: `/vol/hourStats/groupMember/${year}/${group}`,
      headers: {
        contentType: "application/json; charset=utf-8",
        Accept: "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
      },
      error: function (xhr, error, thrown) {
        if (xhr.status === 401) return refreshToken(TB, ()=> groupHoursTB(year, group));
      },
    },
    dom:
      "<'row'<'col 'l>>" +
      "<'row '<'col 'B><'col 'f>>" + // 1每頁顯示
      "<'row'<'col-sm-12.mb-2'tr>>" + // 主表
      "<'row'<'col-sm-6'i><'col-sm-6'p>>", //顯示幾頁 第幾頁
    columns: [
      { data: null, className: "text-center" },
      { data: "name", className: "text-center" },
      {
        data: "Jan",
        className: "text-center",
        render: function int(data, type, row) {
          return parseInt(data) === 0 ? "-" : parseInt(data);
        },
      },
      {
        data: "Feb",
        className: "text-center",
        render: function int(data, type, row) {
          return parseInt(data) === 0 ? "-" : parseInt(data);
        },
      },
      {
        data: "Mar",
        className: "text-center",
        render: function int(data, type, row) {
          return parseInt(data) === 0 ? "-" : parseInt(data);
        },
      },
      {
        data: "Apr",
        className: "text-center",
        render: function int(data, type, row) {
          return parseInt(data) === 0 ? "-" : parseInt(data);
        },
      },
      {
        data: "May",
        className: "text-center",
        render: function int(data, type, row) {
          return parseInt(data) === 0 ? "-" : parseInt(data);
        },
      },
      {
        data: "Jun",
        className: "text-center",
        render: function int(data, type, row) {
          return parseInt(data) === 0 ? "-" : parseInt(data);
        },
      },
      {
        data: "Jul",
        className: "text-center",
        render: function int(data, type, row) {
          return parseInt(data) === 0 ? "-" : parseInt(data);
        },
      },
      {
        data: "Aug",
        className: "text-center",
        render: function int(data, type, row) {
          return parseInt(data) === 0 ? "-" : parseInt(data);
        },
      },
      {
        data: "Sep",
        className: "text-center",
        render: function int(data, type, row) {
          return parseInt(data) === 0 ? "-" : parseInt(data);
        },
      },
      {
        data: "Oct",
        className: "text-center",
        render: function int(data, type, row) {
          return parseInt(data) === 0 ? "-" : parseInt(data);
        },
      },
      {
        data: "Nov",
        className: "text-center",
        render: function int(data, type, row) {
          return parseInt(data) === 0 ? "-" : parseInt(data);
        },
      },
      {
        data: "Dec",
        className: "text-center",
        render: function int(data, type, row) {
          return parseInt(data) === 0 ? "-" : parseInt(data);
        },
      },
      {
        data: "total",
        className: "text-center",
        render: function int(data, type, row) {
          return parseInt(data) === 0 ? "-" : parseInt(data);
        },
      },
    ],
    buttons: [
      "selectNone",
      { extend: "showSelected", className: "btn-warning" },
      {
        extend: "print",
        title: `${year}年時數統計(${group_name}組)`,
        text: "列印",
        exportOptions: {
          columns: ":visible:not(:eq(0))",
        },
      },
      {
        extend: "excel",
        title: `${year}年時數統計(${group_name}組)`,
        className: "btn-success",
        exportOptions: {
          columns: ":visible:not(:eq(0))",
        },
      },
    ],
  });
  TB.on("order.dt search.dt", function () {
    TB.column(0, { search: "applied", order: "applied" })
      .nodes()
      .each(function (cell, i) {
        cell.innerHTML = i + 1;
        TB.cell(cell).invalidate("dom");
      });
  }).draw();
}
