// src/utils/Geolocalizacao.jsx

export const buscarEnderecoPorCep = async (cep) => {
  const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const json = await resp.json();

  if (json.erro) return null;

  return {
    bairro: json.bairro,
    cidade: json.localidade,
    estado: json.uf,
    logradouro: json.logradouro || "", // fallback se não vier
  };
};

export const buscarCoordsPorEndereco = async (enderecoString, apiKey) => {
  const q = encodeURIComponent(enderecoString);
  const resp = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${q}&key=${apiKey}&countrycode=br&limit=1`);
  const data = await resp.json();
  console.log("Geocoding:", enderecoString, "=>", data?.results?.[0]?.geometry);

  if (data?.results?.length) {
    const { lat, lng } = data.results[0].geometry;
    return { lat, lon: lng };
  }
  return null;
};


export function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const toRad = (graus) => (graus * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c;

  return distancia;
}
const d = calcularDistanciaKm(-23.17944, -45.88694, -23.17944, -45.88694);
console.log("🧪 Distância teste:", d); // Deve dar 0

