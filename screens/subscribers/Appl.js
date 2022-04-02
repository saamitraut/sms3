import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  //
  TouchableOpacity,
  Linking,
} from 'react-native';
import AddEmployeeModal from './AddEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
import DeleteEmployeeModal from './deleteEmployeeModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {json} from 'stream/consumers';

class App extends Component {
  constructor(props) {
    super(props);
    // console.log('props on line 25 appl.js');
    // console.log(props.route.params.loggedinDetails);

    this.state = {
      subscribers: [],
      isAddEmployeeModalOpen: false,
      isEditEmployeeModalOpen: false,
      isDeleteEmployeeModalOpen: false,
      loading: false,
      errorMessage: '',
      selectedEmployee: {},
      deviceId: '',
      loggedinDetails: {},
    };
  }

  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
      subscribeLocationLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          //   this.getOneTimeLocation();
          //   this.subscribeLocationLocation();
        } else {
          this.setState({locationStatus: 'Permission Denied'});
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  //   requestLocationPermission();

  getOneTimeLocationAsync = () => {
    AsyncStorage.getItem('token')
      .then(res => JSON.parse(res))
      .then(data => this.getOneTimeLocation(data.engineerId));
  };

  getOneTimeLocation = engineerId => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        this.setState({currentLongitude});

        //Setting Longitude state
        this.setState({currentLatitude});

        //save location in database
        var data = new FormData();

        data.append(
          'currentLongitude',
          JSON.stringify(position.coords.longitude),
        );
        // return;

        data.append(
          'currentLatitude',
          JSON.stringify(position.coords.latitude),
        );
        data.append('deviceid', DeviceInfo.getUniqueId());
        data.append('engineerId', engineerId);

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener('readystatechange', function () {
          if (this.readyState === 4) {
            // alert(this.responseText);
          }
        });
        xhr.open('POST', 'http://103.219.0.103/sla/savelocation.php');

        xhr.send(data);
      },
      error => {
        //setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  componentDidMount() {
    //    RECEIVING LOGGEDINDETAILS AS PROPS AND SAVING THEM AS CONSTANTS

    const {email, engineerId, fullName} =
      this.props.route.params.loggedinDetails;

    this.setState({loggedinDetails: this.props.route.params.loggedinDetails});

    this.setState({email: email, engineerId: engineerId, fullName: fullName});

    this.requestLocationPermission();

    this.getOneTimeLocation(engineerId);

    this.getData({});
  }

  getData = props => {
    this.setState({errorMessage: '', loading: true});
    var data = new FormData();

    data.append('norows', 50);
    data.append('pwd', 'cGFzc3dvcmQ%253D');
    if (props.hasOwnProperty('SubscriberName')) {
      data.append('SubscriberName', props.SubscriberName);
    }
    if (props.hasOwnProperty('MobileNo')) {
      data.append('MobileNo', props.MobileNo);
    }

    if (props.hasOwnProperty('CustomerId')) {
      data.append('CustomerId', props.CustomerId);
    }
    const APIURL = 'http://103.219.0.103/sla/getSubscriberDetails.php';

    fetch(APIURL, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then(res => {
        // console.log(res),
        this.setState({
          subscribers: res.data,
          loading: false,
          errorMessage: '',
        });
      })
      .catch(() =>
        this.setState({
          loading: false,
          errorMessage: 'Network Error. Please try again.',
        }),
      );
  };
  logout = () => {
    AsyncStorage.removeItem('token')
      .then(() => {
        this.props.navigation.navigate('Login');
      })
      .catch(err => console.log(err));
  };

  toggleAddEmployeeModal = () => {
    this.setState({isAddEmployeeModalOpen: !this.state.isAddEmployeeModalOpen});
  };

  toggleEditEmployeeModal = () => {
    this.setState({
      isEditEmployeeModalOpen: !this.state.isEditEmployeeModalOpen,
    });
  };

  toggleDeleteEmployeeModal = () => {
    this.setState({
      isDeleteEmployeeModalOpen: !this.state.isDeleteEmployeeModalOpen,
    });
  };

  addEmployee = data => {
    // this.state.employee array is seprated into object by rest operator
    this.setState({employee: [data, ...this.state.employee]});
  };

  updateEmployee = data => {
    // updating employee data with updated data if employee id is matched with updated data id
    this.setState({
      subscribers: this.state.subscribers.map(call =>
        call.complaintid == data.complaintid ? data : call,
      ),
    });
  };

  deleteEmployee = employeeId => {
    // delete employee lsit with deleted data if employee id is matched with updated data id
    this.setState({
      employee: this.state.employee.filter(emp => emp.id !== employeeId),
    });
  };

  makeCall = phoneNumber => {
    if (Platform.OS === 'android') {
      phoneNumber = 'tel:${' + phoneNumber + '}';
    } else {
      phoneNumber = 'telprompt:${' + phoneNumber + '}';
    }

    Linking.openURL(phoneNumber);
  };

  render() {
    // console.log('render function 270 the states Appl.js');
    // console.log(this.state);
    const {
      loading,
      errorMessage,
      employee,
      isAddEmployeeModalOpen,
      isEditEmployeeModalOpen,
      isDeleteEmployeeModalOpen,
      selectedEmployee,
    } = this.state;
    return (
      <ScrollView>
        <View style={styles.container}>
          {/* <TouchableOpacity
            onPress={this.toggleAddEmployeeModal}
            style={styles.button}>
            <Text style={styles.buttonText}>Add Call</Text>
          </TouchableOpacity> */}
          <View
            style={[
              styles.container,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            ]}>
            {/* <TouchableOpacity
              onPress={() => {
                this.setState({status: 1});
                this.getEngineerId();
              }}
              style={[
                styles.button,
                {flex: 1, marginHorizontal: 5, display: 'none'},
              ]}>
              <Text style={[styles.buttonText]}>Open subscribers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({status: 0});
                this.getEngineerId();
              }}
              style={[
                styles.button,
                ,
                {flex: 1, marginHorizontal: 5, display: 'none'},
              ]}>
              <Text style={[styles.buttonText]}>Closed subscribers</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={this.logout} style={styles.button}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={this.getOneTimeLocationAsync}
              style={styles.button}>
              <Text style={styles.buttonText}>Hi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.setState({
                  SubscriberName: '',
                  CustomerId: '',
                  MobileNo: '',
                });
                this.getData({});
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TextInput
              defaultValue={''}
              style={styles.textBox}
              value={this.state.CustomerId}
              onChangeText={text => {
                this.setState(
                  {CustomerId: text},
                  this.getData({CustomerId: text}),
                );
              }}
              placeholder="CustomerId"
            />
            <TextInput
              defaultValue={''}
              style={styles.textBox}
              value={this.state.SubscriberName}
              onChangeText={text => {
                this.setState(
                  {SubscriberName: text},
                  this.getData({SubscriberName: text}),
                );
              }}
              placeholder="SubscriberName"
            />
            <TextInput
              defaultValue={''}
              style={styles.textBox}
              value={this.state.MobileNo}
              onChangeText={text => {
                this.setState({MobileNo: text}, this.getData({MobileNo: text}));
              }}
              placeholder="MobileNo"
            />
          </View>
          {/* <Text style={styles.title2}>
            {this.state.status ? 'Open subscribers' : 'Closed subscribers'}
          </Text> */}
          {this.state.subscribers != undefined ? (
            <View>
              {this.state.loading && (
                <Text style={styles.title}>Please wait</Text>
              )}
              <Text>Total subscribers {this.state.subscribers.length}</Text>
              <Text style={styles.title}>Subscribers</Text>
              {this.state.subscribers.map((subscriber, index) => (
                <View
                  style={styles.employeeListContainer}
                  key={subscriber.subscriberid}>
                  <Text style={{...styles.listItem, color: 'tomato'}}>
                    {index + 1}.
                  </Text>
                  <Text style={styles.name}>{subscriber.SubscriberName}</Text>
                  <Text
                    style={styles.listItem}
                    onPress={() => this.makeCall(subscriber.MobileNo)}>
                    {'MobileNo: ' + subscriber.MobileNo}
                  </Text>
                  <Text style={styles.listItem}>
                    subscriberid: {subscriber.subscriberid}
                  </Text>
                  <Text style={styles.listItem}>
                    FormNo: {subscriber.FormNo}
                  </Text>
                  <Text style={styles.listItem}>
                    CustomerId: {subscriber.CustomerId}
                  </Text>
                  <Text style={styles.listItem}>
                    Operator: {subscriber.Operator}
                  </Text>
                  <Text style={styles.listItem}>Area: {subscriber.Area}</Text>
                  <Text style={styles.listItem}>
                    SocietyName: {subscriber.SocietyName}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        this.toggleEditEmployeeModal();
                        this.setState({selectedEmployee: subscriber});
                      }}
                      style={{...styles.button, marginVertical: 0}}>
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {isEditEmployeeModalOpen ? (
                <EditEmployeeModal
                  isOpen={isEditEmployeeModalOpen}
                  closeModal={this.toggleEditEmployeeModal}
                  selectedEmployee={selectedEmployee}
                  updateEmployee={this.updateEmployee}
                />
              ) : null}
            </View>
          ) : (
            <Text>No subscribers</Text>
          )}
        </View>
      </ScrollView>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  button: {
    borderRadius: 5,
    marginVertical: 20,
    alignSelf: 'flex-start',
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  title2: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    color: '#000000',
  },
  employeeListContainer: {
    marginBottom: 25,
    elevation: 4,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  listItem: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    color: 'tomato',
    fontSize: 19,
  },
  //
  row: {flex: 1, flexDirection: 'row', justifyContent: 'space-between'},
});
