
import PushNotification from 'react-native-push-notification';
import PubNub from 'pubnub'
import PubNubReact from 'pubnub-react'
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';


// const pubnub = new PubNub({
//     publishKey: 'pub-c-9c81ecb3-c6f3-4e6b-9925-4027d7b9bbdc',
//     subscribeKey: 'sub-c-25fd98f8-5929-11ea-b226-5aef0d0da10f',
//     uuid: 'PJ-android'
// });
export default class NotificationService {

    constructor(onNotification) {


        // pubnub.init(this);
        this.configure(onNotification);
        this.lastId = 0;
    }

    configure(onNotification) {

        console.log("Notification service called")
        const pubnub = new PubNubReact({
            publishKey: 'pub-c-9c81ecb3-c6f3-4e6b-9925-4027d7b9bbdc',
            subscribeKey: 'sub-c-25fd98f8-5929-11ea-b226-5aef0d0da10f',
            // uuid: 'PJ-android'
            uuid: Platform.OS === 'ios' ? 'PJ-ios' : 'PJ-android',
        });
        pubnub.init(this);

        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function (device) {
                console.log("DEVICE TOKEN", device.token)
                console.log('DEVICE TYPE', device.os)
                global.deviceToken = device.token;
                global.os = device.os;

                if (Platform.OS === 'ios') {

                    //     pubnub.push.addChannels(
                    //         {
                    //             channels: [device.token],
                    //             device: device.token,
                    //             pushGateway: 'apns2', // apns, apns2, gcm, mpns
                    //             topic: 'com.pongopay.pongopay'
                    //         },
                    //         function (status) {
                    //             if (status.error) {
                    //                 console.log("operation failed w/ error:", status);
                    //             } else {
                    //                 console.log("operation done!", status)
                    //             }
                    //         }
                    //     );
                }
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification: function (notification) {
                console.log("Notification ", notification)

                if(Platform.OS === 'ios' && notification.foreground && notification.alert && notification.alert.title ){
                    PushNotification.localNotification({
                        /* iOS and Android properties */
                        id: Math.random(), // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
                        title: notification.alert.title, // (optional)
                        message: notification.alert.body, // (required)
                        userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
                        playSound: false, // (optional) default: true
                        soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
                        });

                }

                // notification.finish(PushNotificationIOS.FetchResult.NoData);
                onNotification && onNotification(notification)
            },

            // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
            senderID: "641910708357",

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
              * (optional) default: true
              * - Specified if permissions (ios) and token (android and ios) will requested or not,
              * - if not, you must call PushNotificationsHandler.requestPermissions() later
              */
            requestPermissions: true,
        })
    }

    checkPermission(cbeck) {
        return PushNotification.checkPermissions(cbeck);
    }

    cancelNotif() {
        PushNotification.cancelLocalNotifications({ id: "" + this.lastId });
    }

    cancelAll() {
        PushNotification.cancelAllLocalNotifications();
    }
}