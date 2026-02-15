# Compare Frontend

A React + Bootstrap frontend that connects to your Flask backend:

- Search with filters (platform, price range, rating) and sort
- View product cards including image, brand, description, price, rating
- Compare view with platform-colored Buy buttons and logos

## Setup

```bash
cd compare-frontend
npm install
npm start
```

The app expects your API at `http://localhost:5001` with endpoints like:
- `GET /api/search?q=...&platform=...&min_price=...&max_price=...&rating=...&sort=...`

You can change the API base URL inside the fetch calls if needed.
