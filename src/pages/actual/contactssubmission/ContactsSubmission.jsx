import { useEffect, useState } from 'react';
import Breadcrumb from '../../../components/all/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';
import { getData } from '../../../util_functions/get_data';
import Contactapplicantstable from '../../../components/actual/contactapplicants/contactapplicantstable';
const ContactSubmission = () => {
  

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-270">
                <Breadcrumb pageName="Contact Applicants" />

                <Contactapplicantstable />

            </div >
        </DefaultLayout >
    );
};

export default ContactSubmission;
