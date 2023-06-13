import { createContext } from 'react';
import { UsersProps } from './Api';

const UserContext = createContext<UsersProps | undefined>(undefined);

export { UserContext };
