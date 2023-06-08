import { Link, Outlet } from 'react-router-dom';
import SearchBar from './SearchBar';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import MenuItem from './MenuItem';
import { UserContext } from '../lib/UserContext';
import { useContext } from 'react';

export default function Header(): JSX.Element {
  const user = useContext(UserContext);

  return (
    <div className="lg:container my-auto mx-auto">
      <div className="flex items-center border-b-2">
        <div className="flex w-4/12 items-center justify-center">
          <Link to="/" className="w-5/12">
            <img alt="pikachu logo" src="./images/pikachu-head.svg" />
          </Link>
          <h1 className="w-6/12">Gimme Pokemon</h1>
        </div>
        <div className="w-4/12">
          <SearchBar />
        </div>
        <div className="flex w-4/12 items-center justify-around">
          <Link to="sign-in" className="w-6/12">
            {user ? 'Sign In' : 'Sign Out'}
          </Link>
          <ShoppingCartIcon className="h-8 w-8 flex-no-shrink" />
        </div>
      </div>
      <div className="flex border-b-2 p-1">
        <MenuItem
          src="./images/blank-cards.svg"
          alt="blank cards"
          text="Cards"
          link="catalog/cards"
        />
        <MenuItem
          src="./images/eevee.svg"
          alt="Eevee"
          text="Toys/Plush"
          link="catalog/toys"
        />
        <MenuItem
          src="./images/gameboy.svg"
          alt="Gamboy Color"
          text="Games"
          link="catalog/games"
        />
        <MenuItem
          src="./images/pokeball.svg"
          alt="Pokeball"
          text="Other"
          link="catalog/other"
        />
      </div>
      {<Outlet />}
    </div>
  );
}
