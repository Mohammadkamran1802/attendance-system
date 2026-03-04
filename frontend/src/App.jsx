import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/authContext";

const App = () => {
  const {loading} = useAuth();

  if(loading) {
    return <div style={{ textAlign: "center", marginTop: 50 }}>Loading...</div>;
  }
  return (
    <>
      <AppRoutes />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
};

export default App;
