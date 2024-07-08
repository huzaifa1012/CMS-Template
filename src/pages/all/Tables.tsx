import Breadcrumb from '../../components/all/Breadcrumbs/Breadcrumb';
import TableOne from '../../components/all/Tables/TableOne';
import TableThree from '../../components/all/Tables/TableThree';
import TableTwo from '../../components/all/Tables/TableTwo';
import DefaultLayout from '../../layout/DefaultLayout';

const Tables = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
      </div>
    </DefaultLayout>
  );
};

export default Tables;
