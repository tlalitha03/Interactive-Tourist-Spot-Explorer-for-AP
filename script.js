// Initialize the map with coordinates centered on Andhra Pradesh
const map = L.map('map').setView([15.9129, 79.7400], 7);

// Set OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  minZoom: 6,
  maxZoom: 10
}).addTo(map);

// Coordinates for districts in Andhra Pradesh
const districts = {
  anantapur: { coords: [14.68, 77.59], name: 'Anantapur' },
  chittoor: { coords: [13.22, 79.10], name: 'Chittoor' },
  eastGodavari: { coords: [17.16, 82.21], name: 'East Godavari' },
  guntur: { coords: [16.31, 80.43], name: 'Guntur' },
  kurnool: { coords: [15.83, 78.04], name: 'Kurnool' },
  nellore: { coords: [14.44, 79.99], name: 'Nellore' },
  prakasam: { coords: [15.33, 79.63], name: 'Prakasam' },
  visakhapatnam: { coords: [17.68, 83.21], name: 'Visakhapatnam' },
  westGodavari: { coords: [16.88, 81.56], name: 'West Godavari' }
};

// Add markers for districts
Object.entries(districts).forEach(([key, district]) => {
  const marker = L.marker(district.coords).addTo(map);
  marker.bindPopup(`<b>${district.name}</b><br>Click to view spots.`).on('click', () => {
    loadTouristSpots(key);
  });
});

// Function to load tourist spots for the selected district
function loadTouristSpots(districtKey) {
  console.log(`Loading spots for district: ${districtKey}`);
  fetch('data.json')
    .then((response) => {
      if (!response.ok) throw new Error('Failed to load data.');
      return response.json();
    })
    .then((data) => {
      const spots = data[districtKey];
      const container = document.getElementById('spots-container');
      container.innerHTML = ''; // Clear existing content

      // Update the heading dynamically
      const heading = document.getElementById('tourist-spots-heading');
      heading.innerHTML = `Tourist Spots of ${districts[districtKey].name}`;

      if (spots && spots.length > 0) {
        spots.forEach((spot) => {
          const spotDiv = document.createElement('div');
          spotDiv.className = 'spot';
          spotDiv.innerHTML = `
            <img src="${spot.image}" alt="${spot.name}" onerror="this.src='images/placeholder.jpg'">
            <h3>${spot.name}</h3>
            <p>${spot.description}</p>
          `;
          container.appendChild(spotDiv);
        });

        // Display the Back to Map button
        document.getElementById('back-button').style.display = 'block';

        // Hide the map section and show the tourist spots section
        document.getElementById('map').style.display = 'none';
        document.getElementById('tourist-spots').style.display = 'block';
      } else {
        container.innerHTML = '<p>No tourist spots available for this district.</p>';
      }
    })
    .catch((error) => console.error('Error loading data:', error));
}

// Add click event for Back to Map button
document.getElementById('back-button').addEventListener('click', function () {
  // Hide the tourist spots section and show the map section
  document.getElementById('map').style.display = 'block';
  document.getElementById('tourist-spots').style.display = 'none';

  // Hide the Back to Map button
  this.style.display = 'none';
});
