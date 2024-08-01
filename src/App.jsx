import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicView from "./views/PublicView";
import LoginView from "./views/LoginView";
import GuestView from "./views/GuestView";
import ContactView from "./views/ContactView";
import TagView from "./views/TagView";
import ProfileView from "./views/ProfileView";
import ProtectedRoute from "./components/Utils/ProtectedRoute";
import ProtectedLayout from "./components/Utils/ProtectedLayout";
import {
  userId,
  guestViewColumns,
  guestViewFilters,
  guestFormFields,
  profileViewFields,
} from "./config/Config";
import { BackgroundImageProvider } from "./context/BackgroundImageContext";

const App = () => {
  return (
    <BackgroundImageProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
        />
        <Routes>
          <Route path="/" element={<PublicView userId={userId} />} />
          <Route path="/login" element={<LoginView />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedLayout />}>
              <Route
                path="/guests"
                element={
                  <GuestView
                    visibleColumns={guestViewColumns}
                    visibleFilters={guestViewFilters}
                    visibleFormFields={guestFormFields}
                  />
                }
              />
              <Route path="/tags" element={<TagView />} />
              <Route path="/contacts" element={<ContactView />} />
              <Route
                path="/profile"
                element={<ProfileView visibleFields={profileViewFields} />}
              />
            </Route>
          </Route>
        </Routes>
      </Router>
    </BackgroundImageProvider>
  );
};

export default App;
