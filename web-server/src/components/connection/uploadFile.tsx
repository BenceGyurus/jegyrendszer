async function postData(url = '', file:any) {
    const formData = new FormData();
    formData.append('File', file);
    const response = await fetch(url, {
      method: 'POST',
      body: file
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