import Server from '../server/server';

async function postData(url = '', data = {}) {
  let response = await fetch(`https://${Server().url}${Server().api}${url}`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  let responseData;
  try {
    responseData = await response.json();
  } catch {
    responseData = response;
  }

  return responseData;
}

export default postData;
