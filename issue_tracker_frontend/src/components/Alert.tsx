import { ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
  onClick: () => void;
}

const Alert = ({ children, onClick }: AlertProps) => {
  return (
    <div className="alert alert-primary alert-dismissable" role="alert">
      {children}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={onClick}
      ></button>
    </div>
  );
};

export default Alert;
