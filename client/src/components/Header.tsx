import { Link, Outlet } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { UserContext } from '../lib/UserContext';
import { useContext } from 'react';
import SearchBar from './SearchBar';
import MenuItem from './MenuItem';
import UserMenu from './UserMenu';

export default function Header({
  searchString,
}: {
  searchString: React.Dispatch<React.SetStateAction<string | undefined>>;
}): JSX.Element {
  const user = useContext(UserContext);

  return (
    <div className="container my-auto mx-auto">
      <div className="flex items-center justify-center border-b-2">
        <div className="flex w-4/12 items-center justify-center">
          <Link to="/" className="w-5/12">
            <img alt="pikachu logo" src="/images/pikachu-head.svg" />
          </Link>
          <h1 className="hidden sm:block w-6/12">Gimme Pokemon</h1>
        </div>
        <div className="w-4/12">
          <SearchBar searchString={searchString} />
        </div>
        <div className="sm:flex sm:w-4/12 sm:items-center hidden">
          <Link to={user ? '' : 'sign-in'} className="w-6/12">
            {user ? <UserMenu /> : 'Sign In'}
          </Link>
          <Link
            to={`cart/${user ? user.user.userId : 'guest'}`}
            className="w-6/12">
            <ShoppingCartIcon className="h-8 w-8 flex-no-shrink mr-auto ml-auto" />
          </Link>
        </div>
      </div>
      <div className="sm:flex sm:border-b-2 sm:p-1 hidden">
        <MenuItem
          src="/images/blank-cards.svg"
          alt="blank cards"
          text="Cards"
          link="catalog/cards"
        />
        <MenuItem
          src="/images/eevee.svg"
          alt="Eevee"
          text="Toys/Plush"
          link="catalog/toys-plush"
        />
        <MenuItem
          src="/images/gameboy.svg"
          alt="Gamboy Color"
          text="Games"
          link="catalog/games"
        />
        <MenuItem
          src="/images/pokeball.svg"
          alt="Pokeball"
          text="Other"
          link="catalog/others"
        />
      </div>
      {<Outlet />}
    </div>
  );
}
