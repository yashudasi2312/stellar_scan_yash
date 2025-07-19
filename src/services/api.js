export async function fetchCountry(lat, lon) {
  try {
    // const res = await fetch(`https://9a0a2184596d.ngrok-free.app/api/country?lat=${lat}&lon=${lon}`);
    const res = await fetch(`http://localhost:8080/api/country`);
    if (!res.ok) throw new Error("Failed to fetch country");

    const text = await res.text();
    console.log("🌍 Country API response:", text);

    if (text.startsWith("<!DOCTYPE html")) {
      throw new Error("Received HTML instead of country");
    }

    return text;
  } catch (err) {
    console.error("❌ Error fetching country from backend:", err);
    return "Unknown";
  }
}

// http://localhost:8080/api/country?lat=${lat}&lon=${lon}
// http://localhost:8080/api/country
