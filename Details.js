import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TextInput,
    Button,
    AsyncStorage,
    TouchableOpacity,
    processColor,
    Alert,
    Linking,

} from 'react-native';
import {StackNavigator, SafeAreaView} from 'react-navigation';
import {firebaseApp} from './PatientList';
import {NotificationsAndroid} from 'react-native-notifications';



export class Details extends Component{
    static navigationOptions = {
        //name: 'Home',
        header:null,
    };




     updatePatientAddress(index,address) {
        const items = firebaseApp.database().ref().child('patients');

        console.log("keeeeeeeeeeeeeeyyyyyyyyyy",index);
        items.child(index).child("patient").child("address").set(address);
         NotificationsAndroid.localNotification({
             name: "Patient Management",
             body: "Thank you for updating our database!",
             extra: "data"
         });
    }

     updatePatientCNP(index,cnp) {
         const items = firebaseApp.database().ref().child('patients');

         console.log("keeeeeeeeeyyyyyyyyyyyyy:",index);
         items.child(index).child("patient").child("cnp").set(cnp);
         NotificationsAndroid.localNotification({
             name: "Patient Management",
             body: "Thank you for updating our database!",
             extra: "data"
         });
    }

         updatePatientEmail(index,email) {
             const items = firebaseApp.database().ref().child('patients');

             console.log("keeeeeeeeeyyyyyyyyyyyyy:",index);
             items.child(index).child("patient").child("email").set(email);
             NotificationsAndroid.localNotification({
                 name: "Patient Management",
                 body: "Thank you for updating our database!",
                 extra: "data"
             });
        }
     updatePatientNextConsult(index,next_consult) {
         const items = firebaseApp.database().ref().child('patients');

         console.log("keeeeeeeeeyyyyyyyyyyyyy:",index);
         items.child(index).child("patient").child("next_consult").set(next_consult);
         NotificationsAndroid.localNotification({
             name: "Patient Management",
             body: "Thank you for updating our database!",
             extra: "data"
         });
    }

    sendEMail(patient){
//    receiver = "test@gmail.com";
      receiver = patient.email
        subject = "Update on personal details";
        body = "Hello,\n " + patient.name + ", your personal details have changed! \n"+
         "Please check de Doctors Office Mobile App for further information. \n Regards,\n DocTech Team";
        all = "mailto:" + receiver + "?subject=" + subject + "&body=" + body;
        Linking.openURL(all)
    }
    render() {
        const {navigate} = this.props.navigation;
        const {params} = this.props.navigation.state;
        const {goBack} = this.props.navigation;
        var patient = params ? params.patient : "<undefined>";
        var key = params ? params.key : "<undefined>"


        return (
            <View>
                <ScrollView>
                    <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                        <Text style = {styles.patientName}>- {patient.name} -</Text>
                        <TextInput style = {{width:150,textAlign:'center'}} onChangeText={(text) => this.setState({newCNP: text})}> {patient.cnp} </TextInput>
                        <TextInput style = {{width:150,textAlign:'center'}} onChangeText={(text) => this.setState({newEmail: text})}> {patient.email} </TextInput>
                        <TextInput style = {{width:150,textAlign:'center'}} onChangeText={(text) => this.setState({newNextConsult: text})}> {patient.next_consult} </TextInput>
                        <Image style={styles.detailedImage} source={patient.image}/>
                        <ScrollView>
                            <TextInput style={{height:160, width: 350, marginTop:10 }} multiline={true} onChangeText={(text) => this.setState({newAddress: text})}> {patient.address} </TextInput>
                        </ScrollView>
                    </View>
                </ScrollView>
                <View>
                    <TouchableOpacity style={styles.reserveButton} onPress={
                     () => {
                        if (this.state.newAddress) {
                             this.updatePatientAddress(key, this.state.newAddress);
                        }
                        if (this.state.newCNP) {
                                this.updatePatientCNP(key, this.state.newCNP);
                        }
                         if (this.state.newNextConsult) {
                                this.updatePatientNextConsult(key, this.state.newNextConsult);
                        }
                        if (this.state.newEmail) {
                                this.updatePatientEmail(key, this.state.newEmail);
                        }
                        params.refresh();
                        this.sendEMail(patient);
                        goBack();

                    }
                }>
                        <Text style={styles.reserveButtonText}>Save changes </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reserveButton} onPress={() => {
                     firebaseApp.database().ref().child("users").child(firebaseApp.auth().currentUser.uid).once('value').then(snapshot => {
                       var username = (snapshot.val());
                       console.log("uuu", username.email);
                       if (username.email === "admin@admin.com") {
                            navigate('Chart',{name:patient.next_consult})
                       }
                       if (username.email != "admin@admin.com") {
                           console.log(username);
                           Alert.alert('', 'You have 0 statistics',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => console.log("NOOO!!!!")
                                }
                            ],
                            {cancelable: false})
                        }
                      });
                      }}>


                        <Text style={styles.reserveButtonText}> Chart </Text>
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        position: 'absolute',
        alignItems: 'center',
        bottom: 0,
        left: 0,
        right: 0,
    },
    reserveButton: {
        backgroundColor: '#E91E63',
        //borderRadius: 30,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:40,

    },
    reserveButtonText: {
        color:'#fff',
        fontSize:24,
    },
    linearView: {
        flexDirection:'row',
        padding:8,
    },
    patientName:{
        color:'#E91E63',
        fontSize:25,
        textAlign:'center',
    },
    detailedImage: {
        height:10,
        width: 10,
        resizeMode: 'contain',
        marginBottom:28,
        marginTop:28
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
        }


});
