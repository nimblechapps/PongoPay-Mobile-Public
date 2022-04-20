import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';

export async function showDocumentPicker(showAllFileType, callback) {
    if (showAllFileType) {
        filetype = [DocumentPicker.types.allFiles]
    } else {
        filetype = [DocumentPicker.types.pdf]
    }
    try {
        const res = await DocumentPicker.pick({
            type: filetype,
        });
        callback && callback(null, res)
        console.log(
            res.uri,
            res.type, // mime type
            res.name,
            res.size
        );
    } catch (err) {
        if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
        } else {
            throw err;
        }
    }
}

export function showImageGallery(options, callback) {
    ImagePicker.launchImageLibrary(options, (response) => {
        //console.log('@@@', response)
        if (!response.didCancel && !response.error && !response.customButton) {
            callback(response)
        }
    });
}

export function launchCamera(options, callback) {
    ImagePicker.launchCamera(options, (response) => {
        //console.log('Response = ', JSON.stringify(response));
        if (!response.didCancel && !response.error && !response.customButton) {
            callback(response)
        }
    });
}

export function showImagePickerView(options, callback) {
    ImagePicker.showImagePicker(options, (response) => {
        if (!response.didCancel && !response.error) {
            callback(response)
        }
    });
}