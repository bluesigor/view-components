import { FC, useEffect } from "react";
import classNames from "classnames";
import "react-loading-skeleton/dist/skeleton.css";
import { Outlet } from "react-router-dom";

import AppFooter from "../common/Footer";
import AppHeader from "./components/Header";
import MobileMenu from "../../MobileMenu";
import ModalWindow from "../../ModalWindow";

import useHttpGet from "../../../core/hooks/useHttpGet";
import { APIRoutes } from "../../../core/http";
import { useAppDispatch, useAppSelector } from "../../../core/store";
import { setCurrentUser } from "../../../core/store/reducers/auth/authSlice";

export const PrivateLayout: FC = () => {
  const { fetchedData } = useHttpGet<any>(APIRoutes.USER);
  const { menu } = useAppSelector((state) => state.modal);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCurrentUser(fetchedData?.payload));

    if (fetchedData) {
      localStorage.setItem("savedUser", JSON.stringify(fetchedData.payload));
    }
  }, [fetchedData]);

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
            <AppHeader />
            <Outlet />
            <AppFooter />
          </div>
        )}
      </div>
    </>
  );
};

export default PrivateLayout;
