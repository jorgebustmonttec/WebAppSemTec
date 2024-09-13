import client from '../../lib/nosqlClient';

export async function getUserFavorites(email) {
  try {
    const result = await client.query(`SELECT * FROM userFavorites WHERE id = '${email}'`);
    return result;
  } catch (error) {
    console.error('Error querying user favorites:', error);
    throw new Error('Failed to fetch user favorites');
  }
}

export async function createUserFavorites(email) {
  try {
    const result = await client.put('userFavorites', { id: email, favorites: JSON.stringify({ songId: '', albumId: '', artistId: '' }) });
    return result;
  } catch (error) {
    console.error('Error creating user favorites:', error);
    throw new Error('Failed to create user favorites');
  }
}