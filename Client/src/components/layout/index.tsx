import { Outlet } from "react-router-dom";
import StudentNavbar from "../navbar/student-navbar";

const NavBarLayout = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <StudentNavbar />

      <div className="w-full flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default NavBarLayout;
