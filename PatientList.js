import {
    FlatList,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    RefreshControl,
    AsyncStorage,
    Alert,
    Button, ActivityIndicator
} from 'react-native';
import React, { Component } from 'react';


import {Patients} from './Patients'
//import SQLite from 'react-native-sqlite-storage';

const firebase = require('firebase');


const firebaseConfig = {
    apiKey: "AIzaSyAZebI2NeAQUC-eh_WOqlq1wqy1YnLkkPQ",
    authDomain: "awesomeproject-a112f.firebaseapp.com",
    databaseURL: "https://awesomeproject-a112f.firebaseio.com",
    projectId: "awesomeproject-a112f",
    storageBucket: "awesomeproject-a112f.appspot.com",
//    messagingSenderId: "679941356945"
    persistence:true
};
export const firebaseApp = firebase.initializeApp(firebaseConfig);


var patients=[
    {patient:
       new Patients(
        'Popescu Alexandru',
        '123456789',
        'Aleea Paranga, nr.2, Cluj-Napoca',
        '12-04-2017T09:30',
           require('./img/book_ex.png'))},
    {patient:
       new Patients(
        'Farcas Maria',
        '123456789',
        'Aleea Paranga, nr.2, Cluj-Napoca',
        '12-04-2017T09:30',
           require('./img/book_ex.png'))},
    {patient:

       new Patients(
        'Abrudan Mihaela',
        '123456789',
        'Aleea Paranga, nr.2, Cluj-Napoca',
        '12-04-2017T09:30',
           require('./img/book_ex.png'))},
];
export class PatientList extends Component {
    static navigationOptions = {
        //name: 'Home',
        header:null,
    };
    constructor(props) {
        super(props);
        this._onRefresh = this._onRefresh.bind(this);
        this.state = {
            refreshing: false,
            newpatients: [],
            loading: true,
            //username: ""
        };
        console.log("dsadasdasdas");
        this.items = this.getRef().child('patients');
        this.currentuser = firebase.auth().currentUser.uid;
        console.log("-------------" + this.currentuser);
        console.log("--2" + this.items);
    }

    getRef() {
        return firebaseApp.database().ref();

    }



     _onRefresh() {
        this.setState({refreshing:true});
        this.setState({refreshing:false});
        this.getItems(this.items);
    }


    componentWillMount(){
        this.getItems(this.items);

    }

    deletePatient(key){
        this.items.child(key).remove();
    }

     getItems(items){
         items.on('value', (snap) => {

             // get children as an array
             var items = [];
             snap.forEach((child) => {
                 items.push({
                     patient: child.val().patient,
                     key: child.key
                 });
             });
             //console.log("saywhaaaaa");
             console.log(items);
             this.setState({
                 newpatients: items
             });
             this.setState({loading: false});

         });
    }

    delete(key,email){
        if(email === "admin@admin.com")
        {
            console.log("DELETE METHOD", )
            Alert.alert('INFO','Are you sure you want to delete this item?',
                [
                    {text: 'Yes',
                        onPress: () => {
                            this.items.child(key).remove();
                            this._onRefresh();
                        }},
                    {text: 'No',
                        onPress: () => console.log("NOOO!!!!")}
                ],
                {cancelable: false}
            )}

        if(email != "admin@admin.com")
        {

            console.log(username);
            Alert.alert('','Only admins can delete patients',
                [
                    {text: 'OK',
                        onPress: () => console.log("NOOO!!!!")}
                ],
                {cancelable: false}
            )
        }
    }

    showAlert(name,key){
        this.getRef().child("users").child(this.currentuser).once('value').then( snapshot =>{
            var username = (snapshot.val());
            this.delete(key,username.email);

        });

    }

