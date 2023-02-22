function i(Nid){return document.getElementById(Nid)}

i("loginForm").addEventListener("submit", async (e)=>{
    try {
        e.preventDefault()
        const resp = await authAPI.login(i("loginID").value, i("loginPW").value)
        const res = await resp.data
        if (await resp.status===200) {
            localStorage.setItem("accessToken", res.accessToken)
            location.href = "/admin/board"
        }
    } catch (error) {
        if (error.response.status===422) return bodyModal("<h4>帳號或密碼錯誤</h4>")
    }
})


window.addEventListener("load", function() {
    if (localStorage.getItem("accessToken")) return location.href = "/admin/board"
})
