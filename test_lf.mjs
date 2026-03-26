import https from 'https';

https.get('https://loremflickr.com/800/600/morocco?lock=1', (res) => {
  console.log('Status:', res.statusCode);
  console.log('Location:', res.headers.location);
});
