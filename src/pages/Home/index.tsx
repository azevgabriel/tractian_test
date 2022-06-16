import './styles.css';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../hooks/auth';

// ANT-D
import { Layout, Button, MenuProps } from 'antd';
const { Content, Sider } = Layout;
const rootSubmenuKeys = ['assets', 'units', 'users', 'companies', 'overview'];

// GLOBAL COMPONENTS
import { MenuWrapper } from '../../components/Menu';
import { Loading } from '../../components/Loading';

// LOCAL COMPONENTS
import { AssetsRightContent, FilterAssetsRC } from './AssetsRC';
import { FilterUnitsRC, UnitsRightContent } from './UnitsRC';
import { FilterUsersRC, UsersRightContent } from './UsersRC';
import { CompaniesRightContent } from './CompaniesRC';
import { OverviewRightContent } from './OverviewRC';

// INTERFACES
import { getUnit, IUnit } from '../../interfaces/Unit';
import { getCompany, ICompany } from '../../interfaces/Company';

export const Home = () => {
  const { user, changeTypeUser, signOut } = useAuth();

  const [loadingAsyncFuction, setLoadingAsyncFunction] = useState<
    'none' | 'data'
  >('none');

  const [unit, setUnit] = useState<IUnit | null>(null);
  const [company, setCompany] = useState<ICompany | null>(null);

  const [openMenuItem, setOpenMenuItem] = useState(['overview']);
  const [selectedMenuSubItem, setSelectedMenuSubItem] = useState('overview');

  const onChangeMenuItem: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openMenuItem.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenMenuItem(keys);
    } else {
      setOpenMenuItem(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onSelectMenuSubItem: MenuProps['onSelect'] = (keys) => {
    setSelectedMenuSubItem(keys.key);
  };

  const fetchData = useCallback(async () => {
    setLoadingAsyncFunction('data');
    if (user)
      try {
        const [unitData, companyData] = await Promise.all([
          getUnit(user.unitId),
          getCompany(user.companyId),
        ]);
        setCompany(companyData);
        setUnit(unitData);
        setLoadingAsyncFunction('none');
      } catch (error) {
        console.log(error);
        signOut();
      }
  }, [user]);

  const renderRightContent = useCallback(() => {
    const [item, typeFilter] = selectedMenuSubItem.split('-');

    switch (item) {
      case 'overview':
        return <OverviewRightContent />;
      case 'assets':
        return <AssetsRightContent filter={typeFilter as FilterAssetsRC} />;
      case 'units':
        return <UnitsRightContent filter={typeFilter as FilterUnitsRC} />;
      case 'users':
        return <UsersRightContent filter={typeFilter as FilterUsersRC} />;
      case 'companies':
        return <CompaniesRightContent />;
      default:
        return <OverviewRightContent />;
    }
  }, [selectedMenuSubItem]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout className="content">
      {loadingAsyncFuction === 'data' ? (
        <Loading size="large" />
      ) : (
        <>
          <Sider width={250} className="contentLeft">
            <div className="topContentLeft">
              <span className="userDescription">
                <h1>Empresa:</h1>
                <p>{` ${company?.name}`}</p>
              </span>
              <span className="userDescription">
                <h1>Unidade:</h1>
                <p>{` ${unit?.name}`}</p>
              </span>
              <MenuWrapper
                isAdmin={user?.type === 'admin' ? true : false}
                onOpenChange={onChangeMenuItem}
                onSelect={onSelectMenuSubItem}
                openKeys={openMenuItem}
                selectedKeys={[selectedMenuSubItem]}
                key={`menu${user?.type === 'admin' ? '-admin' : '-user'}`}
              />
            </div>
            {user?.type === 'admin' ? (
              <Button type="link" onClick={() => changeTypeUser('user')}>
                Ver como usuário normal
              </Button>
            ) : (
              <Button
                type="link"
                danger
                onClick={() => changeTypeUser('admin')}
              >
                Ver como administrador
              </Button>
            )}
          </Sider>
          <Content
            style={{
              height: '100%',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            className="contentRight"
          >
            {renderRightContent()}
          </Content>
        </>
      )}
    </Layout>
  );
};
