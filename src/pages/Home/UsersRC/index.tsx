import './styles.css';

export type FilterUsersRC = 'no' | 'company';

interface UsersRightContentProps {
  filter: FilterUsersRC;
}

export const UsersRightContent = ({ filter }: UsersRightContentProps) => {
  return <h1>Users {filter}</h1>;
};
