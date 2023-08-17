import classNames from "classnames";
import { FC, useContext } from "react";
import { Outlet } from "react-router-dom";
import { AppContext } from "../../../App";
import MobileMenu from "../../MobileMenu";
import ModalWindow from "../../ModalWindow";
import AppFooter from "../common/Footer";
import AppHeader from "../common/Header";
import { useAppSelector } from "../../../core/store";

export const AppLayout: FC = () => {
  const { menu } = useAppSelector((state) => state.modal);

  return (
    <div className="app-layout">
      <ModalWindow />
      <div
        className={classNames({
          "navigation-menu": true,
          "navigation-menu-active": menu,
        })}>
        <MobileMenu />
      </div>
      {!menu && (
        <div className="app-layout__page">
          <AppHeader />
          <div className="pt-1">
            <div className="base-container mb-1">
              <Outlet />
            </div>
            <AppFooter />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
