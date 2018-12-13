const axios = require('axios');
const cancelTokenSource = axios.CancelToken.source();

const checkSiteStatus = async url => {
  if(!url.startsWith('http://') && !url.startsWith('https://'))url = `http://${url}`;
  const timeout = setTimeout(() => {
    cancelTokenSource.cancel('No response after 10 seconds')
  }, 10000);
  try {
    const response = await axios.get(url, {
      cancelToken: cancelTokenSource.token
    })
    console.log(response.data);
    clearTimeout(timeout);
    return { status: 'live', url }
  } catch(error) {
    if(axios.isCancel(error)) {
      console.log('request cancelled', error.message);
    } else {
      clearTimeout(timeout);
      console.log(error);
    }

    return { status: 'down' }
  }
}
const url = 'https://facebook.com';
checkSiteStatus(url).then(result => console.log(result));