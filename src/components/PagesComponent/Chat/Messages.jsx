"use client"
import PushNotificationLayout from '@/components/firebaseNotification/PushNotificationLayout';
import React, { useEffect, useState } from 'react';
import Chat from './Chat';

const Messages = () => {
    const [notificationData, setNotificationData] = useState(null);

    const handleNotificationReceived = (data) => {
        setNotificationData(data);
    };

    useEffect(() => {}, [notificationData]);

    return (
        <PushNotificationLayout onNotificationReceived={handleNotificationReceived}>
            <Chat notificationData={notificationData} />
        </PushNotificationLayout>
    );
}

export default Messages;
