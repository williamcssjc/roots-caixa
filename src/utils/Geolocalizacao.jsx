// src/utils/Geolocalizacao.jsx

export const buscarEnderecoPorCep = async (cep) => {
  const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const json = await resp.json();
  return json.erro ? null : json;
};

export const buscarCoordsPorEndereco = async (endereco, apiKey) => {
  const q = encodeURIComponent(`${endereco.logradouro}, ${endereco.localidade}, ${endereco.uf}`);
  const resp = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${q}&key=${apiKey}&countrycode=br&limit=1`);
  const data = await resp.json();
  if (data?.results?.length) {
    const { lat, lng } = data.results[0].geometry;
    return { lat, lon: lng };
  }
  return null;
};

export const calcularDistanciaKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
