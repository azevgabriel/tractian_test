import './styles.css';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/auth';

// GLOBAL COMPONENTS
import { Loading } from '../../../components/Loading';
import { ModalWrapper } from '../../../components/Modal';

// ATND
import { Button, Form, Input, Popconfirm, Select, Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { FilterValue } from 'antd/lib/table/interface';

// INTERFACES
export type FilterUsersRC = 'no' | 'unit' | 'company';

import { deleteUser, getUsers, IUser } from '../../../interfaces/User';
import { getCompanies, ICompany } from '../../../interfaces/Company';
import { getUnits, IUnit } from '../../../interfaces/Unit';

interface UsersRightContentProps {
  filter: FilterUsersRC;
}

interface Params {
  pagination?: TablePaginationConfig;
  total?: number;
  filtersTable?: Record<string, FilterValue | null>;
  filter: FilterUsersRC;
}

export const UsersRightContent = ({ filter }: UsersRightContentProps) => {
  const { user } = useAuth();
  const [form] = Form.useForm();

  const [data, setData] = useState<IUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 7,
    position: ['topLeft'],
  });

  const [loadingModal, setLoadingModal] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [titleModal, setTitleModal] = useState('');
  const [companies, setCompanies] = useState<ICompany[] | null>(null);
  const [units, setUnits] = useState<IUnit[] | null>(null);

  const [editNumber, setEditNumber] = useState(-1);

  const resetForm = useCallback(() => {
    setEditNumber(-1);

    form.setFieldsValue({
      name: '',
      email: '',
      unitId: '',
      companyId: '',
    });
  }, [form]);

  const showModal = (title: string, record?: IUser) => {
    setTitleModal(title);
    resetForm();

    if (record) {
      form.setFieldsValue({
        name: record.name,
        email: record.email,
        unitId: record.unitId,
        companyId: record.companyId,
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

      const dataValues: IUser = {
        id: editNumber !== -1 ? editNumber : lastId ? lastId + 1 : 1,
        name: values.name as string,
        email: values.email as string,
        unitId: values.unitId as number,
        companyId: values.companyId as number,
        type: 'user',
      };

      if (editNumber === -1) {
        // await postUser(dataValues);
        if (data) {
          let newData: IUser[] = [...data];
          newData.push(dataValues);
          setData(newData);
        }
      } else {
        // await putUser(editNumber, dataValues);
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

      let usersData: IUser[] | null = data;

      if (usersData === null) usersData = await getUsers();
      if (companies === null) setCompanies(await getCompanies());
      if (units === null) setUnits(await getUnits());

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
    },
    [user, data]
  );

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
      width: '20%',
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
      width: '20%',
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
      width: '15%',
    },
    {
      title: 'ID da Empresa',
      dataIndex: 'companyId',
      key: 'companyId',
      width: '15%',
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
    fetchData({ pagination, filter });
  }, [filter]);

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
                    message: 'Por favor, insira o nome do ativo',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="E-mail"
                name="email"
                rules={[
                  {
                    required: true,
                    type: 'email',
                    message: 'Por favor, insira o email do usuário',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Unidade"
                name="unitId"
                rules={[
                  {
                    required: true,
                    type: 'number',
                    message: 'Por favor, insira a unidade do usuário.',
                  },
                ]}
              >
                <Select>
                  {units &&
                    units.map((unit) => (
                      <Select.Option key={unit.id} value={unit.id}>
                        {unit.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Empresa"
                name="companyId"
                rules={[
                  {
                    required: true,
                    type: 'number',
                    message: 'Por favor, insira o empresa do ativo',
                  },
                ]}
              >
                <Select>
                  {companies &&
                    companies.map((company) => (
                      <Select.Option key={company.id} value={company.id}>
                        {company.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Form>
          </ModalWrapper>
          <Button
            type="primary"
            disabled={user?.type === 'admin' ? false : true}
            className="addButton"
            onClick={() => showModal('Adicionar um novo usuário')}
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
