const BASE_URL = "https://api.themoviedb.org/3";

const options = {
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
};

async function request(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error("TMDb request failed");
  }

  return response.json();
}

const tmdb = {
  search(query) {
    return request(`/search/multi?query=${encodeURIComponent(query)}`);
  },

  details(id, type) {
    return request(`/${type}/${id}?append_to_response=credits`);
  },
};

export default tmdb;