import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/all/PageTitle';
import SignIn from './pages/all/Authentication/SignIn';
import NotFound from './pages/all/Authentication/404';
import SignUp from './pages/all/Authentication/SignUp';
import Calendar from './pages/all/Calendar';
import Chart from './pages/all/Chart';
import ECommerce from './pages/all/Dashboard/ECommerce';
import FormElements from './pages/all/Form/FormElements';
import FormLayout from './pages/all/Form/FormLayout';
import Profile from './pages/all/Profile';
import Settings from './pages/all/Settings';
import Tables from './pages/all/Tables';
import Alerts from './pages/all/UiElements/Alerts';
import Buttons from './pages/all/UiElements/Buttons';
import Appointments from './pages/actual/appointments/appointments';
import CompletedAppointments from './pages/actual/appointments/completed-appointments';
import CancelleddAppointments from './pages/actual/appointments/cancelled-appointments';
import AddServices from './pages/actual/services/add-services';
import Services from './pages/actual/services/Services';
import DeletedServices from './pages/actual/services/deleted-services';
import ContactSubmission from './pages/actual/contactssubmission/ContactsSubmission';

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);


  const loggedin = localStorage.getItem("loggedin") === "true";

  return loading ? (
    <Loader />
  ) : (
    <>
        {loggedin == true ? (
        <Routes>
          <Route
            // index
            path="/"
            element={
              <>
                <PageTitle title=" Dashboard | Imperial Look " />
                <ECommerce />
              </>
            }
          />
          <Route
            path="/appointments"
            element={
              <>
                <PageTitle title="Appointments | Imperial Look " />
                <Appointments />
              </>
            }
          />
          <Route
            path="/completed-appointments"
            element={
              <>
                <PageTitle title="Completed Appointments | Imperial Look " />
                <CompletedAppointments />
              </>
            }
          />
          <Route
            path="/cancelled-appointments"
            element={
              <>
                <PageTitle title="Cancelled Appointments | Imperial Look " />
                <CancelleddAppointments />
              </>
            }
          />
          <Route
            path="/services"
            element={
              <>
                <PageTitle title="Active Services | Imperial Look " />
                <Services />
              </>
            }
          />
          <Route
            path="/add-services"
            element={
              <>
                <PageTitle title="Add Services | Imperial Look " />
                <AddServices />
              </>
            }
          />
          <Route
            path="/deleted-services"
            element={
              <>
                <PageTitle title="Deleted Services | Imperial Look " />
                <DeletedServices />
              </>
            }
          />
          <Route
            path="/contact-submissions"
            element={
              <>
                <PageTitle title="Contact Submissions | Imperial Look " />
                <ContactSubmission />
              </>
            }
          />
          {/* <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | Imperial Look " />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | Imperial Look " />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | Imperial Look " />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | Imperial Look " />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | Imperial Look " />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | Imperial Look " />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | Imperial Look " />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | Imperial Look " />
              <Buttons />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | Imperial Look " />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | Imperial Look " />
              <SignUp />
            </>
          }
        /> */}
        </Routes>
      ) : (
        <Routes>
              <Route
                path="/"
                element={
                  <>
                    <PageTitle title="Signin | Imperial Look " />
                    <SignIn />
                  </>
                }
              />
              <Route
                path="*"
                element={
                  <>
                    <PageTitle title="404 | Imperial Look " />
                    <NotFound />
                  </>
                }
              />
        </Routes>

      )}
    </>

  );
}

export default App;
