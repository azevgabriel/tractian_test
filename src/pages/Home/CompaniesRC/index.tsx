import './styles.css';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/auth';

// GLOBAL COMPONENTS
import { Loading } from '../../../components/Loading';

// ATND
import { Button, Popconfirm, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Header } from 'antd/lib/layout/layout';

// INTERFACES
import {
  deleteCompany,
  getCompanies,
  ICompany,
} from '../../../interfaces/Company';

export const CompaniesRightContent = ({}) => {
  const { user } = useAuth();

  const [data, setData] = useState<ICompany[] | null>(null);

  const fetchData = useCallback(async () => {
    setData(await getCompanies());
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteCompany(id);
      const newData = data?.filter((company) => company.id !== id);
      if (newData) setData(newData);
    } catch (error) {
      console.error('Company:DELETE', error);
    }
  }, []);

  // TAGS ASSETS
  // {
  //   title: 'Tags',
  //   key: 'tags',
  //   dataIndex: 'tags',
  //   render: (_, { tags }) => (
  //     <>
  //       {tags.map((tag) => {
  //         let color = tag.length > 5 ? 'geekblue' : 'green';
  //         if (tag === 'loser') {
  //           color = 'volcano';
  //         }
  //         return (
  //           <Tag color={color} key={tag}>
  //             {tag.toUpperCase()}
  //           </Tag>
  //         );
  //       })}
  //     </>
  //   ),
  // },

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
    fetchData();
  }, []);

  return (
    <>
      {!data ? (
        <Loading size="middle" />
      ) : (
        <>
          <Header
            style={{
              backgroundColor: '#ddd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              type="primary"
              disabled={user?.type === 'admin' ? false : true}
            >
              Criar nova empresa
            </Button>
          </Header>
          <Table columns={columns} dataSource={data} />
        </>
      )}
    </>
  );
};
