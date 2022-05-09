import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Dashboard from 'react-native-dashboard';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

class Home2 extends Component {
  constructor(props) {
    super(props);
    //
    // console.log('props on line 25 scrreens/Home.js');
    const {loggedinDetails} = props.route.params;
    // console.log(loggedinDetails);
    this.state = {
      count: 0,
      loggedinDetails: loggedinDetails,
    };
  }

  navigate = this.props.navigation.navigate;

  data = [
    {
      name: ' Open Calls',
      background: 'rgba(255, 255, 255, 0.9)',
      icon: () => (
        <Icon1
          name={'phone-call'}
          size={50}
          color={'#6699cc'}
          // style={{flex: 1, marginTop: 20, marginHorizontal: 5}}
          onPress={() => {
            this.navigate('Calls', {status: 1});
          }}
        />
      ),

      nameColor: '#6699cc',
    },
    {
      name: 'Closed Calls',
      background: 'rgba(255, 255, 255, 0.9)',
      icon: () => (
        <Icon2
          name={'phone-callback'}
          size={50}
          color={'#6699cc'}
          // style={{flex: 1, marginTop: 20, marginHorizontal: 5}}
          onPress={() => {
            this.navigate('Calls', {status: 0});
          }}
        />
      ),
      nameColor: '#6699cc',
    },
  ];

  getData = () => {
    const {engineerId} = this.props.route.params.loggedinDetails;
    // alert('hello');
    var data = new FormData();
    data.append('EngineerId', engineerId);
    data.append('status', 1);
    // data.append('CallLogId', this.state.CallLogId);
    // data.append('SubscriberName', this.state.SubscriberName);
    // data.append('updatedon', this.state.updatedon.toISOString().slice(0, 10));

    const InsertAPIURL = 'http://103.219.0.103/sla/getCallDetails.php';

    // console.log(this.data[0].name);
    fetch(InsertAPIURL, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then(res => {
        this.data[0].name = 'Open Calls: ' + Object.entries(res.data).length;
        this.setState({
          loading: false,
          errorMessage: '',
        });
      })
      .catch(
        error =>
          this.setState({
            loading: false,
            errorMessage: 'Network Error. Please try again.',
          }),
        // console.log(error),
      );
  };

  componentDidMount() {
    const {loggedinDetails} = this.props.route.params;
    const {navigate} = this.props.navigation;
    if (loggedinDetails == null) {
      navigate('Login');
    }
    // console.log(loggedinDetails);
    // AsyncStorage.getItem('token').then(res => {})
    this.getData();
  }

  render() {
    const {navigate} = this.props.navigation;
    // alert(this.state.count);
    return (
      <View style={styles.container}>
        <ImageBackground
          imageStyle={{opacity: 0.5}}
          source={{
            // uri: 'https://www.kindpng.com/picc/m/567-5674919_inventory-management-inventory-management-system-png-transparent-png.png',
            uri: 'https://www.kindpng.com/picc/m/264-2640361_inventory-management-system-png-transparent-png.png',
          }}
          resizeMode="cover"
          style={styles.image}>
          <TouchableOpacity onPress={this.getData} style={styles.button}>
            {/* <Text style={styles.buttonText}>Refresh</Text> */}
            <Icon style={styles.buttonText} name="refresh" />
          </TouchableOpacity>
          <Dashboard
            data={this.data}
            background={true}
            // card={card}
            column={2}
            rippleColor={'#3498db'}
          />
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  button: {
    borderRadius: 5,
    margin: 10,
    alignSelf: 'flex-end',
    backgroundColor: 'white',
  },
  buttonText: {
    color: '#6699cc',
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 23,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});
export default Home2;
