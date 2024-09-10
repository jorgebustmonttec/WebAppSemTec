import LoginButton from './components/loginButton';
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
    <div>
      <main>
        <LoginButton /> 
      </main>
      <footer>
        <p>© 2024</p>
      </footer>
    </div>
    </NextUIProvider>
  );
}