import { Menu } from '@headlessui/react';
import { Link } from 'react-router-dom';

type Props = {
  name: string;
  url: string;
};

export default function UserMenuItems({ name, url }: Props) {
  return (
    <>
      <Menu.Item>
        {({ active }) => (
          <Link
            key={url}
            to={url}
            className={`${
              active ? 'bg-primary text-white' : 'text-gray-900'
            } group flex w-full items-center rounded-md px-2 py-2 text-md text-center`}>
            {name}
          </Link>
        )}
      </Menu.Item>
    </>
  );
}
