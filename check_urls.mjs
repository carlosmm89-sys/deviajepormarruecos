const urls = [
  'https://images.unsplash.com/photo-1552554790-256cf7b7ce74?auto=format&fit=crop&q=80&w=800', 
  'https://images.unsplash.com/photo-1574343136277-2da3624fbb86?auto=format&fit=crop&q=80&w=800', 
  'https://images.unsplash.com/photo-1502484433129-8730acbc18d8?auto=format&fit=crop&q=80&w=800', 
  'https://images.unsplash.com/photo-1554188204-71239aaeb1ae?auto=format&fit=crop&q=80&w=800', 
  'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=800', 
  'https://images.unsplash.com/photo-1473110290518-eccc5aee178c?auto=format&fit=crop&q=80&w=800', 
  'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800', 
  'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800', 
  'https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?auto=format&fit=crop&q=80&w=800', 
  'https://images.unsplash.com/photo-1521124430489-08226d40026e?auto=format&fit=crop&q=80&w=800', 
  'https://images.unsplash.com/photo-1541364505085-78e83b45167b?auto=format&fit=crop&q=80&w=800'
];

async function check() {
  for (let u of urls) {
    const res = await fetch(u, { method: 'HEAD' });
    console.log(`${res.status} - ${u}`);
  }
}
check();
