async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(data)
    });
    let responseData;
    try{
      responseData = response.json();
    }
    catch{
      responseData = response; 
    }
    if (response.status >= 200 && response.status < 300){
      return responseData;
    }
    else{
      return {error: true, responseData : responseData};
    }

  }

export default postData;