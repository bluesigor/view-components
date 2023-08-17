import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import { AppContext, ProfileListCategory } from "../../../App";
import NotificationPopup from "../../NotificationPopup";

import { useAppDispatch, useAppSelector } from "../../../core/store";
import {
  AuthSelectionType,
  CalculatorTypes,
} from "../../../core/services/enums";
import { UIRoutes } from "../../../core/router";
import { loansList } from "../../../core/constants/loansList";
import useAuth from "../../../core/hooks/useAuth";
import {
  setModal,
  setModalType,
  setShowNotification,
} from "../../../core/store/reducers/modal/modalSlice";
import { APIRoutes } from "../../../core/http";
import useHttpGet from "../../../core/hooks/useHttpGet";
import {
  setAppLanguage,
  setLoginRoute,
  setNotifications,
} from "../../../core/store/reducers/app/appDataSlice";

import accountLogo from "../../../assets/photos/all/account.svg";
import accountMobile from "../../../assets/photos/all/account-mobile.svg";
import loans from "../../../assets/photos/all/loans.svg";
import creditCard from "../../../assets/photos/all/credit-card.svg";
import insured from "../../../assets/photos/all/insured.svg";
import divider from "../../../assets/photos/all/lang-divider.svg";
import alert from "../../../assets/photos/all/alert.svg";
import arrow from "../../../assets/photos/all/select-arrow-small.svg";
import verified from "../../../assets/photos/all/verified.svg";
import nonVerified from "../../../assets/photos/all/not-verified.svg";
import defaultAvatar from "../../../assets/photos/profile/default-avatar.svg";
import user_icon from "../../../assets/photos/all/user-icon.svg";
import { chatOpener } from "../../../core/functions/funtions";

