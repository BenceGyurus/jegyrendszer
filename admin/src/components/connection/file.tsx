async function postFile(url = '', data = {}, redirect = '') {
    const response = await fetch(`/api/v1${url}`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    console.log(response);
    if (response.status === 200){
        let blob = await response.blob();
        var file = window.URL.createObjectURL(blob);
        window.location.assign(file);
        if (redirect){
            setTimeout(()=>{
                window.location.pathname = redirect;
            },2000);
        }
        return {error : false, message : "Sikeres vásárlás, a jegyek letöltés hamarosan elindul"};
    }
    try{
        let responseData = await response.json();
        if (responseData){
            return {error : true, message : responseData.message ? responseData.message : "Hiba történt a letöltés közben"};
        }
    }
    catch{
        return {error : true, message : "Váratlan hiba történt a letöltés közben"};
    }
}

export default postFile;