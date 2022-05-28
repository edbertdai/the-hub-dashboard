import {
  read,
  utils,
} from "https://cdn.sheetjs.com/xlsx-0.18.8/package/xlsx.mjs";

window.addEventListener("DOMContentLoaded", () => {
  // Populate dashboard from spreadsheet
  fetch("./inventory_test_data.xlsx")
    .then((res) => {
      return res.arrayBuffer();
    })
    .then((res) => {
      let workbook = read(new Uint8Array(res), {
        type: "array",
      });

      // Check each sheet for data
      workbook.SheetNames.forEach((sheetName) => {
        // Parse rows into JSON
        let row = utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        let json = JSON.stringify(row);
        let obj = JSON.parse(json);

        // Create dashboard row for each spreadsheet row
        obj.forEach((element) => {
          // Check spreadsheet row validity
          if (element["Item_Name"] == undefined) return;

          // Create dashboard row
          let item = document.createElement("li");

          // Create stock indicator badge
          let badge = document.createElement("span");
          badge.classList.add("badge", "badge-stock");
          item.classList.add("list-group-item");
          item.innerText = element["Item_Name"];

          // Get inventory level and total requests
          let inventory = Math.random() * 500;
          let total = element["Total"];

          // Modify badge based on stock level
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

          // Append completed dashboard row
          item.appendChild(badge);
          document.getElementById("item-list").appendChild(item);
        });
      });
    });

  // Search box functionality
  document
    .getElementById("search-hygiene")
    .addEventListener("input", (event) => {
      // Get dashboard rows data
      let items = Array.from(document.getElementById("item-list").children);
      // Get lowercase input text without spaces
      let input = event.target.value.toLowerCase().replace(/\s+/g, "");

      // Check each row and hide non-matching to input
      items.forEach((element) => {
        // Get item name from row as lowercase without spaces
        let itemName = element.childNodes[0].data
          .toLowerCase()
          .replace(/\s+/g, "");

        // Hide row if item name non-matching to input
        if (itemName.includes(input)) {
          element.style.display = "block";
        } else {
          element.style.display = "none";
        }
      });
    });
});
