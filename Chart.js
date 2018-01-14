import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    processColor,
} from 'react-native';

import {StackNavigator, SafeAreaView} from 'react-navigation';

import {PieChart} from 'react-native-charts-wrapper';

export class Chart extends React.Component {

    constructor() {
        super();

        this.state = {
            day0: 0,
            day1: 0,
            day2: 0,
            day3: 0,
            day4: 0,
            day5: 0,
            day6: 0,
            date : new Date,
            legend: {
                enabled: true,
                textSize: 8,
                form: 'CIRCLE',
                position: 'RIGHT_OF_CHART',
                wordWrapEnabled: true
            },
            description: {
                text: 'Pie chart description',
                textSize: 15,
                textColor: processColor('darkgray')

            }
        };
    }


    analise(patients) {
        var array = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        var date = new Date();
        console.log("ppp", date);
        for (i = 0; i < patients.length; i++) {
            console.log(patients[i].patient.next_consult);
            if (patients[i].patient.next_consult.indexOf(""+(array[date.getDay()]))!=-1){
                this.state.day0 = this.state.day0+1;
            }
            if (patients[i].patient.next_consult.indexOf(""+(array[date.getDay()+1]))!=-1){
                this.state.day1 = this.state.day1+1;
            }
            if (patients[i].patient.next_consult.indexOf(""+(array[date.getDay()+2]))!=-1){
                this.state.day2 = this.state.day2+1;
            }
            if (patients[i].patient.next_consult.indexOf(""+(array[date.getDay()+3]))!=-1){
                this.state.day3 = this.state.day3+1;
            }
            if (patients[i].patient.next_consult.indexOf(""+(array[date.getDay()+4]))!=-1){
                this.state.day4 = this.state.day4+1;
            }
            if (patients[i].patient.next_consult.indexOf(""+(array[date.getDay()+6]))!=-1){
                this.state.day6 = this.state.day6+1;
            }
            if (patients[i].patient.next_consult.indexOf(""+(array[date.getDay()+5]))!=-1){
                this.state.day5 = this.state.day5+1;
            }

        }
    }

    render() {
        const {params} = this.props.navigation.state;
        var patients = params ? params.patients : "<undefined>";
        this.analise(patients);
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <PieChart
                        style={styles.chart}
                        logEnabled={true}
                        chartDescription={this.state.description}
                        data={{
                            dataSets: [{
                            values: [
                                {value: this.state.day0, label: "Sun"},
                                {value: this.state.day1, label: "Mon"},
                                {value: this.state.day2, label: "Tue"},
                                {value: this.state.day3, label: "Wed"},
                                {value: this.state.day4, label: "Thu"},
                                {value: this.state.day5, label: "Fri"},
                                {value: this.state.day6, label: "Sat"}],
                            label: 'Legend',
                            config: {
                            colors: [processColor('#C0FF8C'), processColor('#FFF78C'), processColor('#FFD08C'),processColor('#D23B3B'),processColor('#70072C'),processColor('#749E0A'),processColor('#059B65')],
                            valueTextSize: 20,
                            valueTextColor: processColor('green'),
                            sliceSpace: 5,
                            selectionShift: 13
                        }
                        }]}}
                        legend={this.state.legend}

                        entryLabelColor={processColor('black')}
                        entryLabelTextSize={20}

                        rotationEnabled={true}
                        rotationAngle={45}
                        drawSliceText={true}
                        usePercentValues={true}
                        centerTextRadiusPercent={100}
                        holeRadius={40}
                        holeColor={processColor('#f0f0f0')}
                        transparentCircleRadius={45}
                        transparentCircleColor={processColor('#f0f0f088')}
                        maxAngle={360}
                    />
                </View>

            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    chart: {
        flex: 1
    }
});

