import { Link, Outlet, useParams } from "react-router-dom";
import VacancyCard from "../../components/VacancyCard";
import "./VacanciesPage.css";
import { VacancyContext } from "../../context/VacancyContext";
import { useContext } from "react";

export default function Vacancies() {
  const { id } = useParams();
  const vacancies = useContext(VacancyContext);

  return (
    <>
      <VacancyContext.Provider value={vacancies}>
        <div className="vacancies-page">
          <div className="wrapper">
            <h1>Vacancies</h1>
            {vacancies.length === 0 ? (
              <p>No vacancies</p>
            ) : (
              vacancies.map((vacancy) => (
                <Link to={`/vacancies/${vacancy.uid}`} key={vacancy.uid}>
                  <VacancyCard props={vacancy} />
                </Link>
              ))
            )}
          </div>
          {id && (
            <div className="vacancy-details">
              <Outlet />
            </div>
          )}
        </div>
      </VacancyContext.Provider>
    </>
  );
}
