// 依據登入者顯示nav、登出
haveToken()
navInfo("navUser")
logout("navLogout")
i("n_info").classList.add("itemActive")
i("n_info").getElementsByTagName("h6")[0].classList.add("h6Active")
// 跳轉至各頁面
const navList =["n_info","n_train", "n_hours", "n_input", "n_honor", "n_auth"]
// const navList =["n_info","n_train", "n_shift", "n_hours", "n_input", "n_honor", "n_data", "n_auth"]
navList.forEach(e=>{
    toPage(e)
})

c("logo")[0].addEventListener("click", function() {
    return location.href = "/admin/board"
  })


// 取得複選框選取值，產出array
function toArray(name){
    const array = []
    n(name).forEach((checkbox) => {
        if (checkbox.checked) return array.push(checkbox.value);       
      })
    return array
}