const AppHeader: React.FC = () => {
  const [loansSelect, setLoansSelect] = useState(false);
  const [profileWindow, setProfileWindow] = useState(false);

  const [filter] = useState({ "[filter][showed][like]": 0 });

  const appContext = useContext(AppContext);

  const { appLanguage, notifications } = useAppSelector((state) => state.app);
  const { showNotification, modalType } = useAppSelector(
    (state) => state.modal
  );

  const dispatch = useAppDispatch();

  const {
    setSelectedLoan,
    setSelectionType,
    setProfileCategory,
    reloadChecker,
  } = appContext;

  const user = JSON.parse(localStorage.getItem("savedUser") || "{}");

  const { isAuth } = useAuth();

  const { t, i18n } = useTranslation();

  useHttpGet<any>(`${APIRoutes.USER_NOTIFICATIONS}`, {
    query: { ...filter },
    dependencies: [filter, showNotification, reloadChecker],
    condition: isAuth,
    resolve: (response) => {
      dispatch(setNotifications(response.payload.collection));
    },
  });

  const setLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    sessionStorage.setItem("lng", lng);
    dispatch(setAppLanguage(lng));
  };

  useEffect(() => {
    let lng = sessionStorage.getItem("lng");

    dispatch(setAppLanguage(lng || "bg"));
  }, []);

  return (
    <div className="layout-header">
      <div className="layout-header__first">
        <div className="layout-header__first-container nav">
          <div className="nav__list-item nav-profile__list-item main-logo ">
            <Link to={`/`}>
              <img
                className="nav__logo"
                src={require(`../../../${process.env.REACT_APP_LOGO_NAME}`)}
                alt="assistent logo"
              />
            </Link>
          </div>
          <ul className="nav__list">
            <li className="nav__list-item">
              <Link to={`/${UIRoutes.FINANCE}`}>
                {t<string>("COMMON.FINANCE")}
              </Link>
            </li>
            <li className="nav__list-item">
              <Link to={`/${UIRoutes.BANKS_RATING}`}>
                {t<string>("COMMON.RATING")}
              </Link>
            </li>
            <li className="nav__list-item">
              <Link to={`/${UIRoutes.ABOUT_US}`}>
                {t<string>("COMMON.ABOUT_US")}
              </Link>
            </li>
            <li className="nav__list-item">
              <Link to={`/${UIRoutes.NEWS}`}>{t<string>("COMMON.NEWS")}</Link>
            </li>
            <li className="nav__list-item">
              <Link to={`/${UIRoutes.FAQ}`}>{t<string>("COMMON.FAQ")}</Link>
            </li>
          </ul>
          <div className="nav__options">
            <div className="nav__options-lang lang">
              <button
                className={classNames({
                  lang__btn: true,
                  "lang__btn-selected": appLanguage === "bg",
                })}
                onClick={() => setLanguage("bg")}
              >
                {t<string>("COMMON.BG")}
              </button>
              <img className="lang__line" src={divider} alt="divider"></img>
              <button
                className={classNames({
                  lang__btn: true,
                  "lang__btn-selected": appLanguage === "en",
                })}
                onClick={() => setLanguage("en")}
              >
                {t<string>("COMMON.EN")}
              </button>
            </div>
            {isAuth && (
              <button
                onMouseEnter={() => {
                  dispatch(setShowNotification(true));
                  dispatch(setModalType("notifications"));
                }}
                onMouseLeave={() => {
                  dispatch(setShowNotification(false));
                  dispatch(setModalType(""));
                }}
                className="nav__options-alert"
              >
                <img
                  className="nav__options-alert-img"
                  src={alert}
                  alt="notifications"
                />
                {notifications.filter(
                  (notification) => notification.showed === 0
                ).length > 0 && (
                  <div className="nav__options-alert-count">
                    {
                      notifications.filter(
                        (notification) => notification.showed === 0
                      ).length
                    }
                  </div>
                )}
              </button>
            )}
            {showNotification && modalType === "notifications" && (
              <NotificationPopup />
            )}

            <div className="nav__options-profile profile-options">
              {isAuth ? (
                <div
                  className="profile-options__link"
                  onMouseEnter={() => setProfileWindow(true)}
                  onMouseLeave={() => setProfileWindow(false)}
                >
                  <img src={accountLogo} alt="account logo" />
                  <p className="profile-options__link-item">
                    {t<string>("COMMON.ACCOUNT")}
                  </p>
                </div>
              ) : (
                <div className="profile-options__buttons">
                  <img src={user_icon} alt="user" />
                  <button
                    className="profile-options__buttons-click login-btn-header"
                    onClick={() => {
                      dispatch(setModalType(AuthSelectionType.Auth));
                      setSelectionType(AuthSelectionType.Register);
                      window.scrollTo(0, 0);
                      dispatch(setModal(true));
                      dispatch(setLoginRoute(false));
                      document.body.style.overflow = "hidden";
                    }}
                  >
                    {t<string>("COMMON.LOG_IN")}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="nav__mobile-options">
            <button className="nav__mobile-options-btn">
              <span onClick={() => chatOpener()}>
                {t<string>("COMMON.HELP_ME")}
              </span>
            </button>
            <button
              onClick={() => {
                if (isAuth) {
                  setProfileWindow(!profileWindow);
                } else {
                  dispatch(setModalType(AuthSelectionType.Auth));
                  setSelectionType(AuthSelectionType.Login);
                  dispatch(setModal(true));
                  document.body.style.overflow = "hidden";
                }
              }}
            >
              <img
                className="nav__mobile-options-img"
                src={accountMobile}
                alt="account"
              />
            </button>
          </div>
          {profileWindow && (
            <div
              className="profile-link"
              onMouseEnter={() => setProfileWindow(true)}
              onMouseLeave={() => setProfileWindow(false)}
            >
              <div className="profile-link__user">
                <div className="profile-link__user-detailed">
                  <img
                    src={user?.avatar ? user?.avatar : defaultAvatar}
                    alt="avatar"
                  />
                  <h2 className="profile-link__user-name">
                    {user?.first_name && user?.last_name
                      ? `${user?.first_name} ${user.last_name}`
                      : "User"}
                  </h2>
                </div>
                <div className="profile-link__user-status">
                  {user?.verified ? (
                    <img src={verified} alt="verified" />
                  ) : (
                    <img src={nonVerified} alt="not verified" />
                  )}
                  <div className="profile-link__user-status-txt">
                    {user?.verified ? (
                      <span>{t<string>("COMMON.VERIFIED")}</span>
                    ) : (
                      <span>{t<string>("COMMON.NOT_VERIFIED")}</span>
                    )}
                  </div>
                </div>
              </div>
              {user.role === "admin" || user.role === "super_admin" ? (
                <div className="profile-link__follow">
                  <div className="profile-link__follow-box">
                    <Link
                      onClick={() =>
                        setProfileCategory(ProfileListCategory.Questionnaires)
                      }
                      to={`/${UIRoutes.ACCOUNT}/${UIRoutes.PROFILE}`}
                      className="profile-link__follow-box-url"
                    >
                      {t<string>("COMMON.PROFILE")}
                    </Link>
                  </div>
                  <div className="profile-link__follow-box">
                    <button
                      className="profile-link__follow-box-logout"
                      onClick={() => {
                        dispatch(setModalType(AuthSelectionType.Logout));
                        dispatch(setModal(true));
                        document.body.style.overflow = "hidden";
                      }}
                    >
                      {t<string>("COMMON.LOG_OUT")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-link__follow">
                  <div className="profile-link__follow-box">
                    <Link
                      onClick={() =>
                        setProfileCategory(ProfileListCategory.Questionnaires)
                      }
                      to={`/${UIRoutes.ACCOUNT}/${UIRoutes.PROFILE}`}
                      className="profile-link__follow-box-url"
                    >
                      {t<string>("PROFILE.MY_QUESTIONNAIRES")}
                    </Link>
                  </div>
                  <div className="profile-link__follow-box">
                    <Link
                      onClick={() =>
                        setProfileCategory(ProfileListCategory.Reviews)
                      }
                      to={`/${UIRoutes.ACCOUNT}/${UIRoutes.PROFILE}`}
                      className="profile-link__follow-box-url"
                    >
                      {t<string>("PROFILE.MY_REVIEWS")}
                    </Link>
                  </div>
                  <div className="profile-link__follow-box">
                    <button
                      className="profile-link__follow-box-logout"
                      onClick={() => {
                        dispatch(setModalType(AuthSelectionType.Logout));
                        dispatch(setModal(true));
                        document.body.style.overflow = "hidden";
                      }}
                    >
                      {t<string>("COMMON.LOG_OUT")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="layout-header__second">
        <div className="layout-header__second-container annex">
          <div className="annex__opportunities">
            <div className="annex__opportunities-loans loans">
              <img src={loans} alt="loans" />
              <div className="loans__list">
                <button
                  className="loans__list-gen"
                  onClick={() => setLoansSelect(!loansSelect)}
                >
                  <span className="loans__list-gen-name">
                    {t<string>("COMMON.LOANS")}
                  </span>
                  <img src={arrow} alt="arrow" />
                </button>
                {loansSelect && (
                  <div
                    className="loans__list-box"
                    onMouseLeave={() => setLoansSelect(false)}
                  >
                    <div className="loans__list-box-select">
                      {loansList.slice(0, 6).map((loan, index) => (
                        <Link
                          to={`/${UIRoutes.CALCULATOR}?type=${CalculatorTypes[
                            loan.query
                          ].toLowerCase()}`}
                          key={index}
                          className="loans__list-box-select-link"
                          onClick={() => {
                            setSelectedLoan(loan.query);
                            setLoansSelect(false);
                          }}
                        >
                          {loan.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="annex__opportunities-card">
              <img src={creditCard} alt="credit card" />
              <Link
                to={`/${
                  UIRoutes.CALCULATOR
                }?type=${CalculatorTypes[7].toLowerCase()}`}
                className="loans__list-box-select-link"
                onClick={() => {
                  setSelectedLoan(7);
                  setLoansSelect(false);
                }}
              >
                {t<string>("COMMON.CREDIT_CARD")}
              </Link>
            </div>
            <div className="annex__opportunities-insured">
              <img src={insured} alt="insured" />
              <p>
                {t<string>("COMMON.INSURED")}
                <span className="soon">{t<string>("COMMON.SOON")}</span>
              </p>
            </div>
          </div>
          <button className="annex__help" onClick={() => chatOpener()}>
            {t<string>("COMMON.HELP_ASISTENT")}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AppHeader;
