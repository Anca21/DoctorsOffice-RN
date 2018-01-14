import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    RefreshControl,
    AsyncStorage,
    TextInput
} from 'react-native';
import React, { Component } from 'react';
import {Patients} from './Patients'
import {firebaseApp} from './PatientList'

export class AddPatient extends Component{

    static navigationOptions = {
        //name: 'Home',
        header:null,
    };


    print(){
        console.log(this.state.newName);
        console.log(this.state.newCNP);
        console.log(this.state.newAddress);
        console.log(this.state.newNextConsult);
        console.log(this.state.newDescription);
        console.log(this.state.newEmail);
        console.log(this.state.newPassword);
    }

    save()
    {
        console.log("----------------------");
        //console.log(items.patient);
        const items = firebaseApp.database().ref().child('patients');
        items.push({patient :new Patients(this.state.newName,this.state.newCNP,this.state.newAddress,this.state.newEmail, this.state.newNextConsult,require('./img/book_ex.png'))});
        firebaseApp.auth().createUserWithEmailAndPassword(this.state.newEmail, this.state.newPassword).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        });

    }

    render(){
        const {params} = this.props.navigation.state;
        const {goBack} = this.props.navigation;
        return(

            <View>
                <ScrollView>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style = {styles.patientName}>- Add a patient -</Text>
                        <TextInput style= {{alignSelf: 'stretch'}} placeholder="  Name" onChangeText={(text) => this.setState({newName: text})}/>
                        <TextInput style= {{alignSelf: 'stretch'}} placeholder="  CNP" onChangeText={(text) => this.setState({newCNP: text})}/>
                        <TextInput style= {{alignSelf: 'stretch'}} placeholder="  Address" onChangeText={(text) => this.setState({newAddress: text})}/>
                        <TextInput style= {{alignSelf: 'stretch'}} placeholder="  Email" onChangeText={(text) => this.setState({newEmail: text})}/>
                        <TextInput style= {{alignSelf: 'stretch'}} placeholder="  Password" onChangeText={(text) => this.setState({newPassword: text})}/>
                        <TextInput style= {{alignSelf: 'stretch'}} placeholder="  Next Consult" onChangeText={(text) => this.setState({newNextConsult: text})}/>


                    </View>
                </ScrollView>
                <View>
                    <TouchableOpacity style={styles.reserveButton}
                                      onPress={
                                          () =>{
                                              this.save();
                                              params.refresh();
                                              goBack();
                                          }
                                      }

                    >
                        <Text style={styles.reserveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
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
        marginBottom:45,

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
        height:220,
        width: 200,
        resizeMode: 'contain',
        marginBottom:28,
        marginTop:28
    }


});
