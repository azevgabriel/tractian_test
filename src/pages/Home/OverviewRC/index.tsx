import './styles.css';

import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/auth';
import { useNavigate } from 'react-router-dom';

// GLOBAL COMPONENTS
import { Loading } from '../../../components/Loading';

// AntD Charts
import { Column, Pie, G2 } from '@ant-design/plots';
import { Datum } from '@ant-design/charts';

// AntD
import { Alert, Button, Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';

// INTERFACES
import { getAssets } from '../../../interfaces/Asset';

interface IDataColumn {
  name: string;
  ativo: string;
  data: number;
}

interface IDataPie {
  status: string;
  count: number;
}

interface INotifications {
  idAsset: number;
  type: 'warning' | 'success' | 'error' | 'info';
  title: string;
  description: string;
}

const G = G2.getEngine('canvas');

export const OverviewRightContent: React.FC = () => {
  const { user } = useAuth();
  let navigate = useNavigate();

  const [dataTemp, setDataTemp] = useState<IDataColumn[] | null>(null);
  const [dataStatus, setDataStatus] = useState<IDataPie[] | null>(null);
  const [dataNotifications, setDataNotifications] = useState<
    INotifications[] | null
  >(null);

  const [loadingAsync, setLoadingAsync] = useState<'data' | 'none'>('none');

  const fetchData = useCallback(async () => {
    setLoadingAsync('data');
    let assets = await getAssets();

    if (user?.type !== 'admin')
      assets = assets.filter((asset) => asset.companyId === user?.companyId);

    const inAlert = assets.filter((asset) => asset.status === 'inAlert');
    const inDowntime = assets.filter((asset) => asset.status === 'inDowntime');
    const inOperation = assets.filter(
      (asset) => asset.status === 'inOperation'
    );

    const dataStatus: IDataPie[] = [
      { status: 'Em Alerta', count: inAlert.length },
      { status: 'Em Manutenção', count: inDowntime.length },
      { status: 'Em Operação', count: inOperation.length },
    ];

    let dataTemp: IDataColumn[] = [];
    let sumTotalHealthy = 0;
    assets.forEach((asset) => {
      sumTotalHealthy = sumTotalHealthy + asset.healthscore;
      dataTemp.push({
        name: 'Healthscore',
        ativo: asset.name,
        data: asset.healthscore,
      });
    });

    dataTemp.push({
      name: 'Healthscore',
      ativo: 'Média',
      data: Number((sumTotalHealthy / assets.length).toFixed(0)),
    });

    const notifications: INotifications[] = [];
    assets.forEach((asset) => {
      if (asset.status === 'inAlert')
        notifications.push({
          idAsset: asset.id,
          type: 'warning',
          title: 'Alerta de estado',
          description: `${asset.name} está em Alerta`,
        });
      if (asset.status === 'inDowntime')
        notifications.push({
          idAsset: asset.id,
          type: 'info',
          title: 'Informação de estado',
          description: `${asset.name} está em Manutenção`,
        });
    });

    setDataTemp(dataTemp);
    setDataStatus(dataStatus);
    setDataNotifications(notifications);

    setLoadingAsync('none');
  }, [user]);

  useEffect(() => {
    if (!dataStatus && !dataTemp) fetchData();
  }, [dataStatus, dataTemp]);

  return (
    <Layout className="overviewRightContent">
      {loadingAsync === 'data' ? (
        <Loading size="large" />
      ) : (
        <>
          <Layout className="plotsWrapper">
            <Content className="halfLayout">
              {dataTemp && (
                <>
                  <h2>Pontuação de saúde de ativos</h2>
                  <Column
                    data={dataTemp}
                    xField="ativo"
                    yField="data"
                    seriesField="ativo"
                    animation={false}
                    color={(d: Datum) => {
                      if (d.ativo === 'Média') return '#ffbb96';
                      return '#00bcd4';
                    }}
                  />
                </>
              )}
            </Content>
            <Content className="halfLayout">
              {dataStatus && (
                <>
                  <h2>Quantidade total de ativos em estados diferentes.</h2>
                  <Pie
                    data={dataStatus}
                    className="pie"
                    appendPadding={0}
                    angleField="count"
                    colorField="status"
                    legend={false}
                    radius={0.7}
                    animation={false}
                    color={(d: Datum) => {
                      if (d.status === 'Em Alerta') return '#f5222d';
                      if (d.status === 'Em Operação') return '#52c41a';
                      else return '#1890ff';
                    }}
                    label={{
                      type: 'spider',
                      labelHeight: 40,
                      formatter: (data: any, mappingData: any) => {
                        const group = new G.Group({});
                        group.addShape({
                          type: 'circle',
                          attrs: {
                            x: 0,
                            y: 0,
                            width: 40,
                            height: 50,
                            r: 5,
                            fill: mappingData.color,
                          },
                        });
                        group.addShape({
                          type: 'text',
                          attrs: {
                            x: 10,
                            y: 8,
                            text: `${data.status}`,
                            fill: mappingData.color,
                          },
                        });
                        group.addShape({
                          type: 'text',
                          attrs: {
                            x: 0,
                            y: 25,
                            text: `Total: ${data.count}`,
                            fill: 'rgba(0, 0, 0, 0.65)',
                            fontWeight: 700,
                          },
                        });
                        return group;
                      },
                    }}
                  />
                </>
              )}
            </Content>
          </Layout>
          <Layout className="notificationsWrapper">
            <>
              {dataNotifications && (
                <>
                  <h2>Notificações</h2>
                  {dataNotifications.map((notification) => (
                    <Alert
                      className="alert"
                      message={notification.title}
                      showIcon
                      description={notification.description}
                      type={notification.type}
                      closable
                      action={
                        <Button
                          size="small"
                          onClick={() => {
                            navigate(`/ativo/${notification.idAsset}`);
                          }}
                        >
                          Detalhes
                        </Button>
                      }
                    />
                  ))}
                </>
              )}
            </>
          </Layout>
        </>
      )}
    </Layout>
  );
};
