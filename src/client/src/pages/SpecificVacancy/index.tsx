import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VacancyContext } from "../../context/VacancyContext";
import "./SpecificVacancy.css";

export default function SpecificVacancyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vacancies = useContext(VacancyContext);
  const vacancy = vacancies.find((vacancy) => vacancy.uid === id);

  const handleClose = () => {
    navigate("..");
  };
  return (
    <div className="specific-vacancy-page">
      <div className="top-details">
        <div className="status">
          <p>{vacancy?.isActive ? "Open" : "Closed"}</p>

          <button type="button" aria-label="Close" onClick={handleClose}>
            <span>❌</span>
          </button>
        </div>
        <div className="vacancy-base-info">
          <h2 className="title">{vacancy?.title}</h2>

          <p>English: {vacancy?.englishLevel}</p>
          <p>Grade: {vacancy?.grade}</p>
        </div>
      </div>
      <p>Description: {vacancy?.description}</p>

      <div className="middle-details">
        <p>Who needs you: {vacancy?.employer}</p>
        <p>Created: {vacancy?.createdAt}</p>
      </div>
      <p>Tags: {vacancy?.tags.map((tag) => `${tag}, `)}</p>
      <button type="button" aria-label="Apply">
        Apply
      </button>
    </div>
  );
}
