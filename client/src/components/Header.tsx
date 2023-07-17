import { Link, Outlet } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { MenuItem } from './';
import { Menu } from '@headlessui/react';

export default function Header(): JSX.Element {
  return (
    <div className="container h-screen my-auto mx-auto">
      <div className="flex items-center justify-center border-b-2 flex-col md:flex-row border-gold">
        <div className="flex w-full md:w-4/12 items-center justify-around">
          <Link to="/" className="md:w-4/12 w-4/12 flex">
            <img alt="trill logo" src="/images/trill-logo.png" />
          </Link>
        </div>
      </div>
      {<Outlet />}
    </div>
  );
}
