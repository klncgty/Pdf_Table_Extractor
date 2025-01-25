export default async (req, context) => {
  try {
    // Frontend'den gelen isteği al
    const path = req.url.replace("/.netlify/functions/proxy/", "/"); // URL'yi düzenle
    const apiUrl = `https://pdf-table-processor.onrender.com${path}`;

    // Backend'e isteği ilet
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"],  // Frontend'den gelen Content-Type'ı ilet
        "Authorization": req.headers["authorization"],  // Frontend'den gelen Authorization header'ını ilet
      },
      body: req.body,  // İstek gövdesini ilet
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
    console.error("Proxy hatası:", error);
    return new Response(JSON.stringify({ 
      error: "Proxy hatası", 
      details: error.message 
    }), { 
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://pdftableprocessor.netlify.app",
        "Content-Type": "application/json",
      },
    });
  }
};
