const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTTYjzHNzQuf47_ruuf8zEPO5hTYkUFBOA8SY7IpTqch5r_879YoNHn_orTt0WjMS44ECdG-2Zn0L5C/pub?output=csv";

let data = [];

async function fetchData() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();
  const rows = text.split('\n').slice(1).map(row => row.split(','));
  data = rows;

  // Find latest date from RECEIVED column (index 2)
  const dates = rows.map(r => new Date(r[2])).filter(d => !isNaN(d));
  const latestDate = new Date(Math.max.apply(null, dates));
  document.getElementById("lastUpdated").innerText = `📅 Last Updated: ${latestDate.toDateString()}`;
}

function searchIMEI() {
  const imei = document.getElementById("imeiInput").value.trim();
  const resultDiv = document.getElementById("result");
  const found = data.find(row => row[4] === imei);

  if (found) {
    resultDiv.innerHTML = `
      <strong>📦 TAG:</strong> ${found[0]}<br>
      <strong>✅ ENTERED IN AM:</strong> ${found[1]}<br>
      <strong>📅 RECEIVED:</strong> ${found[2]}<br>
      <strong>🔗 USPS Tracking:</strong> <a href="https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${found[3]}" target="_blank">${found[3]}</a><br>
      <strong>🔍 IMEI:</strong> ${found[4]}<br>
      <strong>📱 Device:</strong> ${found[5]}<br>
      <strong>🛠️ Condition:</strong> ${found[6]}<br>
      <strong>📝 Notes:</strong> ${found[7]}
    `;
  } else {
    resultDiv.innerHTML = `<span style="color:red;">❌ IMEI not found. Please check and try again.</span>`;
  }
}

fetchData();
