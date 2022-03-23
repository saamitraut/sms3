import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  //
  TouchableOpacity,
} from 'react-native';
import AddEmployeeModal from './AddEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
import DeleteEmployeeModal from './deleteEmployeeModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';
//
import DeviceInfo from 'react-native-device-info';

class App extends Component {
  constructor(props) {
    super(props);

    // console.log(props);
    this.state = {
      calls: [],
      isAddEmployeeModalOpen: false,
      isEditEmployeeModalOpen: false,
      isDeleteEmployeeModalOpen: false,
      loading: false,
      errorMessage: '',
      selectedEmployee: {},
      engineerid: 0,
      status: 0,
      SubscriberName: '',
      deviceId: '',
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
    //
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
        console.log('line 99 appl.js');
        console.log(data);

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
        //setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };
  //

  componentDidMount() {
    // this.props.navigation.navigate('About');
    this.requestLocationPermission();
    this.getOneTimeLocationAsync();
    this.getEngineerId();
  }
  //
  getEngineerId = () => {
    AsyncStorage.getItem('token')
      .then(res => JSON.parse(res))
      .then(data => this.getData(data.engineerId));
  };
  //
  getData = engineerid => {
    this.setState({errorMessage: '', loading: true});
    var data = new FormData();

    data.append('EngineerId', engineerid);
    data.append('status', this.state.status);
    data.append('CallLogId', this.state.CallLogId);
    data.append('SubscriberName', this.state.SubscriberName);

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
  render() {
    // alert('hello');
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
            <TouchableOpacity
              onPress={() => {
                this.setState({status: 1});
                this.getEngineerId();
              }}
              style={[styles.button, {flex: 1, marginHorizontal: 5}]}>
              <Text style={[styles.buttonText]}>Open Calls</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({status: 0});
                this.getEngineerId();
              }}
              style={[styles.button, , {flex: 1, marginHorizontal: 5}]}>
              <Text style={[styles.buttonText]}>Closed Calls</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.logout} style={styles.button}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={this.getOneTimeLocationAsync}
              style={styles.button}>
              <Text style={styles.buttonText}>Hi</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TextInput
              defaultValue={''}
              style={styles.textBox}
              onChangeText={text => {
                this.setState({CallLogId: text});
                //
                this.getEngineerId();
              }}
              placeholder="Search CallLogId"
            />
            <TextInput
              defaultValue={''}
              style={styles.textBox}
              onChangeText={text => {
                this.setState({SubscriberName: text});
                //
                this.getEngineerId();
              }}
              placeholder="SubscriberName"
            />
          </View>
          <Text style={styles.title2}>
            {this.state.status ? 'Open calls' : 'Closed calls'}
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
