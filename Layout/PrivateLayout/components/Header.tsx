import { FC, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { AppContext, ProfileListCategory } from "../../../../App";

import useRole from "../../../../core/hooks/useRole";
import useAuth from "../../../../core/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "../../../../core/store";
import { PrivateUIRoutes, UIRoutes } from "../../../../core/router";
import { tables } from "../../../../core/constants/tables";
import {
  setModal,
  setModalType,
  setShowNotification,
} from "../../../../core/store/reducers/modal/modalSlice";
import { AuthSelectionType } from "../../../../core/services/enums";
import {
  setAppLanguage,
  setNotifications,
} from "../../../../core/store/reducers/app/appDataSlice";
import useHttpGet from "../../../../core/hooks/useHttpGet";
import { APIRoutes } from "../../../../core/http";

import divider from "../../../../assets/photos/all/lang-divider.svg";
import alert from "../../../../assets/photos/all/alert.svg";
import accountLogo from "../../../../assets/photos/all/account.svg";
import verified from "../../../../assets/photos/all/verified.svg";
import nonVerified from "../../../../assets/photos/all/not-verified.svg";
import arrow from "../../../../assets/photos/all/select-arrow-small.svg";
import NotificationPopup from "../../../NotificationPopup";
import { chatOpener } from "../../../../core/functions/funtions";

const AppHeader: FC = () => {
  const [loansSelect, setLoansSelect] = useState(false);
  const [panel, setPanel] = useState<string>("");
  const [profileWindow, setProfileWindow] = useState(false);
  const [filter] = useState({ "[filter][showed][like]": 0 });

  const { appLanguage, notifications } = useAppSelector((state) => state.app);
  const { currentUser } = useAppSelector((state) => state.auth);
  const { showNotification, modalType } = useAppSelector(
    (state) => state.modal
  );
  const { isAuth } = useAuth();

  const dispatch = useAppDispatch();
  const { modal } = useAppSelector((state) => state.modal);

  const appContext = useContext(AppContext);

  const { setProfileCategory, reloadChecker } = appContext;

  const user = JSON.parse(localStorage.getItem("savedUser") || "{}");

  const { t, i18n } = useTranslation();

  const { isAdmin, isSuperAdmin } = useRole();

  useEffect(() => {
    for (let property in tables) {
      if (
        window.location.pathname
          .split("/")
          .includes(tables[property].toLowerCase())
      ) {
        setPanel(tables[property]);
      } else if (
        window.location.pathname
          .split("/")
          .includes("users-without-questionnaire")
      ) {
        setPanel(tables[tables.indexOf("Users w/questionnaire")]);
      } else if (
        window.location.pathname.split("/").includes("credit-offers")
      ) {
        setPanel(tables[tables.indexOf("Credit Offers")]);
      } else if (
        window.location.pathname.split("/").includes("submitted-applications")
      ) {
        setPanel(tables[tables.indexOf("Submitted Applications")]);
      }

      if (
        window.location.pathname.split("/").includes("create_post") ||
        window.location.pathname.split("/").includes("update_post")
      ) {
        const name: any = localStorage.getItem("postName");

        setPanel(name);
      }
    }
  }, []);

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

  const routeSelector = (table: string) => {
    if (table === "Credit Offers") {
      return "credit-offers";
    } else if (table === "Users w/questionnaire") {
      return "users-without-questionnaire";
    } else if (table === "Submitted Applications") {
      return "submitted-applications";
    } else if (table === "Leads from rating") {
      return "leads-from-rating";
    }

    return table.toLowerCase();
  };

  return (
    <div className="layout-header">
      <div className="layout-header__first layout-header__first-profile layout-header-private-nav">
        <div className="layout-header__first-container nav-profile">
          <div className="nav__list-item nav-profile__list-item main-logo ">
            <Link to={`/`}>
              <img
                className="nav__logo"
                src={require(`../../../../${process.env.REACT_APP_LOGO_NAME}`)}
                alt="assistent logo"
              />
            </Link>
          </div>
          <ul className="nav__list nav-profile__list">
            <li className="nav__list-item nav-profile__list-item">
              <Link to={`/${UIRoutes.FINANCE}`}>
                {t<string>("COMMON.FINANCE")}
              </Link>
            </li>
            <li className="nav__list-item nav-profile__list-item">
              <Link to={`/${UIRoutes.BANKS_RATING}`}>
                {t<string>("COMMON.RATING")}
              </Link>
            </li>
            <li className="nav__list-item nav-profile__list-item">
              <Link to={`/${UIRoutes.ABOUT_US}`}>
                {t<string>("COMMON.ABOUT_US")}
              </Link>
            </li>
            <li className="nav__list-item nav-profile__list-item">
              <Link to={`/${UIRoutes.NEWS}`}>{t<string>("COMMON.NEWS")}</Link>
            </li>
            <li className="nav__list-item nav-profile__list-item">
              <Link to={`/${UIRoutes.FAQ}`}>{t<string>("COMMON.FAQ")}</Link>
            </li>
            {(isAdmin || isSuperAdmin) && (
              <div className="loans__list">
                <button
                  className="loans__list-gen panel-style"
                  onClick={() => setLoansSelect(!loansSelect)}
                >
                  <span className="panel-style">
                    {panel ? panel : "Admin panel"}
                  </span>
                  <img src={arrow} alt="arrow" />
                </button>
                {loansSelect && (
                  <div
                    className="loans__list-box tables-list__box"
                    onMouseLeave={() => setLoansSelect(false)}
                  >
                    <div className="loans__list-box-select">
                      {tables.map((table, index) => (
                        <Link
                          to={`/${UIRoutes.ADMIN}/${
                            PrivateUIRoutes.ADMIN_PANEL
                          }/${routeSelector(table)}`}
                          key={table}
                          className="loans__list-box-select-link"
                          onClick={() => {
                            setLoansSelect(false);
                            setPanel(table);
                          }}
                        >
                          {table}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ul>

          <div className="nav__mobile-options">
            <button className="nav__mobile-options-btn">
              <span onClick={() => chatOpener()}>
                {t<string>("COMMON.HELP_ASISTENT")}
              </span>
            </button>
            <button
              onClick={() => {
                if (!showNotification) {
                  dispatch(setShowNotification(true));
                  dispatch(setModalType("notifications"));
                } else {
                  dispatch(setShowNotification(false));
                  dispatch(setModalType(""));
                }
              }}
              className="nav__options-alert"
            >
              <img className="nav__options-alert-img" src={alert} alt="alert" />
              {notifications.filter((notification) => notification.showed === 0)
                .length > 0 && (
                <div className="nav__options-alert-count">
                  {
                    notifications.filter(
                      (notification) => notification.showed === 0
                    ).length
                  }
                </div>
              )}
            </button>
            {showNotification && modalType === "notifications" && (
              <NotificationPopup />
            )}
          </div>

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
                onClick={() => {
                  dispatch(setShowNotification(true));
                  dispatch(setModalType("notifications"));
                }}
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
                  alt="alert"
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
            {isAuth && (
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
            )}
            {profileWindow && (
              <div
                className="profile-link"
                onMouseEnter={() => setProfileWindow(true)}
                onMouseLeave={() => setProfileWindow(false)}
              >
                <div className="profile-link__user">
                  <h2 className="profile-link__user-name">
                    {currentUser?.first_name && currentUser?.last_name
                      ? `${currentUser?.first_name} ${currentUser.last_name}`
                      : "User"}
                  </h2>
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
                <div className="profile-link__follow">
                  <div className="profile-link__follow-box">
                    <Link
                      onClick={() => {
                        setProfileCategory(ProfileListCategory.Questionnaires);
                        setPanel("Admin panel");
                      }}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AppHeader;
