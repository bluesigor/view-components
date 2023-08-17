import { FC } from "react";
import { Outlet } from "react-router-dom";
import classNames from "classnames";
import "react-loading-skeleton/dist/skeleton.css";

import MobileMenu from "../../MobileMenu";
import ModalWindow from "../../ModalWindow";
import PartnerHeader from "./components/Header";
import { useAppSelector } from "../../../core/store";

export const PartnerLayout: FC = () => {
  const { menu } = useAppSelector((state) => state.modal);

  return (
    <>
      <div className="private-layout">
        <ModalWindow />
        <div
          className={classNames({
            "navigation-menu": true,
            "navigation-menu-active": menu,
          })}
        >
          <MobileMenu />
        </div>
        {!menu && (
          <div>
            <PartnerHeader />
            <Outlet />
          </div>
        )}
      </div>
    </>
  );
};

export default PartnerLayout;
