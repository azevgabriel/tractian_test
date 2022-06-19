import './styles.css';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/auth';

// GLOBAL COMPONENTS
import { Loading } from '../../../components/Loading';

// ATND
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { FilterValue } from 'antd/lib/table/interface';

// INTERFACES
import { getCompanies, ICompany } from '../../../interfaces/Company';
import { ModalWrapper } from '../../../components/Modal';

interface Params {
  pagination?: TablePaginationConfig;
  total?: number;
  filtersTable?: Record<string, FilterValue | null>;
}

export const CompaniesRightContent = ({}) => {
  const { user } = useAuth();
  const [form] = Form.useForm();

  const [data, setData] = useState<ICompany[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 7,
    position: ['topLeft'],
  });

  const [loadingModal, setLoadingModal] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [titleModal, setTitleModal] = useState('');

  const [editNumber, setEditNumber] = useState(-1);

  const resetForm = useCallback(() => {
    setEditNumber(-1);

    form.setFieldsValue({
      name: '',
    });
  }, [form]);

  const showModal = (title: string, record?: ICompany) => {
    setTitleModal(title);
    resetForm();

    if (record) {
      form.setFieldsValue({
        name: record.name,
      });

      setEditNumber(record.id);
    }

    setVisibleModal(true);
  };

  const handleOkModal = useCallback(async () => {
    setLoadingModal(true);
    try {
      const values = await form.validateFields();

      const lastId = data?.[data.length - 1]?.id;

      const dataValues: ICompany = {
        id: editNumber !== -1 ? editNumber : lastId ? lastId + 1 : 1,
        name: values.name as string,
      };

      if (editNumber === -1) {
        // await postCompany(dataValues);
        if (data) {
          let newData: ICompany[] = [...data];
          newData.push(dataValues);
          setData(newData);
        }
      } else {
        // await putCompany(editNumber, dataValues);
        if (data) {
          const newData = data.filter((item) => item.id !== editNumber);
          newData.push(dataValues);
          setData(newData);
        }
      }

      setVisibleModal(false);
      setLoadingModal(false);
    } catch (error) {
      setLoadingModal(false);
    }
  }, [form, data, editNumber]);

  const handleCancelModal = () => {
    setVisibleModal(false);
  };

  const fetchData = useCallback(
    async (params: Params) => {
      setLoading(true);

      let companiesData: ICompany[] | null = data;

      if (companiesData === null) companiesData = await getCompanies();

      setData(companiesData);
      setPagination({
        ...params.pagination,
        total: companiesData.length,
      });
      setLoading(false);
    },
    [data]
  );

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
      // await deleteCompany(id);
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
              onClick={() => showModal('Editar', record)}
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
          <ModalWrapper
            loading={loadingModal}
            onCancel={handleCancelModal}
            onOk={handleOkModal}
            visible={visibleModal}
            title={titleModal}
            width={'600px'}
          >
            <Form
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              layout="horizontal"
              initialValues={{ size: 'default' }}
              form={form}
            >
              <Form.Item
                label="Nome"
                name="name"
                rules={[
                  {
                    required: true,
                    type: 'string',
                    message: 'Por favor, insira o nome da empresa',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Form>
          </ModalWrapper>
          <Button
            type="primary"
            disabled={user?.type === 'admin' ? false : true}
            className="addButton"
            onClick={() => showModal('Adicionar empresa')}
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
