// Change this to your deployed backend URL when hosting
var API_BASE_URL = "http://localhost:3000";

// ---- Add School ----
async function addSchool() {
  var name = document.getElementById("school-name").value.trim();
  var address = document.getElementById("school-address").value.trim();
  var latitude = document.getElementById("school-lat").value.trim();
  var longitude = document.getElementById("school-lon").value.trim();
  var responseBox = document.getElementById("add-response");
  var btn = document.getElementById("add-school-btn");

  // Basic frontend validation
  if (!name || !address || !latitude || !longitude) {
    showResponse(responseBox, "error", "Please fill in all fields.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Adding...";

  try {
    var response = await fetch(API_BASE_URL + "/addSchool", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        address: address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      })
    });

    var data = await response.json();

    if (data.success) {
      showResponse(responseBox, "success", "✅ " + data.message + "\nID: " + data.data.id);
      // Clear form
      document.getElementById("school-name").value = "";
      document.getElementById("school-address").value = "";
      document.getElementById("school-lat").value = "";
      document.getElementById("school-lon").value = "";
    } else {
      showResponse(responseBox, "error", "❌ " + data.message);
    }

  } catch (err) {
    showResponse(responseBox, "error", "❌ Could not connect to server. Make sure the backend is running.");
  }

  btn.disabled = false;
  btn.textContent = "Add School";
}

// ---- List Schools ----
async function listSchools() {
  var latitude = document.getElementById("user-lat").value.trim();
  var longitude = document.getElementById("user-lon").value.trim();
  var responseBox = document.getElementById("list-response");
  var btn = document.getElementById("list-schools-btn");
  var tableWrapper = document.getElementById("schools-table-wrapper");

  if (!latitude || !longitude) {
    showResponse(responseBox, "error", "Please enter your latitude and longitude.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Searching...";
  tableWrapper.classList.add("hidden");

  try {
    var url = API_BASE_URL + "/listSchools?latitude=" + latitude + "&longitude=" + longitude;
    var response = await fetch(url);
    var data = await response.json();

    if (data.success) {
      responseBox.classList.add("hidden");
      if (data.data.length === 0) {
        showResponse(responseBox, "success", "No schools found in the database.");
      } else {
        renderTable(data.data, data.total);
      }
    } else {
      showResponse(responseBox, "error", "❌ " + data.message);
    }

  } catch (err) {
    showResponse(responseBox, "error", "❌ Could not connect to server. Make sure the backend is running.");
  }

  btn.disabled = false;
  btn.textContent = "Search Schools";
}

// ---- Render Results Table ----
function renderTable(schools, total) {
  var tbody = document.getElementById("schools-tbody");
  var tableWrapper = document.getElementById("schools-table-wrapper");
  var countEl = document.getElementById("school-count");

  tbody.innerHTML = "";
  countEl.textContent = "(" + total + " found)";

  for (var i = 0; i < schools.length; i++) {
    var school = schools[i];
    var row = document.createElement("tr");
    row.innerHTML =
      "<td>" + (i + 1) + "</td>" +
      "<td>" + escapeHtml(school.name) + "</td>" +
      "<td>" + escapeHtml(school.address) + "</td>" +
      "<td>" + school.latitude + "</td>" +
      "<td>" + school.longitude + "</td>" +
      "<td><span class='distance-badge'>" + school.distance_km + " km</span></td>";
    tbody.appendChild(row);
  }

  tableWrapper.classList.remove("hidden");
}

// ---- Use My Location ----
function useMyLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      document.getElementById("user-lat").value = position.coords.latitude.toFixed(6);
      document.getElementById("user-lon").value = position.coords.longitude.toFixed(6);
    },
    function () {
      alert("Could not get your location. Please enter coordinates manually.");
    }
  );
}

// ---- Helper: Show Response ----
function showResponse(el, type, message) {
  el.textContent = message;
  el.className = "response-box " + type;
  el.classList.remove("hidden");
}

// ---- Helper: Escape HTML to prevent XSS ----
function escapeHtml(text) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}
