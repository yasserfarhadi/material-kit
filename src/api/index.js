const BASE_URL = 'https://jsonplaceholder.typicode.com';

const fetchInstance = (
  routeOrQuery,
  config = {
    method: 'GET',
    headers: {
      'content-type': 'Applicattion/json',
    },
  }
) => fetch(`${BASE_URL}/${routeOrQuery}`, config);

export const getItems = fetchInstance.bind(null, 'posts');

export const deleteItem = (id, cfg = { method: 'DELETE' }) => fetchInstance(`posts/${id}`, cfg);

export const editItem = (id, body, cfg = { method: 'PATCH' }) =>
  fetchInstance(`posts/${id}`, { ...cfg, body: JSON.stringify(body) });
