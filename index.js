const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function extractPatientData(htmlContent) {
    const dom = new JSDOM(htmlContent);
    const table = dom.window.document.querySelector("table");

    if (!table) {
        console.error("Table element not found in the HTML content.");
        return;
    }
    const rows = table.querySelectorAll("tr");
    const allData = [];
    for (const row of rows) {
        if (row.querySelector("th")) {
            continue;
        }
        const cells = row.querySelectorAll("td");
        const rowData = {};
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            const key = [
                "Srno",
                "PatientName",
                "PatientID",
                "Sex",
                "Birthdate",
                "Actions",
            ][i];

            if (key === "Actions") {
                const actionCell = cell.querySelector("div");
                if (actionCell) {
                    const actionLinks = actionCell.querySelectorAll("a");
                    rowData[key] = {
                        hrefs: Array.from(actionLinks, (anchor) => ({
                            href: anchor.getAttribute("href"),
                        })),
                    };
                } else {
                    rowData[key] = "";
                }
            } else {
                rowData[key] = cell.textContent.trim();
            }
        }
        allData.push(rowData);
    }
    return allData;
}

module.exports = extractPatientData
