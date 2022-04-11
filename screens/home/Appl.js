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
import DatePicker2 from '../DatePicker2';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

class App extends Component {
  constructor(props) {
    super(props);

    const {loggedinDetails} = props.route.params;
    const {email, engineerId, fullName} = loggedinDetails;
    var date = new Date();
    this.state = {
      calls: [],
      isAddEmployeeModalOpen: false,
      isEditEmployeeModalOpen: false,
      isDeleteEmployeeModalOpen: false,
      loading: false,
      errorMessage: '',
      selectedEmployee: {},
      status: 0,
      SubscriberName: '',
      deviceId: '',
      loggedinDetails: loggedinDetails,
      email: email,
      engineerId: engineerId,
      fullName: fullName,
      updatedon: date,
      // date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
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

  getOneTimeLocation = () => {
    alert('Will give you the current location');
    Geolocation.getCurrentPosition(
      position => {
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        console.log('position on line 91 screens/home/appl');
        alert(position);
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

        data.append(
          'currentLatitude',
          JSON.stringify(position.coords.latitude),
        );
        data.append('deviceid', DeviceInfo.getUniqueId());
        data.append('engineerId', this.state.engineerId);
        alert(JSON.stringify(data));
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener('readystatechange', function () {
          if (this.readyState === 4) {
            alert(this.responseText);
          }
        });
        xhr.open('POST', 'http://103.219.0.103/sla/savelocation.php');

        xhr.send(data);
      },
      error => {
        // setLocationStatus(error.message);
        console.log(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 10000,
      },
    );
  };

  componentDidMount() {
    this.requestLocationPermission();
    this.getOneTimeLocation();

    this.getData();
    // alert('componentDidMount is called');
    // this.watchID = this.getWatchId(engineerId);
  }
  //
  getWatchId = engineerId => {
    // alert(engineerId);
    Geolocation.watchPosition(position => {
      //
      //alert('hello');
      const lastPosition = JSON.stringify(position);
      this.setState({lastPosition});

      var data = new FormData();
      data.append(
        'currentLongitude',
        JSON.stringify(position.coords.longitude),
      );

      data.append('currentLatitude', JSON.stringify(position.coords.latitude));
      data.append('deviceid', DeviceInfo.getUniqueId());
      data.append('engineerId', engineerId);

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
        }
      });

      xhr.open('POST', 'http://103.219.0.103/api/insert2.php');
      xhr.send(data);
    });
  };

  componentWillUnmount = () => {
    // Geolocation.clearWatch(this.watchID);
  };

  getEngineerId = () => {
    AsyncStorage.getItem('token')
      .then(res => JSON.parse(res))
      .then(data => {
        this.setState({engineerId: data.engineerId});
        // alert('the state is' + JSON.stringify(this.state));
        this.getData(data.engineerId);
      });
  };

  getData = () => {
    this.setState({errorMessage: '', loading: true});
    var data = new FormData();
    // alert('getdata called');
    data.append('EngineerId', this.state.engineerId);
    data.append('status', this.state.status);
    data.append('CallLogId', this.state.CallLogId);
    data.append('SubscriberName', this.state.SubscriberName);
    data.append('updatedon', this.state.updatedon.toISOString().slice(0, 10));

    const InsertAPIURL = 'http://103.219.0.103/sla/getCallDetails.php';

    fetch(InsertAPIURL, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then(res => {
        //
        // console.log(res),
        this.setState({
          calls: res.data,
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
      calls: this.state.calls.map(call =>
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
  update = date => this.setState({updatedon: date, status: 0});

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
          {/* navData.navigation.navigate('Home', {loggedinDetails: JSON.parse(token)}); */}
          {/* <TouchableOpacity
            onPress={this.toggleAddEmployeeModal}
            style={styles.button}>
            <Text style={styles.buttonText}>Add Call</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('Subscribers', {
                loggedinDetails: this.state.loggedinDetails,
              })
            }
            style={styles.button}>
            <Text style={styles.buttonText}>Subscribers</Text>
          </TouchableOpacity> */}

          <View
            style={[
              styles.container,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            ]}>
            <Icon1
              name={'phone-call'}
              size={50}
              color={'#6699cc'}
              style={{flex: 1, marginTop: 20, marginHorizontal: 5}}
              onPress={() => {
                this.setState({status: 1}, () => this.getData());
              }}
            />
            <Icon2
              name={'phone-callback'}
              size={50}
              color={'#6699CC'}
              style={{flex: 1, marginTop: 20, marginHorizontal: 5}}
              onPress={() => {
                this.setState({status: 0}, () => this.getData());
              }}
            />
            <DatePicker2
              update={this.update}
              updatedon={this.state.updatedon}
              getData={this.getData}
            />
            {/* <TouchableOpacity
              onPress={() => {
                this.setState({status: 1}, () => this.getData());
              }}
              style={[styles.button, {flex: 1, marginHorizontal: 5}]}>
              <Text style={[styles.buttonText]}>Open Calls</Text>
            </TouchableOpacity> */}

            {/* <TouchableOpacity
              onPress={() => {
                this.setState({status: 0}, () => this.getData());
              }}
              style={[styles.button, , {flex: 1, marginHorizontal: 5}]}>
              <Text style={[styles.buttonText]}>Closed Calls</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.logout} style={styles.button}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity> */}
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={this.getOneTimeLocation}
              style={styles.button}>
              <Text style={styles.buttonText}>Hi</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TextInput
              defaultValue={''}
              style={styles.textBox}
              onChangeText={text => {
                this.setState({CallLogId: text}, () => this.getData());
              }}
              placeholder="Search CallLogId"
            />
            <TextInput
              defaultValue={''}
              style={styles.textBox}
              onChangeText={text => {
                this.setState({SubscriberName: text}, () => this.getData());
              }}
              placeholder="SubscriberName"
            />
          </View>
          <Text style={styles.title2}>
            {this.state.status
              ? 'Open calls'
              : 'Closed calls on ' + this.state.updatedon.toDateString()}
          </Text>
          {this.state.calls != undefined ? (
            <View>
              <Text>Total Calls {this.state.calls.length}</Text>
              <Text style={styles.title}>Call Lists:</Text>
              {this.state.calls.map((call, index) => (
                <View style={styles.employeeListContainer} key={call.CallLogId}>
                  <Text style={{...styles.listItem, color: 'tomato'}}>
                    {index + 1}.
                  </Text>
                  <Text style={styles.name}>{call.SubscriberName}</Text>
                  <Text
                    style={styles.listItem}
                    onPress={() => this.makeCall(call.MobileNo)}>
                    {'MobileNo: ' + call.MobileNo}
                  </Text>

                  <Text style={styles.listItem}>
                    CallLogId: {call.CallLogId}
                  </Text>
                  <Text style={styles.listItem}>
                    Last Reply: {call.ClosedReply}
                  </Text>
                  <Text style={styles.listItem}>
                    Description: {call.Description}
                  </Text>
                  <Text style={styles.listItem}>Address: {call.address} </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        this.toggleEditEmployeeModal();
                        this.setState({selectedEmployee: call});
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
            <Text>No calls</Text>
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
