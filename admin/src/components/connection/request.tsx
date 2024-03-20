async function postData(url = '', data = {}) {
    const response = await fetch(`/api/v1${url}`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    let responseData;
    try{
      responseData = response.json();
    }
    catch{
      responseData = response; 
    }
    console.log(responseData);
    if (response.status >= 200 && response.status < 300){
      return responseData;
    }
    else{
      return {error: true, responseData : responseData};
    }

  }

export default postData;