// 依據登入者顯示nav、跳轉至各頁面、登出
haveToken()
navInfo("boardUser")
logout("boardLogout")

const boardList = ["i_info", "i_stats", "i_audit", "i_auth", "i_checkin"]
// const boardList =["i_info","i_train", "i_shift", "i_hours", "i_input", "i_honor", "i_data", "i_auth"]
boardList.forEach(e=>{
    toPage(e)
})

i("board_logo").addEventListener("click", function() {
    console.log(111);
    return location.href = "/"
})



