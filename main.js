import {
  read,
  utils,
} from "https://cdn.sheetjs.com/xlsx-0.18.8/package/xlsx.mjs";

window.addEventListener("DOMContentLoaded", () => {
  fetch("./inventory_test_data.xlsx")
    .then((res) => {
      return res.arrayBuffer();
    })
    .then((res) => {
      let workbook = read(new Uint8Array(res), {
        type: "array",
      });

      workbook.SheetNames.forEach((sheetName) => {
        let row = utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        let json = JSON.stringify(row);
        let obj = JSON.parse(json);
        obj.forEach((element) => {
          if (element["Item_Name"] == undefined) return;

          let badge = document.createElement("span");
          let item = document.createElement("li");
          let inventory = Math.random() * 500;
          let total = element["Total"];

          badge.classList.add("badge", "badge-stock");
          item.classList.add("list-group-item");
          item.innerText = element["Item_Name"];

          if (inventory <= total) {
            badge.classList.add("bg-danger");
            badge.innerText = "Out of Stock";
          } else if (inventory - total < 10) {
            badge.classList.add("bg-warning");
            badge.innerText = "Low Stock";
          } else {
            badge.classList.add("bg-success");
            badge.innerText = "In Stock";
          }

          item.appendChild(badge);
          document.getElementById("item-list").appendChild(item);
        });
      });
    });
});
