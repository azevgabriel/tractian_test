import React from 'react';

import type { MenuProps } from 'antd';
import { Menu } from 'antd';

// ASSETS
import {
  DeploymentUnitOutlined,
  BranchesOutlined,
  SettingOutlined,
  UserOutlined,
  FundViewOutlined,
} from '@ant-design/icons';

// CONFIG FOR ANTD MENU
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const userItems: MenuItem[] = [
  getItem('Resumo', 'overview', <FundViewOutlined />),
  getItem('Ativos', 'assets', <SettingOutlined />, [
    getItem('Ativos da Unidade', 'assets-unit-filter'),
    getItem('Ativos da Empresa', 'assets-company-filter'),
  ]),
  getItem('Usuários', 'users', <UserOutlined />, [
    getItem('Usuários da Unidade', 'users-unit-filter'),
    getItem('Usuários da Empresa', 'users-company-filter'),
  ]),
  getItem('Unidades', 'units', <BranchesOutlined />, [
    getItem('Unidades da Empresa', 'units-company-filter'),
  ]),
];

const adminItems: MenuItem[] = [
  getItem('Resumo', 'overview', <FundViewOutlined />),
  getItem('Ativos', 'assets', <SettingOutlined />, [
    getItem('Ativos da Unidade', 'assets-unit-filter'),
    getItem('Ativos da Empresa', 'assets-company-filter'),
    getItem('Todos os Ativos', 'assets-no-filter'),
  ]),
  getItem('Usuários', 'users', <UserOutlined />, [
    getItem('Usuários da Unidade', 'users-unit-filter'),
    getItem('Usuários da Empresa', 'users-company-filter'),
    getItem('Todos os Usuários', 'users-no-filter'),
  ]),
  getItem('Unidades', 'units', <BranchesOutlined />, [
    getItem('Unidades da Empresa', 'units-company-filter'),
    getItem('Todas as Unidades', 'units-no-filter'),
  ]),
  getItem('Empresas', 'companies', <DeploymentUnitOutlined />, [
    getItem('Todas as Empresas', 'companies-no-filter'),
  ]),
];

// INTERFACES
interface MenuWrapperProps {
  isAdmin: boolean;
  openKeys: string[];
  onOpenChange: (openKeys: string[]) => void;
  onSelect: MenuProps['onSelect'];
  selectedKeys: string[];
}

export const MenuWrapper: React.FC<MenuWrapperProps> = ({
  isAdmin,
  openKeys,
  selectedKeys,
  onOpenChange,
  onSelect,
}: MenuWrapperProps) => {
  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      selectedKeys={selectedKeys}
      onSelect={onSelect}
      style={{ width: '100%', marginTop: 5 }}
      items={isAdmin ? adminItems : userItems}
      theme="dark"
    />
  );
};
