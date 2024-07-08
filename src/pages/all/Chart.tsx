import React from 'react';
import Breadcrumb from '../../components/all/Breadcrumbs/Breadcrumb';
import ChartOne from '../../components/all/Charts/ChartOne';
import ChartThree from '../../components/all/Charts/ChartThree';
import ChartTwo from '../../components/all/Charts/ChartTwo';
import DefaultLayout from '../../layout/DefaultLayout';

const Chart: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
      </div>
    </DefaultLayout>
  );
};

export default Chart;
