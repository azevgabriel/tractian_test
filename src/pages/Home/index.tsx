import './styles.css';

import { Layout } from 'antd';
import { useAuth } from '../../hooks/auth';
const { Content, Sider } = Layout;

import { getUnit, IUnit } from '../../interfaces/Units';
import { useCallback, useEffect, useState } from 'react';
import { getCompany, ICompany } from '../../interfaces/Company';
import { MenuWrapper } from '../../components/Menu';

export const Home = () => {
  const { user } = useAuth();

  const [unit, setUnit] = useState<IUnit | null>(null);
  const [company, setCompany] = useState<ICompany | null>(null);

  const fetchData = useCallback(async () => {
    if (user)
      try {
        const [unitData, companyData] = await Promise.all([
          getUnit(user.unitId),
          getCompany(user.companyId),
        ]);
        setCompany(companyData);
        setUnit(unitData);
      } catch (error) {
        console.log(error);
      }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout className="content">
      <Sider width={250} className="content-left">
        <span className="userDescription">
          <h1>Empresa:</h1>
          <p>{` ${company?.name}`}</p>
        </span>
        <span className="userDescription">
          <h1>Unidade:</h1>
          <p>{` ${unit?.name}`}</p>
        </span>
        <MenuWrapper />
      </Sider>
      <Content style={{ height: '100%' }}></Content>
    </Layout>
  );
};
