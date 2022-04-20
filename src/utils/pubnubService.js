import PubNub from 'pubnub';
import { constant } from './Globals';

const pubnub = new PubNub({
    publishKey: 'pub-c-9c81ecb3-c6f3-4e6b-9925-4027d7b9bbdc',
    subscribeKey: 'sub-c-25fd98f8-5929-11ea-b226-5aef0d0da10f',
});


export default class pubnubService {
    static async createPubnubSpace(spaceId, spaceName, callback) {
        pubnub.createSpace(
            {
                id: spaceId,
                name: spaceName
            },
            function (status, response) {
                if (status.error) {
                    if (status.errorData.status === 409) {
                        /* chat instance already created in pubnub */
                        callback && callback({ id: spaceId })
                        return
                    }
                    console.log('CREATE SPACE ERROR========>', status.errorData.error)
                    return
                }
                if (response) {
                    callback && callback(response.data)
                }
            }
        );
    }

    static async getPubnubSpace(spaceId, callback) {
        pubnub.getSpace(
            {
                spaceId: spaceId
            },
            function (status, response) {
                if (status.error) {
                    console.log('GET SPACE ERROR========>', spaceId, status.errorData.error)
                    return
                }
                if (response) {
                    callback && callback(response.data)
                }
            })
    }

    static async getMessages(spaceId, callback) {
        pubnub.fetchMessages(
            {
                channels: [spaceId],
                // end: '15343325004275466',
                count: 30
            },
            (status, response) => {
                if (status.error) {
                    callback && callback([])
                    return
                }
                console.log('MESSAGES===========> ', response.channels)
                callback && callback(response.channels[spaceId])
            })
    }

    static async addMemberToSpace(usersArr, spaceId, callback) {
        let response = { status: true }
        usersArr.forEach((user, index) => {
            this.createPubnubUser(spaceId, user, (res) => {
                if (!res.status) {
                    response['status'] = false
                } else {
                    pubnub.addMembers(
                        {
                            spaceId: spaceId,
                            users: [usersArr[index]]
                        },
                        function (status, memberRes) {
                            if (status.error) {
                                return
                            }
                            if (memberRes) {
                                response['status'] = true
                            }
                        }
                    );
                }


            })
        })
        callback && callback(response)
    }

    static async createPubnubUser(spaceId, user, callback) {
        let userRes = {
            status: true,
            errMsg: ''
        }
        pubnub.getMembers(
            {
                spaceId: spaceId
            },
            function (status, response) {
                if (response) {
                    let users = response.data
                    if (users.length == 0 || !users.some((u) => u.id == user.id)) {
                        pubnub.createUser(
                            {
                                id: user.id,
                                name: user.id
                            },
                            function (status, response) {
                                if (status.error) {
                                    userRes['status'] = false
                                    userRes['errMsg'] = status.errorData.error
                                }
                                callback && callback(userRes)
                            })
                    } else {
                        userRes['status'] = true
                        userRes['errMsg'] = 'User already created'
                        callback && callback(userRes)
                    }
                } else {
                    userRes['status'] = false
                    userRes['errMsg'] = status.errorData.error.message
                    callback && callback(userRes)
                }

            })
    }

    static async publishMessage(spaceId, msgObj) {
        try {
            await pubnub.publish({
                channel: spaceId,
                message: msgObj,
            });
        } catch (error) {
            console.log("publishMessage =====> ", error)
        }

    }

    static async subscribePubnub(spaceId) {
        pubnub.subscribe({ spaceId })
    }

    static async addPubnubListener(callback) {
        pubnub.addListener({
            message: messageEvent => {
                callback && callback(messageEvent)
            }
        })
    }
}