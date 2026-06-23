async function test() {
  try {
    const res = await fetch('http://127.0.0.1:5005/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser3',
        email: 'test3@example.com',
        password: 'password123'
      })
    });
    const data = await res.json();
    console.log('Status:', res.status, 'Data:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
