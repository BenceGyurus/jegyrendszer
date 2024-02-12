import {useEffect, useState} from 'react';
import LoginPage from '../loginPage/loginPage.component';
import EventsNavigation from './eventsNavigation.component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../loader/loader.component';
import ControlAccess from '../../access/controlAccess';
import Error from '../error/error.component';

const Navigation = () => {
  const [token, setToken] = useState(false);
  const [tokenSearching, setTokenSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTokenSearching(true);
    ControlAccess()
      .then(isToken => {
        console.log(isToken);
        setToken(!!isToken);
        setTokenSearching(false);
      })
      .catch(error => {
        setError(
          error.message ? error.message : 'Hiba történt a bejelentkezés során.',
        );
        setTokenSearching(false);
      });
  }, [token]);

  return (
    <>
      <Error show={!!error} message={error} />
      {tokenSearching ? (
        <Loader />
      ) : !token ? (
        <LoginPage setToken={setToken} />
      ) : (
        <EventsNavigation />
      )}
    </>
  );
};

export default Navigation;
