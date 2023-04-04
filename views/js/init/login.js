function i(Nid){return document.getElementById(Nid)}

window.addEventListener("load", function() {
    if (localStorage.getItem("accessToken")) 
        return location.href = "/admin/board"
})

i("loginForm").addEventListener("submit", async (e)=>{
    try {
        e.preventDefault()
        const resp = await authAPI.login(i("loginID").value, i("loginPW").value)
        const res = await resp.data
        if (resp.status===200) {
            localStorage.setItem("accessToken", res.accessToken)
            localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
            location.href = "/admin/board"
        }
    } catch (error) {
        console.log(error);
        if (error.response.status===422) return bodyModal("<h4>帳號或密碼錯誤</h4>")
    }
})

