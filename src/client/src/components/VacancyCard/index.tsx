import React, { useState } from "react";
import "./VacancyCard.css";
import { Link } from "react-router-dom";

type VacancyCard = {
  uid: string;
  title: string;
  description: string;
};

export default function VacancyCard({
  props: Vacancy,
}: {
  props: VacancyCard;
}) {
  const [applied, setApplied] = useState(true);
  return (
      <div className="vacancy-card">
        <div className="vacancy-info">
          <h2 className="title">{Vacancy.title}</h2>
          <p className="description">{Vacancy.description}</p>
        </div>
        {applied && <p className="applied">✅ You have applied</p>}
      </div>
  );
}
