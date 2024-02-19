import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Root() {
  return (
    <>
      <Sidebar />
      <main>
        <div className="wrapper">
          <Outlet />
        </div>
      </main>
    </>
  );
}
