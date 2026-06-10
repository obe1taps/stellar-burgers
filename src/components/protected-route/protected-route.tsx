import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';

type TProps = {
  children: JSX.Element;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ children, onlyUnAuth = false }: TProps) => {
  const location = useLocation();

  const isAuth = useSelector((state) => state.auth.isAuth);
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuth) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
