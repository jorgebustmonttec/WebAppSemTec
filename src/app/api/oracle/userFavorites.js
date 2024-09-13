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
    const result = await client.put('userFavorites', { id: email, favorites: JSON.stringify({ trackId: '', albumId: '', artistId: '' }) });
    return result;
  } catch (error) {
    console.error('Error creating user favorites:', error);
    throw new Error('Failed to create user favorites');
  }
}

export async function updateUserFavorites(email, updates) {
  try {
    const currentFavorites = await getUserFavorites(email);
    if (currentFavorites.rows.length === 0) {
      throw new Error('User favorites not found');
    }
    const currentData = JSON.parse(currentFavorites.rows[0].favorites);
    const updatedData = { ...currentData, ...updates };
    const result = await client.put('userFavorites', { id: email, favorites: JSON.stringify(updatedData) });
    return result;
  } catch (error) {
    console.error('Error updating user favorites:', error);
    throw new Error('Failed to update user favorites');
  }
}

export async function deleteUserFavoriteField(email, field) {
  try {
    const currentFavorites = await getUserFavorites(email);
    if (currentFavorites.rows.length === 0) {
      throw new Error('User favorites not found');
    }
    const currentData = JSON.parse(currentFavorites.rows[0].favorites);
    currentData[field] = ''; // Set the field to an empty string instead of deleting it
    const result = await client.put('userFavorites', { id: email, favorites: JSON.stringify(currentData) });
    return result;
  } catch (error) {
    console.error('Error deleting user favorite field:', error);
    throw new Error('Failed to delete user favorite field');
  }
}