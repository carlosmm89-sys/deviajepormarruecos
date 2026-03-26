import https from 'https';

const url = "https://image.pollinations.ai/prompt/spectacular%20cinematic%20photo%20of%20morocco%20desert%20camels%20at%20sunset?width=800&height=600&nologo=true";

https.get(url, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers['content-type']);
});
