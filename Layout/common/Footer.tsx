import { FC, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import { AppContext } from "../../../App";

import useAuth from "../../../core/hooks/useAuth";
import { UIRoutes } from "../../../core/router";
import { useAppDispatch, useAppSelector } from "../../../core/store";

import loans from "../../../assets/photos/footer/loans.svg";
import card from "../../../assets/photos/footer/card.svg";
import insurance from "../../../assets/photos/footer/insurance.svg";

import refinancing from "../../../assets/photos/footer/refinancing.svg";
import merging from "../../../assets/photos/footer/merging.svg";
import car from "../../../assets/photos/footer/car.svg";
import mortgage from "../../../assets/photos/footer/mortgage.svg";
import arrowUp from "../../../assets/photos/footer/arrow-up.svg";
import arrowDown from "../../../assets/photos/footer/arrow-down.svg";
import menuIcon from "../../../assets/photos/footer/menu.svg";
import {
  setMenu,
  setModal,
  setModalType,
} from "../../../core/store/reducers/modal/modalSlice";
import { AuthSelectionType } from "../../../core/services/enums";
import {
  setAppLanguage,
  setLoginRoute,
} from "../../../core/store/reducers/app/appDataSlice";

type Props = {};

const AppFooter: FC<Props> = () => {
  const [finance, setFinance] = useState(false);
  const [asistent, setAsistent] = useState(false);
  const [help, setHelp] = useState(false);
  const [socialLinks, setSocialLinks] = useState(false);

  const appLanguage = useAppSelector((state) => state.app.appLanguage);

  const appContext = useContext(AppContext);

  const { setSelectionType, setSelectedLoan } = appContext;

  const dispatch = useAppDispatch();

  const { t, i18n } = useTranslation();

  const { isAuth } = useAuth();

  const close = () => {
    setFinance(false);
    setAsistent(false);
    setHelp(false);
    setSocialLinks(false);
  };

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
    <div className="layout-footer">
      <section className="footer-desktop">
        <div className="footer-desktop__panel">
          <div className="footer-desktop__panel-links footer-links">
            <div className="footer-links__name">
              <h5 className="footer-links__name-title">
                {t<string>("COMMON.FINANCE")}
              </h5>
            </div>
            <ul className="footer-links__list list-note">
              <li className="list-note__item">
                <Link
                  to={`/${UIRoutes.CALCULATOR}?type=consumerloan`}
                  onClick={() => {
                    setSelectedLoan(1);
                  }}
                  className="list-note__item-link"
                >
                  <img src={loans} alt="Loans" />
                  <span>{t<string>("LOANS.CONSUMER_LOANS")}</span>
                </Link>
              </li>
              <li className="list-note__item">
                <Link
                  to={`/${UIRoutes.CALCULATOR}?type=carleasing`}
                  onClick={() => {
                    setSelectedLoan(2);
                  }}
                  className="list-note__item-link"
                >
                  <img src={car} alt="Car leasing" />
                  <span>{t<string>("LOANS.CAR_LEASING")}</span>
                </Link>
              </li>
              <li className="list-note__item">
                <Link
                  to={`/${UIRoutes.CALCULATOR}?type=refinancing`}
                  onClick={() => {
                    setSelectedLoan(3);
                  }}
                  className="list-note__item-link"
                >
                  <img src={refinancing} alt="Refinancing" />
                  <span>{t<string>("LOANS.REFINANCING")}</span>
                </Link>
              </li>
              <li className="list-note__item">
                <Link
                  to={`/${UIRoutes.CALCULATOR}?type=merging`}
                  onClick={() => {
                    setSelectedLoan(4);
                  }}
                  className="list-note__item-link"
                >
                  <img src={merging} alt="Merging loans" />
                  <span>{t<string>("LOANS.MERGING_LOANS")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/${UIRoutes.CALCULATOR}?type=mortgage`}
                  onClick={() => {
                    setSelectedLoan(5);
                  }}
                  className="list-note__item-link"
                >
                  <img src={mortgage} alt="Mortgage" />
                  <span>{t<string>("LOANS.MORTGAGE_LOANS")}</span>
                </Link>
              </li>
              <li className="list-note__item">
                <Link
                  to={`/${UIRoutes.CALCULATOR}?type=quick`}
                  onClick={() => {
                    setSelectedLoan(6);
                  }}
                  className="list-note__item-link"
                >
                  <img src={insurance} alt="Quick" />
                  <span>{t<string>("LOANS.QUICK_LOAN")}</span>
                </Link>
              </li>
              <li className="list-note__item">
                <Link
                  to={`/${UIRoutes.CALCULATOR}?type=creditcards`}
                  onClick={() => {
                    setSelectedLoan(7);
                  }}
                  className="list-note__item-link"
                >
                  <img src={card} alt="Credit card" />
                  <span>{t<string>("LOANS.CREDIT_CARDS")}</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-desktop__panel-links footer-links">
            <div className="footer-links__name">
              <h5 className="footer-links__name-title">
                {t<string>("COMMON.ASISTENT")}
              </h5>
            </div>
            <ul className="footer-links__list list-note">
              <li className="list-note__item">
                <Link
                  to={`/${UIRoutes.BANKS_RATING}`}
                  className="list-note__item-link"
                >
                  {t<string>("COMMON.RATING")}
                </Link>
              </li>
              <li className="list-note__item">
                <Link
                  to={`/${UIRoutes.ABOUT_US}`}
                  className="list-note__item-link"
                >
                  {t<string>("COMMON.ABOUT_US")}
                </Link>
              </li>
              <li className="list-note__item">
                <Link to={`/${UIRoutes.NEWS}`} className="list-note__item-link">
                  {t<string>("COMMON.NEWS")}
                </Link>
              </li>
              <li className="list-note__item">
                <Link to={`/${UIRoutes.BLOG}`} className="list-note__item-link">
                  {t<string>("COMMON.BLOG")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-desktop__panel-links footer-links">
            <div className="footer-links__name">
              <h5 className="footer-links__name-title">
                {t<string>("COMMON.HELP_TITLE")}
              </h5>
            </div>
            <ul className="footer-links__list list-note">
              <li className="list-note__item">
                <Link
                  to={`/${UIRoutes.CONTACT_US}`}
                  className="list-note__item-link"
                >
                  {t<string>("COMMON.CONTACT")}
                </Link>
              </li>
              <li className="list-note__item">
                <Link to={`/${UIRoutes.FAQ}`} className="list-note__item-link">
                  {t<string>("COMMON.FAQ")}
                </Link>
              </li>

              <li className="list-note__item">
                <Link
                  to={`/${UIRoutes.COOKIE_POLICY}`}
                  className="list-note__item-link"
                >
                  {t<string>("COMMON.COOKIE_POLICY")}
                </Link>
              </li>
              <li className="list-note__item">
                <Link
                  to={`/${UIRoutes.PRIVACY_POLICY}`}
                  className="list-note__item-link"
                >
                  {t<string>("COMMON.PRIVACY_POLICY")}
                </Link>
              </li>
              <li className="list-note__item">
                <Link
                  to={`/${UIRoutes.TERMS_CONDITIONS}`}
                  className="list-note__item-link"
                >
                  {t<string>("COMMON.TERMS_CONDITIONS")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-desktop__panel-links footer-links">
            <div className="footer-links__name">
              <h5 className="footer-links__name-title">
                {t<string>("COMMON.SOCIAL_LINKS")}
              </h5>
            </div>
            <ul className="footer-links__list list-note">
              <li className="list-note__item">
                <Link to="" className="list-note__item-link">
                  {t<string>("COMMON.TWITTER")}
                </Link>
              </li>
              <li className="list-note__item">
                <Link to="" className="list-note__item-link">
                  {t<string>("COMMON.FACEBOOK")}
                </Link>
              </li>
              <li className="list-note__item">
                <Link to="" className="list-note__item-link">
                  {t<string>("COMMON.INSTAGRAM")}
                </Link>
              </li>
              <li className="list-note__item">
                <Link to="" className="list-note__item-link">
                  {t<string>("COMMON.TELEGRAM")}
                </Link>
              </li>
              <li className="list-note__item">
                <Link to="" className="list-note__item-link">
                  {t<string>("COMMON.WHATSAPP")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-desktop__panel-links footer-links">
            <div className="footer-links__account">
              <div className="footer-links__account-operational operational">
                <h5 className="operational__title">
                  {t<string>("COMMON.ACCOUNT")}
                </h5>
                {!isAuth ? (
                  <>
                    <button
                      className="operational__login"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        dispatch(setModalType(AuthSelectionType.Auth));
                        setSelectionType(AuthSelectionType.Register);
                        dispatch(setModal(true));
                        dispatch(setLoginRoute(false));
                      }}
                    >
                      <span>{t<string>("COMMON.LOG_IN")}</span>
                    </button>
                    <button
                      className="operational__login"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        dispatch(setModalType(AuthSelectionType.Auth));
                        setSelectionType(AuthSelectionType.Register);
                        dispatch(setModal(true));
                      }}
                    >
                      {t<string>("COMMON.CREATE_ACCOUNT")}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        window.scrollTo(0, 0);
                        document.body.style.overflow = "hidden";
                        dispatch(setModalType(AuthSelectionType.Logout));
                        dispatch(setModal(true));
                      }}
                      className="operational__login-out"
                    >
                      <span>{t<string>("COMMON.LOG_OUT")}</span>
                    </button>
                  </>
                )}
              </div>
              <div className="footer-links__account-languages account-languages">
                <span className="account-languages-txt">
                  {t<string>("COMMON.SWITCH_LANGUAGE")}
                </span>
                <div className="account-languages-lang">
                  <span
                    className={classNames({
                      "language-on": appLanguage === "bg",
                    })}
                    onClick={() => {
                      setLanguage("bg");
                    }}
                  >
                    {t<string>("COMMON.BG")}
                  </span>
                  {t<string>("COMMON.SWITCHER_TO")}
                  <span
                    className={classNames({
                      "language-on": appLanguage === "en",
                    })}
                    onClick={() => {
                      setLanguage("en");
                    }}
                  >
                    {t<string>("COMMON.EN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-desktop__rights">
          <div className="footer-desktop__rights-info">
            <span>{t<string>("COMMON.COPYRIGHT")}</span>
            <span>{t<string>("COMMON.ALL_RIGHTS_RESERVED")}</span>
          </div>
        </div>
      </section>

      <section className="footer-mobile">
        <div className="footer-mobile__panel">
          <div className="footer-desktop__panel-links footer-links">
            <div className="footer-links__name">
              <h5 className="footer-links__name-title">
                {t<string>("COMMON.FINANCE")}
              </h5>
              <button
                className="footer-links__name-btn"
                onClick={() => {
                  close();
                  setFinance(!finance);
                }}
              >
                {finance ? (
                  <img src={arrowUp} alt="arrow down" />
                ) : (
                  <img src={arrowDown} alt="arrow up" />
                )}
              </button>
            </div>
            {finance && (
              <ul className="footer-links__list list-note">
                <li className="list-note__item">
                  <Link
                    to={`/${UIRoutes.CALCULATOR}?type=consumerloan`}
                    onClick={() => {
                      setSelectedLoan(1);
                    }}
                    className="list-note__item-link"
                  >
                    <img src={loans} alt="Loans" />
                    <span>{t<string>("LOANS.CONSUMER_LOANS")}</span>
                  </Link>
                </li>
                <li className="list-note__item">
                  <Link
                    to={`/${UIRoutes.CALCULATOR}?type=creditcards`}
                    onClick={() => {
                      setSelectedLoan(7);
                    }}
                    className="list-note__item-link"
                  >
                    <img src={card} alt="Credit card" />
                    <span>{t<string>("LOANS.CREDIT_CARDS")}</span>
                  </Link>
                </li>
                <li className="list-note__item">
                  <Link
                    to={`/${UIRoutes.CALCULATOR}?type=refinancing`}
                    onClick={() => {
                      setSelectedLoan(3);
                    }}
                    className="list-note__item-link"
                  >
                    <img src={refinancing} alt="Refinancing" />
                    <span>{t<string>("LOANS.REFINANCING")}</span>
                  </Link>
                </li>
                <li className="list-note__item">
                  <Link
                    to={`/${UIRoutes.CALCULATOR}?type=merging`}
                    onClick={() => {
                      setSelectedLoan(4);
                    }}
                    className="list-note__item-link"
                  >
                    <img src={merging} alt="Merging loans" />
                    <span>{t<string>("LOANS.MERGING_LOANS")}</span>
                  </Link>
                </li>
                <li className="list-note__item">
                  <Link
                    to={`/${UIRoutes.CALCULATOR}?type=carleasing`}
                    onClick={() => {
                      setSelectedLoan(2);
                    }}
                    className="list-note__item-link"
                  >
                    <img src={car} alt="Car leasing" />
                    <span>{t<string>("LOANS.CAR_LEASING")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${UIRoutes.CALCULATOR}?type=mortgage`}
                    onClick={() => {
                      setSelectedLoan(5);
                    }}
                    className="list-note__item-link"
                  >
                    <img src={mortgage} alt="Mortgage" />
                    <span>{t<string>("LOANS.MORTGAGE_LOANS")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${UIRoutes.CALCULATOR}?type=quick`}
                    onClick={() => {
                      setSelectedLoan(6);
                    }}
                    className="list-note__item-link"
                  >
                    <img src={insurance} alt="Quick" />
                    <span>{t<string>("LOANS.QUICK_LOAN")}</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <div className="footer-mobile__panel-links footer-links">
            <div className="footer-links__name">
              <h5 className="footer-links__name-title">
                {t<string>("COMMON.ASISTENT")}
              </h5>
              <button
                className="footer-links__name-btn"
                onClick={() => {
                  close();
                  setAsistent(!asistent);
                }}
              >
                {asistent ? (
                  <img src={arrowUp} alt="arrow down" />
                ) : (
                  <img src={arrowDown} alt="arrow up" />
                )}
              </button>
            </div>
            {asistent && (
              <ul className="footer-links__list list-note">
                <li className="list-note__item">
                  <Link
                    to={`${UIRoutes.BANKS_RATING}`}
                    className="list-note__item-link"
                  >
                    {t<string>("COMMON.RATING")}
                  </Link>
                </li>
                <li className="list-note__item">
                  <Link
                    to={`/${UIRoutes.ABOUT_US}`}
                    className="list-note__item-link"
                  >
                    {t<string>("COMMON.ABOUT_US")}
                  </Link>
                </li>
                <li className="list-note__item">
                  <Link
                    to={`/${UIRoutes.NEWS}`}
                    className="list-note__item-link"
                  >
                    {t<string>("COMMON.NEWS")}
                  </Link>
                </li>
                <li className="list-note__item">
                  <Link
                    to={`/${UIRoutes.BLOG}`}
                    className="list-note__item-link"
                  >
                    {t<string>("COMMON.BLOG")}
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <div className="footer-mobile__panel-links footer-links">
            <div className="footer-links__name">
              <h5 className="footer-links__name-title">
                {t<string>("COMMON.SOCIAL_LINKS")}
              </h5>
              <button
                className="footer-links__name-btn"
                onClick={() => {
                  close();
                  setSocialLinks(!socialLinks);
                }}
              >
                {socialLinks ? (
                  <img src={arrowUp} alt="arrow down" />
                ) : (
                  <img src={arrowDown} alt="arrow up" />
                )}
              </button>
            </div>
            {socialLinks && (
              <ul className="footer-links__list list-note">
                <li className="list-note__item">
                  <Link to="" className="list-note__item-link">
                    {t<string>("COMMON.TWITTER")}
                  </Link>
                </li>
                <li className="list-note__item">
                  <Link to="" className="list-note__item-link">
                    {t<string>("COMMON.FACEBOOK")}
                  </Link>
                </li>
                <li className="list-note__item">
                  <Link to="" className="list-note__item-link">
                    {t<string>("COMMON.INSTAGRAM")}
                  </Link>
                </li>
                <li className="list-note__item">
                  <Link to="" className="list-note__item-link">
                    {t<string>("COMMON.TELEGRAM")}
                  </Link>
                </li>
                <li className="list-note__item">
                  <Link to="" className="list-note__item-link">
                    {t<string>("COMMON.WHATSAPP")}
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <div className="footer-mobile__panel-links footer-links">
            <div className="footer-links__name">
              <h5 className="footer-links__name-title">
                {t<string>("COMMON.HELP_TITLE")}
              </h5>
              <button
                className="footer-links__name-btn"
                onClick={() => {
                  close();
                  setHelp(!help);
                }}
              >
                {help ? (
                  <img src={arrowUp} alt="arrow down" />
                ) : (
                  <img src={arrowDown} alt="arrow up" />
                )}
              </button>
            </div>
            {help && (
              <ul className="footer-links__list list-note">
                <li className="list-note__item">
                  <Link
                    to={`/${UIRoutes.CONTACT_US}`}
                    className="list-note__item-link"
                  >
                    {t<string>("COMMON.CONTACT")}
                  </Link>
                </li>
                <li className="list-note__item">
                  <Link
                    to={`/${UIRoutes.FAQ}`}
                    className="list-note__item-link"
                  >
                    {t<string>("COMMON.FAQ")}
                  </Link>
                </li>
                <li className="list-note__item">
                  <Link to="" className="list-note__item-link">
                    {t<string>("COMMON.PRIVACY_POLICY")}
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <div className="footer-mobile__panel-links footer-links">
            <div className="footer-links__account">
              <div className="footer-links__account-operational operational">
                <h5 className="operational__title">
                  {t<string>("COMMON.ACCOUNT")}
                </h5>
                {!isAuth ? (
                  <>
                    <button
                      className="operational__login"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        dispatch(setModalType(AuthSelectionType.Auth));
                        setSelectionType(AuthSelectionType.Register);
                        dispatch(setModal(true));
                        document.body.style.overflow = "hidden";
                        dispatch(setLoginRoute(false));
                      }}
                    >
                      <span>{t<string>("COMMON.LOG_IN")}</span>
                    </button>
                    <button
                      className="operational__login"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        dispatch(setModalType(AuthSelectionType.Auth));
                        setSelectionType(AuthSelectionType.Register);
                        dispatch(setModal(true));
                        document.body.style.overflow = "hidden";
                      }}
                    >
                      {t<string>("COMMON.CREATE_ACCOUNT")}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      window.scrollTo(0, 0);
                      document.body.style.overflow = "hidden";
                      dispatch(setModalType(AuthSelectionType.Logout));
                      dispatch(setModal(true));
                    }}
                    className="operational__login-out"
                  >
                    <span>{t<string>("COMMON.LOG_OUT")}</span>
                  </button>
                )}
              </div>
              <div className="footer-links__account-languages account-languages">
                <span className="account-languages-txt">
                  {t<string>("COMMON.SWITCH_LANGUAGE")}
                </span>
                <div className="account-languages-lang">
                  <span
                    className={classNames({
                      "language-on": appLanguage === "bg",
                    })}
                    onClick={() => {
                      setLanguage("bg");
                    }}
                  >
                    {t<string>("COMMON.BG")}
                  </span>
                  {t<string>("COMMON.SWITCHER_TO")}
                  <span
                    className={classNames({
                      "language-on": appLanguage === "en",
                    })}
                    onClick={() => {
                      setLanguage("en");
                    }}
                  >
                    {t<string>("COMMON.EN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-mobile__rights">
          <div className="footer-mobile__rights-info">
            <span>{t<string>("COMMON.COPYRIGHT")}</span>
            <span>{t<string>("COMMON.ALL_RIGHTS_RESERVED")}</span>
          </div>
        </div>
        <div className="footer-mobile__menu">
          <div
            className="footer-mobile__menu-btn"
            onClick={() => dispatch(setMenu(true))}
          >
            <img src={menuIcon} alt="menu" />
            <span>menu</span>
          </div>
        </div>
      </section>
    </div>
  );
};
export default AppFooter;
