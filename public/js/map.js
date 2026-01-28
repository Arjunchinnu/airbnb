
document.addEventListener('DOMContentLoaded', function () {
  console.log("maping is working");

  const map = L.map('map').setView([12.9716, 77.5946], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const apiKey = mapToken;

  const start = [12.9716, 77.5946];
  const end = [13.0358, 77.5970];

  fetch(`https://graphhopper.com/api/1/route?point=${start[0]},${start[1]}&point=${end[0]},${end[1]}&vehicle=car&points_encoded=true&key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const coords = polyline.decode(data.paths[0].points);
      const latLngs = coords.map(([lat, lng]) => [lat, lng]);
      L.polyline(latLngs, { color: 'blue' }).addTo(map);
      map.fitBounds(latLngs);
    })
    .catch(err => {
      console.error('Routing API error:', err);
    });
});