    render(){
        const {navigate} = this.props.navigation;
        console.log("-----",this.state.newpatients);
        this.getRef().child("patients").child(this.currentuser).once('value').then((snapshot) => {
            var patient2 = (snapshot.val());
            console.log("patient2", patient2);
            if(patient2 != null){
                console.log("da");
                if(this.state.loading !== true){
                    console.log("dublu da");
                    navigate('Details', {patient: patient2.patient, key:this.currentuser, refresh: this._onRefresh});
                }
             }
        });
        if(this.state.loading !== true) {

            return (

                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>- List of Patients -</Text>
                    </View>

                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }

                        data = { this.state.newpatients }

                        renderItem={

                            ({item}) =>
                                <ScrollView>
                                    <View style={styles.linearView}>
                                        <Image style={{height: 70, width: 50, resizeMode: 'contain'}}
                                               source={''}/>
                                        <Text style={styles.item} onPress={
                                            () => navigate('Details', {patient: item.patient, key:item.key, refresh: this._onRefresh})}>{item.patient.name}</Text>
                                        <View style={styles.deleteView}>
                                            <TouchableOpacity style={styles.deleteButton}
                                                    onPress={ () => { this.showAlert(item.patient.name,item.key);
                                                    console.log("########", item.key)}}>
                                                <Text style={styles.reserveButtonText}> X </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ScrollView>
                        }
                        extraData = {this.state.newpatients}
                    />
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.reserveButton} onPress={() => {
                            this.getRef().child("users").child(this.currentuser).once('value').then(snapshot => {
                                var username = (snapshot.val());
                                console.log("-----------" + username);
                                if (username.email === "admin@admin.com") {
                                console.log("tttt",this.state.newpatients);
                                    navigate('Chart', {patients: this.state.newpatients, refresh: this._onRefresh})
//                                      navigate('Chart', {refresh: this._onRefresh});
                                }

                                if (username.email != "admin@admin.com") {
                                    console.log(username);
                                    Alert.alert('', 'Unavailable in admin mode!',
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => console.log("NOOO!!!!")
                                            }
                                        ],
                                        {cancelable: false}
                                    )
                                }
                            });

                        }
                        }>
                            <Text style={styles.reserveButtonText}> Chart </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addButton} onPress={() => {
                            this.getRef().child("users").child(this.currentuser).once('value').then(snapshot => {
                                var username = (snapshot.val());
                                console.log("-----------" + username.email);
                                if (username.email === "admin@admin.com") {
                                    navigate('AddPatient', {refresh: this._onRefresh})
                                }

                                if (username.email != "admin@admin.com") {
                                    console.log(username);
                                    Alert.alert('', 'Only admins can add patients',
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => console.log("NOOO!!!!")
                                            }
                                        ],
                                        {cancelable: false}
                                    )
                                }
                            });

                        }
                        }
                            >
                            <Text style={styles.reserveButtonText}> Add patient </Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.signOutButton} onPress={() =>
                            navigate('Home')}>
                            <Text style={styles.reserveButtonText}> Sign out </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            );
        }
        else{
            return(
                <View>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>- List of Patients -</Text>
                    </View>
                    <ActivityIndicator size="large" color="#E91E63" />
                </View>
            )
        }

        }
}


const styles = StyleSheet.create({
    container: {
        //flex: 1,
        height:650
        //paddingTop: 22
    },
    header:{
        backgroundColor: '#E91E63',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 10,
        borderBottomColor: '#ddd',
        //marginTop:-40,

    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    headerText:{
        color: 'white',
        fontSize: 18,
        padding: 26,
    },
    footer: {
        //position: 'absolute',
        alignItems: 'center',
        //marginBottom:-30,
        top:20,
        flexDirection:'row',
        left: 0,
        right: 0,
    },
    reserveButton: {
        backgroundColor: '#E91E63',
        //borderRadius: 30,
        borderColor: '#ccc',
        //alignItems: 'center',
        justifyContent: 'center',
        marginLeft:50,
        marginBottom:45,
        marginRight:7
    },
    deleteButton: {
        backgroundColor: '#E91E63',
        //alignSelf:'flex-end',
        borderRadius: 30,
        borderColor: '#ccc',
        //alignItems: 'center',
        justifyContent: 'center',
        marginLeft:50,
        marginBottom:45,
        marginRight:7
    },

    signOutButton:{
        backgroundColor: '#E91E63',
        //borderRadius: 30,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:45,
        marginLeft:7,
        marginRight:7
    },
    deleteView:{
        flex: 1, flexDirection: 'row', justifyContent: 'flex-end'
    },
    addButton:{
        backgroundColor: '#E91E63',
        //borderRadius: 30,
        borderColor: '#ccc',
        //alignItems: 'center',
        justifyContent: 'center',
        marginRight:50,
        marginRight:7,
        marginBottom:45
    },
    reserveButtonText: {
        color:'#fff',
        fontSize:24,
    },
    linearView: {
        flexDirection:'row',
        padding:8,

    },
    name:{
        color:'#E91E63',
        fontSize:25,
        textAlign:'center',
    },
    detailedImage: {
        height:220,
        width: 200,
        resizeMode: 'contain',
        marginBottom:28,
        marginTop:28
    }


});