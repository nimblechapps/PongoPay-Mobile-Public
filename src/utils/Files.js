import { PermissionsAndroid, Platform } from 'react-native';

import RNFetchBlob from 'rn-fetch-blob'

// import Global from "./Global";


export async function requestStoragePermission(callback) {
    if (Platform.OS == 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                'title': 'Cool App Location Permission',
                'message': 'Cool App needs access to your location.'
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            callback(true)
        } else {
            console.log("storage permission denied")
            callback(false)
        }
    }
    else {
        callback(true)
    }

}

export function downloadFile(fileUrl, fileName, callback) {
    console.log('fileurl ******* ', fileUrl)
    if (fileUrl) {
        let urlArray = fileUrl.split('.')
        let filetype = urlArray[urlArray.length - 1]
        // if (!fileName.includes('.')) {
        //     fileName = fileName + '.' + filetype
        // }

        if (Platform.OS === 'ios') {
            try {
                RNFetchBlob
                    .config({ path: RNFetchBlob.fs.dirs.DocumentDir + '/' + fileName })
                    .fetch('GET', fileUrl, {
                        'Cache-Control': 'no-store'
                    })
                    .then((res) => {
                        console.log("response is **** ", res)
                        let Success = true
                        callback(Success)
                    })
            } catch (error) {
            }


        } else {
            if (filetype == 'pdf') {
                type = 'application/pdf';
            } else {
                type = 'image/png';
            }
            try {
                RNFetchBlob.config({
                    // addAndroidDownloads: {
                    //     useDownloadManager: true,
                    //     title: fileName,
                    //     description: '',
                    //     mime: type,
                    //     mediaScannable: true,
                    //     notification: true,
                    // }
                    addAndroidDownloads: {
                        useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
                        notification: true,
                        path: RNFetchBlob.fs.dirs.DocumentDir + '/' + fileName, // this is the path where your downloaded file will live in
                        description: 'Downloading PDF..',
                        title: fileName,
                    }

                })
                    .fetch('GET', fileUrl)
                    .then((res) => {
                        android.actionViewIntent(res.path(), 'application/vnd.android.package-archive')
                    })
            } catch (error) {
            }

        }
    }

}

// export function uploadFile(resource, callback) {
//     let data = new FormData()
//     data.append('imagepath', resource)
//     console.log('** resource ** ', resource)
//     fetch(Global.baseUrl + Global.subUrl.uploadDocument, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'multipart/form-data',
//         },
//         body: data
//     })
//         .then(res => res.json())
//         .then(res => {
//             console.log('#############', res)
//             res['fileName'] = resource.name
//             callback(null, res)
//         })
//         .catch(error => {
//             callback(error, null)
//             console.log('catchcatchcatchcatch', error)
//         });
// }

