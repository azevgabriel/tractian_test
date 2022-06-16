import './styles.css';

import React, { useCallback, useEffect, useState } from 'react';
import { Column, Pie, G2 } from '@ant-design/plots';
import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { getAssets } from '../../../interfaces/Asset';
import { useAuth } from '../../../hooks/auth';

interface IDataTemp {
  name: string;
  maxTemp: number;
}

interface IDataStatus {
  status: string;
  count: number;
}

export const OverviewRightContent: React.FC = () => {
  const { user } = useAuth();

  const [dataTemp, setDataTemp] = useState<IDataTemp[] | null>(null);
  const [dataStatus, setDataStatus] = useState<IDataStatus[] | null>(null);

  const fetchData = useCallback(async () => {
    let assets = await getAssets();

    if (user?.type !== 'admin')
      assets = assets.filter((asset) => asset.companyId === user?.companyId);

    const inAlert = assets.filter((asset) => asset.status === 'inAlert');
    const inDowntime = assets.filter((asset) => asset.status === 'inDowntime');
    const inOperation = assets.filter(
      (asset) => asset.status === 'inOperation'
    );

    const dataStatus: IDataStatus[] = [
      { status: 'inAlert', count: inAlert.length },
      { status: 'inDowntime', count: inDowntime.length },
      { status: 'inOperation', count: inOperation.length },
    ];

    //only name and temp are needed
    let dataTemp: IDataTemp[] = [];
    assets.forEach((asset) => {
      if (asset.specifications.maxTemp)
        dataTemp.push({
          name: asset.name,
          maxTemp: asset.specifications.maxTemp,
        });
    });

    setDataTemp(dataTemp);
    setDataStatus(dataStatus);
  }, [user]);

  // const DemoPie = useCallback(() => {
  //   const G = G2.getEngine('canvas');
  //   const data = [
  //     { status: 'inAlert', value: dataStatus?.[0]?.count || 0 },
  //     { status: 'inDowntime', value: dataStatus?.[1]?.count || 0 },
  //     { status: 'inOperation', value: dataStatus?.[2]?.count || 0 },
  //   ];
  //   const cfg = {
  //     appendPadding: 10,
  //     data,
  //     angleField: 'value',
  //     colorField: 'type',
  //     radius: 0.75,
  //     legend: false,
  //     label: {
  //       type: 'spider',
  //       labelHeight: 40,
  //       formatter: (data: any, mappingData: any) => {
  //         const group = new G.Group({});
  //         group.addShape({
  //           type: 'circle',
  //           attrs: {
  //             x: 0,
  //             y: 0,
  //             width: 40,
  //             height: 50,
  //             r: 5,
  //             fill: mappingData.color,
  //           },
  //         });
  //         group.addShape({
  //           type: 'text',
  //           attrs: {
  //             x: 10,
  //             y: 8,
  //             text: `${data.status}`,
  //             fill: mappingData.color,
  //           },
  //         });
  //         group.addShape({
  //           type: 'text',
  //           attrs: {
  //             x: 0,
  //             y: 25,
  //             text: `${data.count * 100}`,
  //             fill: 'rgba(0, 0, 0, 0.65)',
  //             fontWeight: 700,
  //           },
  //         });
  //         return group;
  //       },
  //     },
  //     interactions: [
  //       {
  //         type: 'element-selected',
  //       },
  //       {
  //         type: 'element-active',
  //       },
  //     ],
  //   };
  //   const config = cfg;

  //   return <Pie {...config} />;
  // }, [dataStatus]);

  useEffect(() => {
    if (!dataStatus && !dataTemp) fetchData();
  }, [dataStatus, dataTemp]);

  return (
    <>
      <Layout className="halfScreen">
        <Content className="halfLayout"></Content>
        <Content className="halfLayout">
          <Column
            data={dataTemp ? dataTemp : []}
            xField="name"
            yField="maxTemp"
            seriesField="maxTemp"
            color={({ maxTemp }) => {
              if (parseInt(maxTemp) >= 0 && parseInt(maxTemp) <= 55) {
                return '#ffd8bf';
              } else if (parseInt(maxTemp) >= 56 && parseInt(maxTemp) <= 60) {
                return '#ffbb96';
              } else if (parseInt(maxTemp) >= 61 && parseInt(maxTemp) <= 65) {
                return '#ff9c6e';
              } else if (parseInt(maxTemp) >= 66 && parseInt(maxTemp) <= 70) {
                return '#ff7a45';
              } else if (parseInt(maxTemp) >= 71 && parseInt(maxTemp) <= 75) {
                return '#fa541c';
              } else {
                return '#d4380d';
              }
            }}
            legend={false}
            xAxis={{
              label: {
                autoHide: true,
                autoRotate: false,
              },
            }}
          />
        </Content>
      </Layout>
      <Layout className="halfScreen">
        <Content className="halfLayout"></Content>
        <Content className="halfLayout">{/* <DemoPie /> */}</Content>
      </Layout>
    </>
  );
};
