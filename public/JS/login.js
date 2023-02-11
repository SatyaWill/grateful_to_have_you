function i(Nid){return document.getElementById(Nid)}

i("loginForm").addEventListener("submit", async (e)=>{
    try {
        e.preventDefault()
        const resp = await authAPI.login(i("loginID").value, i("loginPW").value)
        const res = await resp.data
        if (await resp.status===200) {
            await localStorage.setItem("accessToken", res.accessToken)
            console.log(localStorage);
            location.href = "/admin/board"
        }
    } catch (error) {
        if (error.response.status===422) return alert("帳號或密碼錯誤")
    }
})