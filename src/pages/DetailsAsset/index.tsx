import './styles.css';

import { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { Loading } from '../../components/Loading';

import { getAsset, IAsset } from '../../interfaces/Asset';
import { Badge, Button, Descriptions, Layout, Progress, Tag } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { getCompany, ICompany } from '../../interfaces/Company';
import { getUnit, IUnit } from '../../interfaces/Unit';

export const DetailsAsset = () => {
  const { id } = useParams();

  if (!id) return <Navigate to="/" replace={true} />;

  let navigate = useNavigate();

  const [asset, setAsset] = useState<IAsset | null>(null);
  const [unit, setUnit] = useState<IUnit | null>(null);
  const [company, setCompany] = useState<ICompany | null>(null);

  const fetchData = useCallback(async () => {
    const assetData = await getAsset(Number(id));

    if (assetData) {
      setAsset(assetData);
      setUnit(await getUnit(assetData.unitId));
      setCompany(await getCompany(assetData.companyId));
    }

    setAsset(assetData);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout className="contentDetailAsset">
      {asset === null ? (
        <Loading size="large" />
      ) : (
        <>
          <img src={asset.image} alt={asset.name} />

          <Content className="description">
            <Button
              style={{ margin: '1% 0', width: '100%' }}
              type="primary"
              size="large"
              block
              onClick={() => {
                navigate(`/asset/${asset.id}/collect`);
              }}
            >
              Voltar para página inicial
            </Button>
            <Descriptions title="Informações do Ativo" bordered>
              <Descriptions.Item label="Nome:" span={3}>
                {asset.name}
              </Descriptions.Item>
              <Descriptions.Item label="Unidade/Empresa:" span={3}>
                {unit?.name}/{company?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Especificações:" span={3}>
                Temperatura máxima: {asset.specifications.maxTemp} ºC
                {asset.specifications.power && <br />}
                {asset.specifications.power &&
                  `Potência: ${asset.specifications.power}`}
                {asset.specifications.rpm && <br />}
                {asset.specifications.rpm && `RPM: ${asset.specifications.rpm}`}
              </Descriptions.Item>
              <Descriptions.Item label="Sensores:" span={3}>
                {asset.sensors.map((sensor, index) => (
                  <>
                    <Tag key={index} color="blue">
                      {sensor}
                    </Tag>
                    <br />
                  </>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Métricas:" span={3}>
                Total de coletas: {asset.metrics.totalCollectsUptime} <br />
                Total de horas coletadas: {asset.metrics.totalUptime.toFixed(
                  2
                )}{' '}
                horas
                <br />
                Ultima coleta:{' '}
                {new Date(asset.metrics.lastUptimeAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Estado:" span={3}>
                {asset.status === 'inAlert' && (
                  <Badge status="warning" text="Em Alerta" />
                )}
                {asset.status === 'inDowntime' && (
                  <Badge status="processing" text="Em Manutenção" />
                )}
                {asset.status === 'inOperation' && (
                  <Badge status="success" text="Em Operação" />
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Pontuação de saúde" span={3}>
                <Progress percent={asset.healthscore} />
              </Descriptions.Item>
            </Descriptions>
          </Content>
        </>
      )}
    </Layout>
  );
};
