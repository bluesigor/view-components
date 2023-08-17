import { useEffect, useContext, useState } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import { AppContext } from "../../../../App";

import { useAppDispatch, useAppSelector } from "../../../../core/store";
import useAuth from "../../../../core/hooks/useAuth";
import { navList } from "../../../../core/constants/navList";

import logo from "../../../../assets/photos/partner/assistent_logo.svg";
import divider from "../../../../assets/photos/all/lang-divider.svg";
import alert from "../../../../assets/photos/all/alert.svg";
import dialog from "../../../../assets/photos/partner/dialog.svg";
import avatar from "../../../../assets/photos/partner/avatar.svg";
import active_tab from "../../../../assets/photos/partner/active_tab.svg";
import {
  setModal,
  setModalType,
} from "../../../../core/store/reducers/modal/modalSlice";
import { AuthSelectionType } from "../../../../core/services/enums";
import { setAppLanguage } from "../../../../core/store/reducers/app/appDataSlice";

const PartnerHeader = () => {
  const [steper, setSteper] = useState<number>(0);
  const [profileWindow, setProfileWindow] = useState(false);

  const appContext = useContext(AppContext);

  const { setSelectionType } = appContext;

  const user = JSON.parse(localStorage.getItem("savedUser") || "{}");

  const appLanguage = useAppSelector((state) => state.app.appLanguage);

  const dispatch = useAppDispatch();

  const { isAuth } = useAuth();

  const { i18n } = useTranslation();

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
    <div className="partner-layout">
      <div className="partner-layout-main">
        <img src={logo} alt="assistent" />
        <ul className="partner-layout-nav-list">
          {navList.map((nav: string, index) => (
            <li
              key={index}
              className={classNames({
                "partner-layout-nav-list-container": true,
                "partner-layout-nav-list-container-active": index === steper,
              })}>
              <button
                onClick={() => {
                  setSteper(index);
                }}
                className={classNames({
                  "partner-layout-nav-list__item": true,
                  "partner-layout-nav-list__item-active": index === steper,
                })}>
                {nav}
              </button>
              {index === steper && (
                <img
                  className={classNames({
                    "partner-layout-nav-list__item-img": index === steper,
                  })}
                  src={active_tab}
                  alt="active_tab"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="partner-layout-sider">
        <div className="nav__options">
          <div className="nav__options-lang lang">
            <button
              className={classNames({
                lang__btn: true,
                "lang__btn-selected": appLanguage === "bg",
              })}
              onClick={() => setLanguage("bg")}>
              BG
            </button>
            <img className="lang__line" src={divider} alt="divider"></img>
            <button
              className={classNames({
                lang__btn: true,
                "lang__btn-selected": appLanguage === "en",
              })}
              onClick={() => setLanguage("en")}>
              EN
            </button>
          </div>
          {isAuth && (
            <img className="nav__options-alert" src={alert} alt="alert" />
          )}
          <img className="nav__options-alert" src={dialog} alt="dialog" />
          {isAuth ? (
            <div
              className="partner-layout-sider-profile"
              onMouseEnter={() => setProfileWindow(true)}
              onMouseLeave={() => setProfileWindow(false)}>
              <p className="profile-options__link-item">Account</p>
              <img
                src={avatar}
                className="partner-layout-sider-profile__avatar"
                alt="account logo"
              />
            </div>
          ) : (
            <div className="profile-options__buttons">
              <button
                className="profile-options__buttons-click"
                onClick={() => {
                  dispatch(setModalType(AuthSelectionType.Auth));
                  setSelectionType(AuthSelectionType.Register);
                  dispatch(setModal(true));
                  document.body.style.overflow = "hidden";
                }}>
                Log in
              </button>
            </div>
          )}
          {profileWindow && (
            <div
              className="profile-link"
              onMouseEnter={() => setProfileWindow(true)}
              onMouseLeave={() => setProfileWindow(false)}>
              <div className="profile-link__user">
                <h2 className="profile-link__user-name">
                  {user?.first_name && user?.last_name
                    ? `${user?.first_name} ${user.last_name}`
                    : "User"}
                </h2>
              </div>
              {user.role === "partner" ? (
                <div className="profile-link__follow">
                  <div className="profile-link__follow-box">
                    <span className="profile-link__follow-box-url">
                      Edit company information
                    </span>
                  </div>
                  <div className="profile-link__follow-box">
                    <span className="profile-link__follow-box-url">
                      Company reviews
                    </span>
                  </div>
                  <div className="profile-link__follow-box">
                    <button
                      className="profile-link__follow-box-logout"
                      onClick={() => {
                        dispatch(setModalType(AuthSelectionType.Logout));
                        dispatch(setModal(true));
                        document.body.style.overflow = "hidden";
                      }}>
                      Log out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-link__follow">
                  <div className="profile-link__follow-box">
                    <button
                      className="profile-link__follow-box-logout"
                      onClick={() => {
                        dispatch(setModalType(AuthSelectionType.Logout));
                        dispatch(setModal(true));
                        document.body.style.overflow = "hidden";
                      }}>
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerHeader;
