export async function fetchTLE(noradId) {
  const url = `https://tle.ivanstanojevic.me/api/tle/${noradId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("TLE fetch failed");

    const data = await response.json();
    return [data.line1, data.line2];
  } catch (err) {
    console.error("Error fetching TLE:", err);
    throw err;
  }
}