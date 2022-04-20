import pubnubService from "./pubnubService";
import API from '../API';

export async function createChatEnvironment(job, usersArr, fn) {
    try {
        let response = await API.getAdminAndEmployee()
        if (response.status) {
            if (response.data.hasOwnProperty('admin')) {
                usersArr.push({ id: response.data.admin._id })
            }
            if (response.data.hasOwnProperty('serviceEmployee')) {
                usersArr.push({ id: response.data.serviceEmployee._id })
            }
        }
    } catch (error) {
        console.log('getAdminAndEmployee error', error)
    }

    console.log(`creting channel ${job._id} with users ${usersArr}`)
    pubnubService.createPubnubSpace(job._id, job.sJobTitle, (space) => {
        // set response into db
        pubnubService.addMemberToSpace(usersArr, space.id, async (res) => {
            //set users into db
            if (res.status) {
                try {
                    let request = {
                        jobId: job._id,
                        spaceid: space.id,
                        members: usersArr
                    };

                    let response = await API.addChat(request)
                    if (response.status) {
                        console.log("add chat success", response);
                        fn && fn({ status: true, spaceId: space.id })
                        // return
                    } else {
                        console.log("add chat failed", response);
                        fn && fn({ status: false })
                    }
                } catch (error) {
                    console.log("add chat error", error.message);
                    fn && fn({ status: false })
                }
            }

        })
    })
}

export async function uploadImageToServer(imagePath) {
    try {
        let request = new FormData();
        let image = {
            uri: imagePath,
            type: "image/jpeg",
            name: "profilePic.jpg",
        }
        request.append("image", image);
        let response = await API.uploadImage(request)
        if (response.status) {
            console.log('chat image url======>', response.data.imageUrl)
            return response.data.imageUrl
        } else {
            return undefined
        }
    } catch (error) {
        console.log("editProfile error", error.message);
        return undefined
    }

}