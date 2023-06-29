import { UserCircleIcon } from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import { useContext } from 'react';
import { UserContext } from '../lib';
import UserMenuItems from './UserMenuItems';

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
          <UserMenuItems name="Home" url="/" />
          <UserMenuItems name="Sign Out" url="/sign-out" />
          {user?.user.admin && (
            <UserMenuItems name="Add Product" url="/admin-add" />
          )}
        </div>
      </Menu.Items>
    </Menu>
  );
}
