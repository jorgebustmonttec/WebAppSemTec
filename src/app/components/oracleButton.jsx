import { useState } from 'react';

export default function TestConnection() {
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    try {
      const getResponse = await fetch('/api/oracle'); // This is correct, don't mess it up.
      const getData = await getResponse.json();
      console.log('Initial Data:', getData);
  
      const postResponse = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const postData = await postResponse.json();
      console.log('Added Data:', postData);
  
      const getResponseAgain = await fetch('/api/oracle');
      const getDataAgain = await getResponseAgain.json();
      console.log('Updated Data:', getDataAgain);
    } catch (error) {
      console.error('Something borked:', error);
    }
  };
  

  return (
    <div>
      <button onClick={handleTest} disabled={loading}>
        {loading ? 'Wait, bruh...' : 'Test DB'}
      </button>
    </div>
  );
}
