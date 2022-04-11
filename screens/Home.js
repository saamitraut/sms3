import React, {Component} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Home extends Component {
  constructor(props) {
    super(props);
    //
    // console.log('props on line 25 scrreens/Home.js');
    const {loggedinDetails} = props.route.params;
    // console.log(loggedinDetails);
    this.state = {
      loggedinDetails: loggedinDetails,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('token')
      .then(res => {
        if (res != null) {
          return JSON.parse(res);
        } else {
          this.props.navigation.navigate('Logout');
        }
      })
      .then(data => {
        // console.log(data);
        // console.log('screens/loginscreen line 25');
        // this.setState({loggedinDetails: data});
      });
  }

  render() {
    return (
      <View>
        <Text>{JSON.stringify(this.state.loggedinDetails)}</Text>
      </View>
    );
  }
}

export default Home;
