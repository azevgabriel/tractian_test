import './styles.css';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/auth';
import { useNavigate } from 'react-router-dom';

// GLOBAL COMPONENTS
import { Loading } from '../../../components/Loading';
import { ModalWrapper } from '../../../components/Modal';

// ATND
import {
  Button,
  Popconfirm,
  Statistic,
  Table,
  Tag,
  Form,
  Input,
  Select,
  InputNumber,
} from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { FilterValue } from 'antd/lib/table/interface';

// INTERFACES
export type FilterAssetsRC = 'no' | 'unit' | 'company';

import { getAssets, IAsset, IMetrics } from '../../../interfaces/Asset';
import { getCompanies, ICompany } from '../../../interfaces/Company';
import { getUnits, IUnit } from '../../../interfaces/Unit';

interface AssetsRightContentProps {
  filter: FilterAssetsRC;
}

interface Params {
  pagination?: TablePaginationConfig;
  total?: number;
  filtersTable?: Record<string, FilterValue | null>;
  filter: FilterAssetsRC;
}

export const AssetsRightContent = ({ filter }: AssetsRightContentProps) => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  let navigate = useNavigate();

  const [data, setData] = useState<IAsset[] | null>(null);
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
      healthscore: '',
      image: '',
      sensors: '',
      maxTemp: '',
      rpm: '',
      power: '',
      unitId: '',
      companyId: '',
    });
  }, [form]);

  const showModal = (title: string, record?: IAsset) => {
    setTitleModal(title);
    resetForm();

    if (record) {
      form.setFieldsValue({
        name: record.name,
        status: record.status,
        model: record.model,
        healthscore: record.healthscore,
        image: record.image,
        maxTemp: record.specifications.maxTemp,
        rpm: record.specifications.rpm,
        power: record.specifications.power,
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

      const dataValues: IAsset = {
        id: editNumber !== -1 ? editNumber : lastId ? lastId + 1 : 1,
        name: values.name as string,
        status: values.status as string,
        model: values.model as string,
        healthscore: values.healthscore as number,
        image: values.image as string,
        specifications: {
          maxTemp: values.maxTemp as number,
          rpm: values.rpm as number,
          power: values.power as number,
        },
        unitId: values.unitId as number,
        companyId: values.companyId as number,
        sensors: [],
        metrics: {} as IMetrics,
      };

      if (editNumber === -1) {
        // await postAsset(dataValues);
        if (data) {
          let newData: IAsset[] = [...data];
          newData.push(dataValues);
          setData(newData);
        }
      } else {
        // await putAsset(editNumber, dataValues);
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

      let assetsData: IAsset[] | null = data;

      if (assetsData === null) assetsData = await getAssets();
      if (companies === null) setCompanies(await getCompanies());
      if (units === null) setUnits(await getUnits());

      let filteredAssets: IAsset[] = [];

      switch (params.filter) {
        case 'no':
          break;
        case 'unit':
          filteredAssets = (await getAssets()).filter(
            (asset) => asset.unitId === user?.unitId
          );
          assetsData = filteredAssets;
          break;
        case 'company':
          filteredAssets = (await getAssets()).filter(
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

      assetsData = [...new Set(assetsData)];

      setData(assetsData);
      setPagination({
        ...params.pagination,
        total: assetsData.length,
      });
      setLoading(false);
    },
    [data, companies, units, user]
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

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        // await deleteAsset(id);
        const newData = data?.filter((asset) => asset.id !== id);
        if (newData) setData(newData);
      } catch (error) {
        console.error('Company:DELETE', error);
      }
    },
    [data]
  );

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
            <Button
              type="primary"
              style={{ marginRight: '10px' }}
              onClick={() => {
                navigate(`/ativo/${record.id}`);
              }}
            >
              Detalhes
            </Button>
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
                label="Modelo"
                name="model"
                rules={[
                  {
                    required: true,
                    type: 'string',
                    message: 'Por favor, insira o modelo do ativo',
                  },
                ]}
              >
                <Select>
                  <Select.Option value="fan">Ventilador</Select.Option>
                  <Select.Option value="motor">Motor</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Status"
                name="status"
                rules={[
                  {
                    required: true,
                    type: 'string',
                    message: 'Por favor, insira o status do ativo',
                  },
                ]}
              >
                <Select>
                  <Select.Option value="inOperation">Em Operação</Select.Option>
                  <Select.Option value="inAlert">Em Alerta</Select.Option>
                  <Select.Option value="inDowncase">
                    Em Manutenção
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Pontuaçâo de saúde"
                name="healthscore"
                rules={[
                  {
                    required: true,
                    type: 'number',
                    message: 'Por favor, insira a pontuação de saúde do ativo',
                  },
                  {
                    type: 'number',
                    max: 100,
                    message: 'Máximo de 100 pontos',
                  },
                  {
                    type: 'number',
                    min: 0,
                    message: 'Mínimo de 0 pontos',
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                label="Temp. Máx."
                name="maxTemp"
                rules={[
                  {
                    required: true,
                    type: 'number',
                    message: 'Por favor, insira a temperatura máxima',
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item label="Potência" name="power">
                <Input />
              </Form.Item>
              <Form.Item label="RPM" name="rpm">
                <Input />
              </Form.Item>
              <Form.Item
                label="Unidade"
                name="unitId"
                rules={[
                  {
                    required: true,
                    type: 'number',
                    message: 'Por favor, insira a unidade do ativo.',
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
            onClick={() => showModal('Criando novo ativo')}
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
