import { FC } from "react";

import LoginForm from "./LoginForm";
import AuthBase from "../AuthBase";

const LoginContainer: FC = () => {
  return (
    <AuthBase>
      <LoginForm />
    </AuthBase>
  );
};

export default LoginContainer;
