/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, TouchableOpacity, Image } from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color'
import HeaderLeft from '../../components/Header/HeaderLeft';
import HeaderTitle from '../../components/Header/HeaderTitle';
import styles from "./styles"
import { Routes } from "../../utils/Routes";
import SearchBar from '../../components/searchbar';
import { fontXSmall16 } from '../../utils/theme';
import Globals from '../../utils/Globals';
import CustomIcon from "../../components/CustomIcon";
import LocalImages from '../../utils/LocalImages';
import { NavigationEvents } from 'react-navigation';
import API from '../../API';
import ProgressHud from "../../components/ProgressHud";


const DATA = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default class ClientsList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            userList: [],
            searchText: ""
        }
    }
    static navigationOptions = ({ navigation }) => {
        const title = Globals.isBuilder ? "My Clients" : "My Tradesperson"

        return {
            headerLeft: (
                <HeaderLeft
                    iconName="burger_menu"
                    onPress={() => {
                        navigation.toggleDrawer()
                    }}
                />
            ),
            headerTitle: () => <HeaderTitle title={title} />,
        }
    };
    onCreate = () => {
        this.getUserList();
    }
    getUserList = async (callback, loading = true) => {
        const { screenProps } = this.props;
        if (!screenProps.isConnected) {
            return
        }

        if (loading) this.setState({ isLoading: true });

        const { searchText,
            //  pageNo,
            status,
            isLoadingMore } = this.state;
        let pageNo = 0
        try {
            let request = {
                searchText,
                pageNo,
            };

            let response
            response = Globals.isClient ?
                await API.getBuilders(request)
                : await API.getClients(request)
            this.setState({ isLoading: false });
            console.log("response", response)
            if (response.status) {

                console.log("response", response.data)


                this.setState({
                    userList: response.data.users
                }, () => {
                    console.log("====>", this.state.userList)
                })
            }
        } catch (error) {
            console.log("getAllJobs error", error.message);
            this.setState({
                isLoading: false
            });
        }
    }
    onSearchTextChange = (text) => {
        console.log("::::", text)
        this.setState({
            searchText: text
        }, () => {
            this.getUserList(() => {
            }, false);
        })
    }

    renderListing(title) {
        console.log("TITLE", title)
        const { navigate } = this.props.navigation;

        return (
            <View style={{ borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey, }}>
                <TouchableOpacity
                    onPress={() => {
                        navigate(Routes.Clients_Details, { userDetails: title })
                    }}
                    style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 24, paddingTop: 24, flexDirection: "row", justifyContent: 'space-between', alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ width: 42, height: 42, marginRight: 18, }}>
                            <Image source={title.profilePic == null ? LocalImages.Client_User : { uri: title.profilePic }} style={{ borderRadius: 50 }} />
                        </View>
                        <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>{title.userName}</Label>
                    </View>
                    <CustomIcon name={"right_arrow"} style={{ fontSize: fontXSmall16, color: Color.BLACK }} />
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ padding: 16, flexDirection: "row", borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey, }}>
                    <SearchBar placeholder={Globals.isBuilder ? "Search clients by name" : "Search builder by name"}
                        boxStyleCustom={{ height: 40 }}
                        value={this.state.searchText}
                        onChangeText={this.onSearchTextChange} />
                </View>
                {this.state.userList.length == 0 ?
                    <View style={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
                        <Label Montserrat_Medium style={{ alignItems: "center", marginTop: -250, fontSize: 16, color: Color.BLACK }}>
                            {Globals.isBuilder ? "No Clients associated with you." : "No builders associated with you."}</Label>
                    </View>
                    :
                    <SafeAreaView style={styles.safeVStyle}>

                        <FlatList
                            data={this.state.userList}
                            renderItem={({ item }) => this.renderListing(item)}
                        />
                    </SafeAreaView>}


                {this.state.isLoading && <ProgressHud />}
                <NavigationEvents onWillFocus={this.onCreate} />

            </View>
        );
    }
}

