import { useNavigate } from "react-router-dom";

const CardJob = (props) => {
  const navigate = useNavigate();

  return (
    <div className="card card-job border-0 shadow-sm mb-3" onClick={() => navigate("/detail/" + props.id)}>
      <div className="card-body d-flex gap-3 align-items-center">
        <div className="inisial">{props.company.charAt(0)}</div>
        <div>
          <h5 className="card-title mb-1">{props.title}</h5>
          <p className="text-muted mb-2">{props.company}</p>
          <span className="badge bg-light text-dark border me-2">📍 {props.location}</span>
          <span className="text-success fw-bold">{props.salary}</span>
        </div>
      </div>
    </div>
  );
};

export default CardJob;
