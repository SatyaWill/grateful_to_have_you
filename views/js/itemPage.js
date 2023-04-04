// 依據登入者顯示nav、登出
haveToken()
navInfo("navUser")
logout("navLogout")
navItemActive(new URL(location.href).pathname.split("/")[2])
// 跳轉至各頁面
const navList =["n_info", "n_stats", "n_audit", "n_auth", "n_checkin"]
// const navList =["n_info","n_train", "n_shift", "n_hours", "n_input", "n_honor", "n_data", "n_auth"]
navList.forEach(e=>{
    toPage(e)
})

c("logo")[0].addEventListener("click", function() {
    return location.href = "/admin/board"
})

function navItemActive(path){
  i("n_"+path).classList.add("itemActive")
  i("n_"+path).getElementsByTagName("h6")[0].classList.add("h6Active")
}

// 取得複選框選取值，產出array
function toArray(name){
    const array = []
    n(name).forEach((checkbox) => {
        if (checkbox.checked) return array.push(checkbox.value);       
      })
    return array
}

const RE = {
  name: /^[^\s]{2,30}$/,
  gender: /^(男|女)$/,
  id: /^[A-Z][1-2]\d{8}$/,
  agent_id: /^[^\s]{3,30}$/,
  date: /^[01][0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/,
  job_category: /^(01|02|03|04|05|06|99)$/,
  education: /^(01|02|03|05|07|99)$/,
  bit: /^(0|1)$/,
  status: /^(Y|N|D)$/,
  L20: /^.{1,20}$/,
  L30: /^.{1,30}$/,
  L85: /^.{1,85}$/,
  time: /^(?:[0-9]|[01][0-9]|2[0-3])(?:[0-5][0-9])$/,
}


const iSectorList = [
  {id:"A", name:"A部"},
  {id:"B", name:"B部"},
  {id:"C", name:"C部"},
  {id:"L", name:"L班"}
];

const iGroupList = [
  {sector:"A",id:"A1", name:"迎賓"},
  {sector:"A",id:"A2", name:"衛生"},
  {sector:"A",id:"A3", name:"茶點"},
  {sector:"A",id:"A4", name:"廚務"},
  {sector:"A",id:"A5", name:"資料"},
  {sector:"A",id:"A6", name:"安全"},
  {sector:"A",id:"A7", name:"交通"},
  {sector:"B",id:"B1", name:"秩序"},
  {sector:"B",id:"B2", name:"儀隊"},
  {sector:"B",id:"B3", name:"訪視"},
  {sector:"C",id:"C1", name:"圖書"},
  {sector:"C",id:"C2", name:"生態"},
  {sector:"C",id:"C3", name:"接濟"},
  {sector:"L",id:"L", name:"啟迪"},
]

const vGroupList = [
  {id:"A1a", name:"迎賓-A"},
  {id:"A1b", name:"迎賓-B"},
  {id:"A2", name:"衛生"},
  {id:"A3", name:"茶點"},
  {id:"A4", name:"廚務"},
  {id:"A5", name:"資料"},
  {id:"A6", name:"安全"},
  {id:"A7", name:"交通"},
  {id:"B1", name:"秩序"},
  {id:"B2", name:"儀隊"},
  {id:"B2a", name:"儀隊-A"},
  {id:"B2b", name:"儀隊-B"},
  {id:"B3", name:"訪視"},
  {id:"C1", name:"圖書"},
  {id:"C2", name:"生態"},
  {id:"C3", name:"接濟"},
  {id:"L", name:"啟迪"},    
]

const aGroupList = [
  {id:"A1a", name:"迎賓-A"},
  {id:"A1b", name:"迎賓-B"},
  {id:"A2", name:"衛生"},
  {id:"A3", name:"茶點"},
  {id:"A4", name:"廚務"},
  {id:"A5", name:"資料"},
  {id:"A6", name:"安全"},
  {id:"A7", name:"交通"},
  {id:"B1", name:"秩序"},
  {id:"B2", name:"儀隊"},
  {id:"B3", name:"訪視"},
  {id:"C1", name:"圖書"},
  {id:"C2", name:"生態"},
  {id:"C3", name:"接濟"},
  {id:"L", name:"啟迪"},   
]

const authList = [
  {id:'All', name: '全部'},
  {id:'A', name: 'A部'},
  {id:'B', name: 'B部'},
  {id:'C', name: 'C部'},
  {id:'L', name: 'L班'},
  {id:'A1', name: '迎賓'},
  {id:'A2', name: '衛生'},
  {id:'A3', name: '茶點'},
  {id:'A4', name: '廚務'},
  {id:'A5', name: '資料'},
  {id:'A6', name: '安全'},
  {id:'A7', name: '交通'},
  {id:'B1', name: '秩序'},
  {id:'B2', name: '儀隊'},
  {id:'B3', name: '訪視'},
  {id:'C1', name: '圖書'},
  {id:'C2', name: '生態'},
  {id:'C3', name: '接濟'},
  {id:'public', name: '簽到退'},
]

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
    selectNone: "取消選擇",
    delete: "刪除",
    showSelected: "只顯示所選",
    excel: "下載excel",
  },
};