// api.js

// Call your backend to get country from lat/lon
export async function fetchCountry(lat, lon) {
  try {
    const res = await fetch("https://9a0a2184596d.ngrok-free.app/api/country", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ latitude: lat, longitude: lon })
    });

    if (!res.ok) throw new Error("Failed to fetch country");
    return await res.text();
  } catch (err) {
    console.error("❌ Error fetching country from backend:", err);
    return "Unknown";
  }
}
