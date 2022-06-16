import './styles.css';

export type FilterUsersRC = 'no' | 'unit' | 'company';

interface UsersRightContentProps {
  filter: FilterUsersRC;
}

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/auth';

// GLOBAL COMPONENTS
import { Loading } from '../../../components/Loading';

// ATND
import { Button, Popconfirm, Statistic, Table, Tag } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { FilterValue } from 'antd/lib/table/interface';

// INTERFACES
import { deleteUser, getUsers, IUser } from '../../../interfaces/User';

interface Params {
  pagination?: TablePaginationConfig;
  total?: number;
  filtersTable?: Record<string, FilterValue | null>;
  filter: FilterUsersRC;
}

export const UsersRightContent = ({ filter }: UsersRightContentProps) => {
  const { user } = useAuth();

  const [data, setData] = useState<IUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 7,
    position: ['topLeft'],
  });

  const fetchData = useCallback(async (params: Params) => {
    setLoading(true);
    let usersData = await getUsers();

    let filteredUsers: IUser[] = [];

    switch (params.filter) {
      case 'no':
        break;
      case 'company':
        filteredUsers = usersData.filter(
          (userData) => userData.companyId === user?.companyId
        );
        usersData = filteredUsers;
        break;
      case 'unit':
        filteredUsers = usersData.filter(
          (userData) => userData.unitId === user?.unitId
        );
        usersData = filteredUsers;
        break;
      default:
        break;
    }

    setData(usersData);
    setPagination({
      ...params.pagination,
      total: usersData.length,
    });
    setLoading(false);
  }, []);

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) => {
    fetchData({
      pagination: newPagination,
      filtersTable: filters,
      filter: filter,
    });
  };

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteUser(id);
      const newData = data?.filter((company) => company.id !== id);
      if (newData) setData(newData);
    } catch (error) {
      console.error('Company:DELETE', error);
    }
  }, []);

  const columns: ColumnsType<IUser> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: 'Nome da unidade',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      sorter: (a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      },
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
      width: '25%',
      sorter: (a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      },
    },
    {
      title: 'ID da Unidade',
      dataIndex: 'unitId',
      key: 'unitId',
      width: '10%',
    },
    {
      title: 'ID da Empresa',
      dataIndex: 'companyId',
      key: 'companyId',
      width: '10%',
    },
    {
      title: 'Ação',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <>
          <>
            <Button
              type="default"
              disabled={user?.type === 'admin' ? false : true}
              style={{ marginRight: '10px' }}
            >
              Editar
            </Button>
            <Popconfirm
              title="Realmente, deseja deletar?"
              onConfirm={() => handleDelete(record.id)}
              okText="Sim"
              cancelText="Não"
            >
              <Button
                type="default"
                danger
                disabled={user?.type === 'admin' ? false : true}
              >
                Deletar
              </Button>
            </Popconfirm>
          </>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchData({ pagination, filter });
  }, [filter]);

  return (
    <>
      {!data ? (
        <Loading size="middle" />
      ) : (
        <>
          <Button
            type="primary"
            disabled={user?.type === 'admin' ? false : true}
            className="addButton"
          >
            Criar novo usuário
          </Button>
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
          />
        </>
      )}
    </>
  );
};
