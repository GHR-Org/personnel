import { IconTools } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';


const NotFound404: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-400 text-white">
    <IconTools className="text-[6rem] mb-4 animate-bounce" />
    <h1 className="text-6xl font-extrabold mb-4 drop-shadow-lg">404</h1>
    <h2 className="text-2xl font-semibold mb-2">Oups… Cette page n&apos;existe pas !</h2>
    <p className="text-lg mb-6 text-center max-w-lg">
      On dirait que tu t&apos;es perdu.<br />
      La page que tu cherches est en réparation.<br />
      Reviens à l&apos;accueil et continue l’aventure !
    </p>
    <Link
      href="/"
      className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-full shadow hover:bg-pink-200 transition"
    >
      Retour à l’accueil
    </Link>
  </div>
);

export default NotFound404;
