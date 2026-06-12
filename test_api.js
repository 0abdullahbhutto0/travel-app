

const API_KEY = 'AIzaSyAg67lUp2R6OD2djN8NnbJmBnXfkELFf7g';
const query = 'pizza';

async function test() {
  const response = await fetch(`https://places.googleapis.com/v1/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.types'
    },
    body: JSON.stringify({ textQuery: query })
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
