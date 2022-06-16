import './styles.css';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/auth';

// GLOBAL COMPONENTS
import { Loading } from '../../../components/Loading';

// ATND
import { Button, Popconfirm, Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { Header } from 'antd/lib/layout/layout';
import { FilterValue } from 'antd/lib/table/interface';

// INTERFACES
import {
  deleteCompany,
  getCompanies,
  ICompany,
} from '../../../interfaces/Company';

interface Params {
  pagination?: TablePaginationConfig;
  total?: number;
  filtersTable?: Record<string, FilterValue | null>;
}

export const CompaniesRightContent = ({}) => {
  const { user } = useAuth();

  const [data, setData] = useState<ICompany[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 7,
    position: ['topLeft'],
  });

  const fetchData = useCallback(async (params: Params) => {
    setLoading(true);
    let companiesData = await getCompanies();
    setData(companiesData);
    setPagination({
      ...params.pagination,
      total: companiesData.length,
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
    });
  };

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteCompany(id);
      const newData = data?.filter((company) => company.id !== id);
      if (newData) setData(newData);
    } catch (error) {
      console.error('Company:DELETE', error);
    }
  }, []);

  const columns: ColumnsType<ICompany> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: 'Nome da empresa',
      dataIndex: 'name',
      key: 'name',
      width: '70%',
      sorter: (a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      },
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
    fetchData({ pagination });
  }, []);

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
            Criar nova empresa
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
