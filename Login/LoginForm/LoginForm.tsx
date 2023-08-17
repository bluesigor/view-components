import { FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "@react-oauth/google";
import ReactGA from "react-ga4";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import classNames from "classnames";
import jwtDecode from "jwt-decode";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";

import AuthService from "../../../core/services/auth.service";
import { PrivateUIRoutes, UIRoutes } from "../../../core/router";
import CommonService from "../../../core/services/common.service";
import { Auth } from "../../../core/models";

import passwordEye from "../../../assets/photos/all/password-eye.svg";
import facebook from "../../../assets/photos/all/login-facebook.svg";
import google from "../../../assets/photos/all/login-google.svg";
import secured from "../../../assets/photos/all/secured.svg";
import { useAppDispatch, useAppSelector } from "../../../core/store";
import { setModal } from "../../../core/store/reducers/modal/modalSlice";
import { setIsAuth } from "../../../core/store/reducers/auth/authSlice";
import { spacesRemover } from "../../../core/functions/funtions";
import { useTranslation } from "react-i18next";

const LoginForm: FC = () => {
  const [loading, setLoading] = useState(false);
  const [fieldChanger, setFieldChanger] = useState("email");
  const [password, setPassword] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loginRoute } = useAppSelector((state) => state.app);

  const location = useLocation();

  const valueFormValidationSchema = Yup.object().shape({
    email_phone: Yup.string().required("Fill in your email or phone"),
    password: Yup.string()
      .min(8, "Minimum 8 symbols")
      .required("Password is required"),
  });

  const formikForm = useFormik<{
    email_phone: string;
    password: string;
  }>({
    initialValues: {
      email_phone: "",
      password: "",
    },
    validationSchema: valueFormValidationSchema,
    onSubmit: async (values) => {
      handleSubmitForm(values);
    },
  });

  const handleFacebookSignIn = async (values: any) => {
    try {
      const response = await AuthService.loginFacebook(
        values.accessToken,
        values.data_access_expiration_time,
        values.email,
        values.expiresIn,
        values.grantedScopes,
        values.graphDomain,
        values.id,
        values.name,
        JSON.stringify(values.picture),
        values.signedRequest,
        values.userID
      );

      localStorage.setItem(
        process.env.REACT_APP_TOKEN_KEY,
        response.data.payload.token
      );

      dispatch(setIsAuth(true));
      setLoading(false);
      if (!loginRoute) {
        response?.data?.payload.role === "admin" ||
        response?.data?.payload.role === "super_admin"
          ? navigate(`/${UIRoutes.ADMIN}/${PrivateUIRoutes.ADMIN_PANEL}`)
          : navigate(`/${UIRoutes.ACCOUNT}/${UIRoutes.PROFILE}`);
      } else {
        navigate(`/${UIRoutes.ACCOUNT}/${PrivateUIRoutes.QUESTIONNAIRE}`);
      }

      ReactGA.event({
        category: "login",
        action:
          process.env.REACT_APP_ANALYTICS_NAME === ""
            ? "login"
            : `login_${process.env.REACT_APP_ANALYTICS_NAME}`,
      });

      localStorage.removeItem("prevPage");
      formikForm.resetForm();
      document.body.style.overflowY = "scroll";
      dispatch(setModal(false));
    } catch (errors: any) {
      setLoading(false);
      errors?.response?.data?.payload
        ? CommonService.showErrors(errors?.response?.data?.payload)
        : toast.error(errors?.response?.data?.message);
    }
  };

  const handleGoogleSignIn = async (values: any) => {
    setLoading(true);
    try {
      const encoded_values: Auth.GoogleLogin = jwtDecode(values.credential);
      const response = await AuthService.loginGoogle(encoded_values);
      localStorage.setItem(
        process.env.REACT_APP_TOKEN_KEY,
        response.data.payload.token
      );
      dispatch(setIsAuth(true));
      setLoading(false);
      if (!loginRoute) {
        response?.data?.payload.role === "admin" ||
        response?.data?.payload.role === "super_admin"
          ? navigate(`/${UIRoutes.ADMIN}/${PrivateUIRoutes.ADMIN_PANEL}`)
          : navigate(`/${UIRoutes.ACCOUNT}/${UIRoutes.PROFILE}`);
      } else {
        navigate(`/${UIRoutes.ACCOUNT}/${PrivateUIRoutes.QUESTIONNAIRE}`);
      }

      ReactGA.event({
        category: "login",
        action:
          process.env.REACT_APP_ANALYTICS_NAME === ""
            ? "login"
            : `login_${process.env.REACT_APP_ANALYTICS_NAME}`,
      });

      localStorage.removeItem("prevPage");
      document.body.style.overflowY = "scroll";
      formikForm.resetForm();
      dispatch(setModal(false));
    } catch (errors: any) {
      setLoading(false);
      CommonService.showErrors(errors?.response?.data?.payload);
      toast.error(errors?.response?.data?.message);
    }
  };

  const handleSubmitForm = async (values: any) => {
    setLoading(true);

    try {
      const response = await AuthService.login(
        values.email_phone,
        values.password
      );

      localStorage.setItem(
        process.env.REACT_APP_TOKEN_KEY,
        response.data.payload.token
      );

      dispatch(setIsAuth(true));
      setLoading(false);
      document.body.style.overflowY = "scroll";
      dispatch(setModal(false));

      if (!loginRoute) {
        response?.data?.payload.role === "admin" ||
        response?.data?.payload.role === "super_admin"
          ? navigate(`/${UIRoutes.ADMIN}/${PrivateUIRoutes.ADMIN_PANEL}`)
          : navigate(`/${UIRoutes.ACCOUNT}/${UIRoutes.PROFILE}`);
      } else {
        navigate(`/${UIRoutes.ACCOUNT}/${PrivateUIRoutes.QUESTIONNAIRE}`);
      }

      ReactGA.event({
        category: "login",
        action:
          process.env.REACT_APP_ANALYTICS_NAME === ""
            ? "login"
            : `login_${process.env.REACT_APP_ANALYTICS_NAME}`,
      });

      localStorage.removeItem("prevPage");
      formikForm.resetForm();
    } catch (errors: any) {
      CommonService.showErrors(errors?.response?.data?.payload);
      toast.error(errors?.response?.data?.message);
    }
  };

  return (
    <section className="entry">
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          formikForm.handleSubmit(e);
        }}
        className="entry__auth">
        <p className="auth__title">{t<string>("AUTH.LOGIN_TITLE")}</p>
        <div className="auth__fields">
          <div className="auth__fields-input data-input">
            <label
              className={classNames({
                "data-input__selector": true,
                "data-input__details-touched":
                  formikForm.touched.email_phone &&
                  formikForm.errors.email_phone,
              })}>
              <span
                onClick={() => {
                  formikForm.setFieldValue("email_phone", "");
                  setFieldChanger("email");
                }}
                className={classNames({
                  "data-input__selector-clicker": true,
                  "data-input__selector-clicker-active":
                    fieldChanger === "email",
                  "data-input__selector-clicker-touched":
                    formikForm.touched.email_phone &&
                    formikForm.errors.email_phone,
                })}>
                {t<string>("AUTH.EMAIL")}
              </span>
              /
              <span
                onClick={() => {
                  formikForm.setFieldValue("email_phone", "");
                  setFieldChanger("phone");
                }}
                className={classNames({
                  "data-input__selector-clicker": true,
                  "data-input__selector-clicker-active":
                    fieldChanger === "phone",
                  "data-input__selector-clicker-touched":
                    formikForm.touched.email_phone &&
                    formikForm.errors.email_phone,
                })}>
                {t<string>("AUTH.PHONE")}
              </span>
            </label>
            {fieldChanger === "email" && (
              <input
                type="text"
                className={classNames({
                  "data-input__field": true,
                  "data-input__field-touched":
                    formikForm.touched.email_phone &&
                    formikForm.errors.email_phone,
                  "data-input__field-filled": formikForm.values.email_phone,
                })}
                placeholder="Alexmatinsov98@gmail.com"
                value={formikForm.values.email_phone}
                onChange={(event) => {
                  formikForm.setFieldValue(
                    "email_phone",
                    spacesRemover(event.target.value)
                  );
                }}
              />
            )}
            {fieldChanger === "phone" && (
              <div className="data-input__number-field">
                <PhoneInput
                  placeholder="_ ___ __ __ __"
                  enableSearch={true}
                  countryCodeEditable={false}
                  country="bg"
                  value={formikForm.values.email_phone}
                  dropdownClass="phone-dropdown"
                  inputClass={classNames({
                    "form-control": true,
                    "form-control-touched":
                      formikForm.touched.email_phone &&
                      formikForm.errors.email_phone,
                  })}
                  onChange={(phone) => {
                    formikForm.setFieldValue("email_phone", phone);
                  }}
                />
              </div>
            )}
            {formikForm.touched.email_phone &&
              formikForm.errors.email_phone && (
                <div className="form-control-error">
                  {formikForm.errors.email_phone}
                </div>
              )}
          </div>
          <div className="auth__fields-input data-input">
            <div
              className={classNames({
                "data-input__details": true,
                "data-input__details-touched":
                  formikForm.touched.password && formikForm.errors.password,
              })}>
              {t<string>("AUTH.PASSWORD")}
            </div>
            <input
              type={password ? "text" : "password"}
              className={classNames({
                "data-input__field": true,
                "data-input__field-touched":
                  formikForm.touched.password && formikForm.errors.password,
                "data-input__field-filled": formikForm.values.password,
              })}
              placeholder={t<string>("AUTH.PASSWORD_PLACEHOLDER")}
              autoComplete="on"
              value={formikForm.values.password}
              onChange={(event) => {
                formikForm.setFieldValue(
                  "password",
                  spacesRemover(event.target.value)
                );
              }}
            />
            {formikForm.touched.password && formikForm.errors.password && (
              <div className="form-control-error">
                {formikForm.errors.password}
              </div>
            )}
            <button
              className="data-input__eye"
              type="button"
              onClick={() => setPassword(!password)}>
              <img src={passwordEye} alt="close eye" />
            </button>
            <div className="data-input__forgot">
              <button
                className="data-input__forgot-btn"
                type="button"
                onClick={() => {
                  navigate(`/${UIRoutes.AUTH}/${UIRoutes.FORGOT_PASSWORD}`);
                  dispatch(setModal(false));
                }}>
                {t<string>("AUTH.FORGOT_PASSWORD")}
              </button>
            </div>
          </div>
        </div>
        <div className="auth__submit">
          <button className="auth__submit-btn" type="submit">
            {t<string>("AUTH.LOGIN_BUTTON")}
          </button>
        </div>
      </form>
      <div className="entry__social social-login">
        <div className="social-login__decor">
          <div className="social-login__decor-line"></div>
          <span className="social-login__decor-txt">
            {t<string>("AUTH.OR")}
          </span>
          <span className="social-login__decor-txt social-login__decor-txt-mobile">
            {t<string>("AUTH.OR_LOGIN_WITH")}
          </span>
          <div className="social-login__decor-line"></div>
        </div>
        <div className="social-login__networks">
          <label className="social-login__networks-btn networks-btn">
            <div className="networks-btn__visible">
              <img
                className="networks-btn__visible-icon"
                src={facebook}
                alt="facebook"
              />
              <span className="networks-btn__visible-text">
                {t<string>("AUTH.LOGIN_FACEBOOK")}
              </span>
              <span className="networks-btn__visible-text-mobile">
                {t<string>("AUTH.FACEBOOK")}
              </span>
            </div>
            <div className="networks-btn__block">
              <button
                onClick={() => {
                  window.FB.login(
                    (res: any) => {
                      sessionStorage.setItem(
                        "accessToken",
                        JSON.stringify(res?.authResponse?.accessToken)
                      );
                      if (res.status === "connected") {
                        window.FB.api(
                          "/me?fields=id,email,name,picture",
                          function (data: any) {
                            handleFacebookSignIn({
                              ...res.authResponse,
                              ...data,
                              picture: data.picture,
                            });
                          }
                        );
                      }
                    },
                    { scope: "public_profile,email" }
                  );
                }}></button>
            </div>
          </label>
          <label
            className="social-login__networks-btn networks-btn"
            style={{
              position: "relative",
              minHeight: "40px",
            }}>
            <div
              className="networks-btn__visible"
              style={{
                position: "absolute",
                width: "100%",
              }}>
              <img
                className="networks-btn__visible-icon"
                src={google}
                alt="google"
              />
              <span className="networks-btn__visible-text">
                {t<string>("AUTH.LOGIN_GOOGLE")}
              </span>
              <span className="networks-btn__visible-text-mobile">
                {t<string>("AUTH.GOOGLE")}
              </span>
            </div>
            <div
              className="networks-btn__block"
              style={{
                position: "absolute",
                opacity: 0,
                zIndex: 10,
                display: "block",
              }}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleGoogleSignIn(credentialResponse);
                }}
              />
            </div>
          </label>
        </div>
        <div className="entry__secured">
          <img className="entry__secured-icon" src={secured} alt="secured" />
          <span className="entry__secured-txt">
            {t<string>("AUTH.SAFE_SECURE")}
          </span>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
