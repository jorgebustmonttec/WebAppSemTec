import client from '../../lib/nosqlClient';

export async function GET() {
  try {
    const result = await client.query('SELECT * FROM TestTable');
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error querying:', error);
    return new Response('Failed to fetch data', { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await client.put('TestTable', { id: '3', name: 'Test Name3' });
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error inserting:', error);
    return new Response('Failed to insert data', { status: 500 });
  }
}
