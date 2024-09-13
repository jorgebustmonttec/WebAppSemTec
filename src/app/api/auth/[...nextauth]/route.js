import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { getUserFavorites, createUserFavorites } from '../../oracle/userFavorites';

const handler = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: "user-read-email user-top-read user-read-playback-state user-library-read playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;

      // Fetch user favorites
      try {
        const email = session.user.email;
        console.log('Fetching user favorites for email:', email);
        let userFavorites = await getUserFavorites(email);
        console.log('User favorites fetched:', userFavorites);

        if (userFavorites.rows.length === 0) {
          // If no entry exists, create one
          console.log('No user favorites found, creating new entry');
          await createUserFavorites(email);
          userFavorites = await getUserFavorites(email);
          console.log('User favorites created and fetched again:', userFavorites);
        }

        console.log('Final user favorites:', userFavorites);
      } catch (error) {
        console.error('Error fetching or creating user favorites:', error);
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };