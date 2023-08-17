import React, { FC, useState } from "react";
import AuthService from "../../../core/services/auth.service";
import { useFormik } from "formik";
import * as Yup from "yup";
import CommonService from "../../../core/services/common.service";
import classNames from "classnames";
import { toast } from "react-toastify";
import ReactGA from "react-ga4";
import { spacesRemover } from "../../../core/functions/funtions";
import { useTranslation } from "react-i18next";

const ForgotPasswordForm: FC = () => {
  const [timeBlock, setTimeBlock] = useState(false);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const valueFormValidationSchema = Yup.object().shape({
    email_phone: Yup.string()
      .required("Email is required")
      .email("Invalid email"),
  });

  const formikForm = useFormik<{
    email_phone: string;
  }>({
    initialValues: {
      email_phone: "",
    },

    validationSchema: valueFormValidationSchema,
    onSubmit: async (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (values: any) => {
    setLoading(true);

    try {
      const response = await AuthService.forgotPassword(values.email_phone);

      setLoading(false);
      toast.success(response?.data?.message);
      setTimeBlock(true);
      setTimeout(() => {
        setTimeBlock(false);
      }, 10000);

      ReactGA.event({
        category: "password_recovery",
        action:
          process.env.REACT_APP_ANALYTICS_NAME === ""
            ? "password_recovery"
            : `password_recovery_${process.env.REACT_APP_ANALYTICS_NAME}`,
      });
    } catch (errors: any) {
      CommonService.showErrors(errors?.response?.data?.payload);
      toast.error(errors?.response?.data?.message);
    }
  };

  return (
    <div className="forgot-password">
      <div className="forgot-password__container">
        <form
          onSubmit={formikForm.handleSubmit}
          className="forgot-password__container-form"
        >
          <div className="auth__fields-input data-input">
            <label
              className={classNames({
                "data-input__details": true,
                "data-input__details-touched":
                  formikForm.touched.email_phone &&
                  formikForm.errors.email_phone,
              })}
            >
              {t<string>("AUTH.EMAIL")}
            </label>
            <input
              type="text"
              className={classNames({
                "data-input__field": true,
                "data-input__field-touched":
                  formikForm.touched.email_phone &&
                  formikForm.errors.email_phone,
                "about-box__field-inp-filled": formikForm.values.email_phone,
              })}
              placeholder="example@com"
              value={formikForm.values.email_phone}
              onChange={(event) => {
                formikForm.setFieldValue(
                  "email_phone",
                  spacesRemover(event.target.value)
                );
              }}
            />
            {formikForm.touched.email_phone &&
              formikForm.errors.email_phone && (
                <div className="form-control-error">
                  {formikForm.errors.email_phone}
                </div>
              )}
          </div>

          <button
            disabled={timeBlock}
            className={classNames({
              "about__submit-active": !timeBlock,
              about__submit: timeBlock,
            })}
            type={timeBlock ? "button" : "submit"}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
