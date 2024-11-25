"use client"
import React, { useEffect, useState } from 'react';
import 'firebase/messaging';
import { toast } from 'react-hot-toast';
import FirebaseData from '../../utils/Firebase';
import { useSelector } from 'react-redux';
import { Fcmtoken } from '@/redux/reuducer/settingSlice';
import { t } from '@/utils';

const PushNotificationLayout = ({ children, onNotificationReceived }) => {
  const [notification, setNotification] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isTokenFound, setTokenFound] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const { fetchToken, onMessageListener } = FirebaseData();

  const FcmToken = useSelector(Fcmtoken);


  const handleFetchToken = async () => {
    await fetchToken(setTokenFound, setFcmToken);
  };

  useEffect(() => {
    handleFetchToken();
  }, []);

  useEffect(() => {
    if (typeof window !== undefined) {
      setUserToken(FcmToken);
    }
  }, [FcmToken]);

  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        if (payload && payload.data) {
          setNotification(payload.data);
          onNotificationReceived(payload.data);
        }
      })
      .catch((err) => {
        console.error('Error handling foreground notification:', err);
        // toast.error(t('errorHandlingNotif'));
      });

  }, [onNotificationReceived]);

  useEffect(() => {
    if (fcmToken) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/firebase-messaging-sw.js')
          .then((registration) => {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          })
          .catch((err) => {
            console.log('Service Worker registration failed: ', err);
          });
      }
    }
  }, [fcmToken]);

  return (
    <div>{React.isValidElement(children) ? React.cloneElement(children, { notification }) : children}</div>
  );
}

export default PushNotificationLayout;