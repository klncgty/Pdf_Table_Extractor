// netlify/functions/proxy.js
export default async (req, context) => {
  try {
    // Frontend'den gelen isteği al
    const path = req.url.replace("/.netlify/functions/proxy/", "/"); // URL'yi düzenle
    const apiUrl = `https://pdf-table-processor.onrender.com${path}`;

    // Backend'e isteği ilet
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Backend'den gelen yanıtı frontend'e ilet
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "https://pdftableprocessor.netlify.app",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
