import { UserCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useContext, Fragment } from 'react';
import { UserContext } from '../lib/UserContext';

export default function UserMenu() {
  const user = useContext(UserContext);

  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button className="inline-flex w-full justify-center">
          <UserCircleIcon className="h-8 w-8" />
        </Menu.Button>
      </div>
      <Menu.Items className="absolute right-4 mt-2 w-32 bg-white border-2 rounded-lg">
        <div className="px-1 py-1">
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/"
                className={`${
                  active ? 'bg-primary text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-md text-center`}>
                Home
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                to="sign-out"
                className={`${
                  active ? 'bg-primary text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-md text-center`}>
                Sign Out
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                to="admin-add"
                className={`${
                  active ? 'bg-primary text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-md text-center`}>
                Add Product
              </Link>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
