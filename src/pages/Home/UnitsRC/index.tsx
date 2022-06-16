import './styles.css';

export type FilterUnitsRC = 'no' | 'company';

interface UnitsRightContentProps {
  filter: FilterUnitsRC;
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
import { deleteUnit, getUnits, IUnit } from '../../../interfaces/Unit';

interface Params {
  pagination?: TablePaginationConfig;
  total?: number;
  filtersTable?: Record<string, FilterValue | null>;
  filter: FilterUnitsRC;
}

export const UnitsRightContent = ({ filter }: UnitsRightContentProps) => {
  const { user } = useAuth();

  const [data, setData] = useState<IUnit[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 7,
    position: ['topLeft'],
  });

  const fetchData = useCallback(async (params: Params) => {
    setLoading(true);
    let unitsData = await getUnits();

    let filteredUnits: IUnit[] = [];

    switch (params.filter) {
      case 'no':
        break;
      case 'company':
        filteredUnits = unitsData.filter(
          (unit) => unit.companyId === user?.companyId
        );
        unitsData = filteredUnits;
        break;
      default:
        break;
    }

    setData(unitsData);
    setPagination({
      ...params.pagination,
      total: unitsData.length,
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
      await deleteUnit(id);
      const newData = data?.filter((company) => company.id !== id);
      if (newData) setData(newData);
    } catch (error) {
      console.error('Company:DELETE', error);
    }
  }, []);

  const columns: ColumnsType<IUnit> = [
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
      width: '40%',
      sorter: (a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      },
    },
    {
      title: 'ID da Empresa',
      dataIndex: 'companyId',
      key: 'companyId',
      width: '20%',
    },
    {
      title: 'Ação',
      key: 'action',
      width: '30%',
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
            Criar nova unidade
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
