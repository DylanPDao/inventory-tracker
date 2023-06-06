import { Link, Outlet } from 'react-router-dom';
import SearchBar from './SearchBar';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import MenuItem from './MenuItem';

export default function Header(): JSX.Element {
  return (
    <div className="lg:container my-auto mx-auto">
      <div className="flex items-center border-b-2">
        <div className="flex w-4/12 items-center justify-center">
          <img
            className="w-5/12"
            alt="pikachu logo"
            src="./images/pikachu-head.svg"
          />
          <h1 className="w-6/12">Gimme Pokemon</h1>
        </div>
        <div className="w-4/12">
          <SearchBar />
        </div>
        <div className="flex w-4/12 items-center justify-around">
          <h1 className="w-6/12">Sign in/Register</h1>
          <ShoppingCartIcon className="h-8 w-8 flex-no-shrink" />
        </div>
      </div>
      <div className="flex border-b-2 p-1">
        <MenuItem
          src="./images/blank-cards.svg"
          alt="blank cards"
          text="Cards"
        />
        <MenuItem src="./images/eevee.svg" alt="Eevee" text="Toys/Plush" />
        <MenuItem src="./images/gameboy.svg" alt="Gamboy Color" text="Games" />
        <MenuItem src="./images/pokeball.svg" alt="Pokeball" text="Other" />
      </div>
      {<Outlet />}
    </div>
  );
}
