import client from '../../lib/nosqlClient';
import { getUserFavorites, createUserFavorites, updateUserFavorites, deleteUserFavoriteField } from './userFavorites';

export async function GET(req) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');

  console.log(`GET request received. URL: ${req.url}, Email: ${email}`);

  if (email) {
    try {
      const result = await getUserFavorites(email);
      console.log(`User favorites fetched for email: ${email}`, result);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(`Error querying user favorites for email: ${email}`, error);
      return new Response('Failed to fetch user favorites', { status: 500 });
    }
  }

  try {
    const result = await client.query('SELECT * FROM TestTable');
    console.log('TestTable data fetched:', result);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error querying TestTable:', error);
    return new Response('Failed to fetch data', { status: 500 });
  }
}

export async function POST(req) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');

  console.log(`POST request received. URL: ${req.url}, Email: ${email}`);

  if (email) {
    try {
      const result = await createUserFavorites(email);
      console.log(`User favorites created for email: ${email}`, result);
      return new Response(JSON.stringify(result), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(`Error creating user favorites for email: ${email}`, error);
      return new Response('Failed to create user favorites', { status: 500 });
    }
  }

  try {
    const result = await client.put('TestTable', {
      id: '3',
      name: 'Test Name3',
    });
    console.log('TestTable data inserted:', result);
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error inserting into TestTable:', error);
    return new Response('Failed to insert data', { status: 500 });
  }
}

export async function PUT(req) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');
  const updates = await req.json();

  console.log(`PUT request received. URL: ${req.url}, Email: ${email}, Updates: ${JSON.stringify(updates)}`);

  if (email) {
    try {
      const result = await updateUserFavorites(email, updates);
      console.log(`User favorites updated for email: ${email}`, result);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(`Error updating user favorites for email: ${email}`, error);
      return new Response('Failed to update user favorites', { status: 500 });
    }
  }

  return new Response('Email is required', { status: 400 });
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');
  const field = url.searchParams.get('field');

  console.log(`DELETE request received. URL: ${req.url}, Email: ${email}, Field: ${field}`);

  if (email && field) {
    try {
      const result = await deleteUserFavoriteField(email, field);
      console.log(`User favorite field deleted for email: ${email}, Field: ${field}`, result);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(`Error deleting user favorite field for email: ${email}, Field: ${field}`, error);
      return new Response('Failed to delete user favorite field', { status: 500 });
    }
  }

  return new Response('Email and field are required', { status: 400 });
}