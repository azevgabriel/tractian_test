import './styles.css';

export type FilterUnitsRC = 'no' | 'company';

interface UnitsRightContentProps {
  filter: FilterUnitsRC;
}

export const UnitsRightContent = ({ filter }: UnitsRightContentProps) => {
  return <h1>Units {filter}</h1>;
};
