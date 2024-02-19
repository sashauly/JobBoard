import { Link } from "react-router-dom";
import { FaList, FaListCheck } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";

import "./Sidebar.css";

export default function Sidebar() {
  const name = "Your name";
  const email = "Your email";
  const role = "Your role";

  return (
    <>
      <div id="sidebar">
        <nav>
          <ul>
            <li>
              <Link to={`/vacancies`}>
                <FaList />
                <span>Vacancies</span>
              </Link>
            </li>
            <li>
              <Link to={`/my-vacancies`}>
                <FaListCheck />
                <span>My Vacancies</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="bottom">
          <div>
            <p>{name}</p>
            <p>{email}</p>
            <p>{role}</p>
          </div>
          <button
            id="logout"
            type="button"
            aria-label="Logout"
            title="Logout"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            <MdLogout />
          </button>
        </div>
      </div>
    </>
  );
}
