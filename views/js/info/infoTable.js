async function updateTable() {
  const currentPage = $('#searchResult').DataTable().page();
  // 重新加載當前頁面的表格
  const infoTable = $('#searchResult').DataTable();
  await infoTable.ajax.reload(null, false);
  // 重新設置頁碼
  infoTable.page(currentPage).draw(false);
}



  