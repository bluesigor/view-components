import { FC } from "react";
import AuthBase from "../AuthBase";
import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPasswordContainer: FC = () => {
  return (
    <AuthBase>
      <ForgotPasswordForm />
    </AuthBase>
  );
};

export default ForgotPasswordContainer;
