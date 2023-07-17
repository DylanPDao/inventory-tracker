import { Link, Outlet } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { MenuItem } from './';
import { Menu } from '@headlessui/react';

export default function Header(): JSX.Element {
  return (
    <div className="container h-screen my-auto mx-auto">
      <div className="flex items-center justify-center border-b-2 flex-col md:flex-row">
        <div className="flex w-full md:w-4/12 items-center justify-around">
          <Link to="/" className="md:w-5/12 w-4/12">
            <img alt="pikachu logo" src="/images/pikachu-head.svg" />
          </Link>
          <h1 className="md:block md:w-6/12 w-4/12">Gimme Pokemon</h1>
          <Menu as="div" className="md:hidden w-4/12 relative">
            <div>
              <Menu.Button className="inline-flex w-full justify-end pr-4">
                <Bars3Icon className="h-8 w-8" />
              </Menu.Button>
            </div>
            <Menu.Items className="absolute mt-2 right-4 w-48 bg-white border-2 rounded-lg z-10">
              <div className="px-1 py-1 text-2xl"></div>
            </Menu.Items>
          </Menu>
        </div>
        <div className="md:block w-6/12 hidden"></div>
        <div className="md:hidden w-full flex z-0"></div>
      </div>
      <div className="md:flex md:border-b-2 md:p-1 hidden">
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
