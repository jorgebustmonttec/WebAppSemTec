import LoginButton from './components/loginButton';
import { NextUIProvider } from "@nextui-org/react";
import SpotifyComponent from './components/spotifyComponent';


export default function Home() {
  return (
    <NextUIProvider>
    <div>
      <main>
        <div className = "flex flex-row items-end">
        <LoginButton/>
        <SpotifyComponent/>
        </div>
      </main>
      <footer>
      </footer>
    </div>
    </NextUIProvider>
  );
}