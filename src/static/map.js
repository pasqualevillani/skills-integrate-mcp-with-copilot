// map.js - Handles map rendering and activity markers

let map;
let markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 32.8801, lng: -117.2340 }, // Example: UCSD
    zoom: 13,
  });
  loadActivityMarkers();
}

async function loadActivityMarkers() {
  // Fetch activities from the backend
  const response = await fetch("/activities");
  const activities = await response.json();

  // Remove old markers
  markers.forEach((m) => m.setMap(null));
  markers = [];

  Object.entries(activities).forEach(([name, details]) => {
    if (details.location && details.location.lat && details.location.lng) {
      const marker = new google.maps.Marker({
        position: { lat: details.location.lat, lng: details.location.lng },
        map,
        title: name,
      });
      const infoWindow = new google.maps.InfoWindow({
        content: `<h4>${name}</h4><p>${details.description}</p><p><strong>Schedule:</strong> ${details.schedule}</p>`
      });
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
      markers.push(marker);
    }
  });
}

window.initMap = initMap; // Google Maps callback
