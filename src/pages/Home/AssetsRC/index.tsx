import './styles.css';

export type FilterAssetsRC = 'no' | 'unit' | 'company';

interface AssetsRightContentProps {
  filter: FilterAssetsRC;
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
import { deleteAsset, getAssets, IAsset } from '../../../interfaces/Asset';

interface Params {
  pagination?: TablePaginationConfig;
  total?: number;
  filtersTable?: Record<string, FilterValue | null>;
  filter: FilterAssetsRC;
}

export const AssetsRightContent = ({ filter }: AssetsRightContentProps) => {
  const { user } = useAuth();

  const [data, setData] = useState<IAsset[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 7,
    position: ['topLeft'],
  });

  const fetchData = useCallback(async (params: Params) => {
    setLoading(true);
    let assetsData = await getAssets();

    let filteredAssets: IAsset[] = [];

    switch (params.filter) {
      case 'no':
        break;
      case 'unit':
        filteredAssets = assetsData.filter(
          (asset) => asset.unitId === user?.unitId
        );
        assetsData = filteredAssets;
        break;
      case 'company':
        filteredAssets = assetsData.filter(
          (asset) => asset.companyId === user?.companyId
        );
        assetsData = filteredAssets;
        break;
      default:
        break;
    }

    if (params.filtersTable?.model) {
      let model = params.filtersTable?.model as string[];

      for (let i = 0; i < model.length; i++) {
        filteredAssets = [
          ...filteredAssets,
          ...assetsData.filter((asset) => asset.model === model[i]),
        ];
      }

      assetsData = filteredAssets;
    }

    if (params.filtersTable?.status) {
      let status = params.filtersTable?.status as string[];
      filteredAssets = [];

      for (let i = 0; i < status.length; i++) {
        filteredAssets = [
          ...filteredAssets,
          ...assetsData.filter((asset) => asset.status === status[i]),
        ];
      }

      assetsData = filteredAssets;
    }

    setData(assetsData);
    setPagination({
      ...params.pagination,
      total: assetsData.length,
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
      await deleteAsset(id);
      const newData = data?.filter((company) => company.id !== id);
      if (newData) setData(newData);
    } catch (error) {
      console.error('Company:DELETE', error);
    }
  }, []);

  const columns: ColumnsType<IAsset> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: 'Nome do ativo',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      sorter: (a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      },
    },
    {
      title: 'Modelo',
      dataIndex: 'model',
      key: 'model',
      width: '15%',
      filters: [
        { text: 'motor', value: 'motor' },
        { text: 'fan', value: 'fan' },
      ],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      filters: [
        { text: 'Em operação', value: 'inOperation' },
        { text: 'Em alerta', value: 'inAlert' },
        { text: 'Em manutenção', value: 'inDowntime' },
      ],
      render: (_, { status }) => {
        switch (status) {
          case 'inOperation':
            return <Tag color="green">Em operação</Tag>;
          case 'inAlert':
            return <Tag color="orange">Em alerta</Tag>;
          case 'inDowntime':
            return <Tag color="red">Em manutenção</Tag>;
        }
      },
    },
    {
      title: 'Pontuação de saúde',
      dataIndex: 'healthscore',
      key: 'healthscore',
      width: '15%',
      render: (_, { healthscore }) => (
        <Statistic
          valueStyle={{ fontSize: '1rem' }}
          value={healthscore}
          suffix="/ 100"
        />
      ),
    },
    {
      title: 'Ação',
      key: 'action',
      width: '30%',
      render: (_, record) => (
        <>
          <>
            <Button type="primary" style={{ marginRight: '10px' }}>
              Detalhes
            </Button>
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
            Criar novo ativo
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
