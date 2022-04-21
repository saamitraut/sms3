import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';

import AddEmployeeModal from './AddEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
import DeleteEmployeeModal from './deleteEmployeeModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service'; //V IMP
//import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import DatePicker2 from '../../components/DatePicker2';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import FlashMessage from 'react-native-flash-message';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {
  requestLocationPermission,
  getOneTimeLocation,
} from '../../helpers/locationHelper';

import OpenCalls from '../../components/OpenCalls';
import ClosedCalls from '../../components/ClosedCalls';

class App extends Component {
  constructor(props) {
    super(props);
    const {loggedinDetails, status} = props.route.params;
    const {email, engineerId, fullName, userid} = loggedinDetails;
    // console.log(typeof status == 'undefined' ? 1 : status);
    var date = new Date();

    this.state = {
      calls: [],
      isAddEmployeeModalOpen: false,
      isEditEmployeeModalOpen: false,
      isDeleteEmployeeModalOpen: false,
      loading: false,
      errorMessage: '',
      selectedEmployee: {},
      status: status == 'undefined' ? 1 : status,
      SubscriberName: '',
      deviceId: '',
      loggedinDetails: loggedinDetails,
      email: email,
      engineerId: engineerId,
      fullName: fullName,
      updatedon: date,
      // date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      locationStatus: '',
    };
  }
  updateStatus = status => this.setState({status: status});

  PermissionDenied = () => this.setState({locationStatus: 'Permission Denied'});

  updateStateCalls = data =>
    this.setState({
      calls: data,
      loading: false,
      errorMessage: '',
    });

  hideError = () => this.setState({errorMessage: '', loading: true});

  showError = () =>
    this.setState({
      loading: false,
      errorMessage: 'Network Error. Please try again.',
    });
  //

  componentDidMount() {
    requestLocationPermission(this.PermissionDenied);

    getOneTimeLocation(this.state.engineerId);

    this.getData(
      this.state.engineerId,
      this.state.status,
      this.state.CallLogId,
      this.state.SubscriberName,
      this.state.updatedon.toISOString().slice(0, 10),
    );
  }

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

  // componentWillUnmount = () => {Geolocation.clearWatch(this.watchID);};

  getData = (EngineerId, status, CallLogId, SubscriberName, updatedon) => {
    this.hideError();

    var data = new FormData();

    data.append('EngineerId', EngineerId);
    data.append('status', status);
    data.append('CallLogId', CallLogId);
    data.append('SubscriberName', SubscriberName);
    data.append('updatedon', updatedon);
    const InsertAPIURL = 'http://103.219.0.103/sla/getCallDetails.php';

    fetch(InsertAPIURL, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then(res => this.updateStateCalls(res.data))
      .catch(() => this.showError());
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
    this.setState(
      {
        calls: this.state.calls.map(call =>
          call.complaintid == data.complaintid ? data : call,
        ),
        //
        status: 0,
      },
      () =>
        this.getData(
          this.state.engineerId,
          this.state.status,
          this.state.CallLogId,
          this.state.SubscriberName,
          this.state.updatedon.toISOString().slice(0, 10),
        ),
    );
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

  update = date => {
    // console.log(date);
    this.setState(
      {updatedon: date, status: 0},
      this.getData(
        this.state.engineerId,
        0,
        this.state.CallLogId,
        this.state.SubscriberName,
        date.toISOString().slice(0, 10),
      ),
    );
  };

  updateCalls = data =>
    this.setState({
      calls: data,
      loading: false,
      errorMessage: '',
    });

  updateError = () => {
    this.setState({
      loading: false,
      errorMessage: 'Network Error. Please try again.',
    });
  };

  render() {
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
            <OpenCalls
              params={{
                engineerId: this.state.engineerId,
                updateStateCalls: this.updateStateCalls,
                showError: this.showError,
                hideError: this.hideError,
                updateStatus: this.updateStatus,
              }}
            />
            <ClosedCalls
              params={{
                engineerId: this.state.engineerId,
                updatedon: new Date(),
                updateStateCalls: this.updateStateCalls,
                showError: this.showError,
                hideError: this.hideError,
                updateStatus: this.updateStatus,
              }}
            />

            <DatePicker2 update={this.update} />
            <Icon2
              name={'my-location'}
              size={50}
              color={'#6699CC'}
              style={{flex: 1, marginTop: 20, marginHorizontal: 5}}
              onPress={() => {
                this.getOneTimeLocation();
              }}
            />
          </View>

          <View>
            <Text style={{color: 'red'}}>{this.state.locationStatus}</Text>
          </View>
          <View style={styles.row}>
            <TextInput
              defaultValue={''}
              style={styles.textBox}
              onChangeText={text => {
                this.setState({CallLogId: text}, () =>
                  this.getData(
                    this.state.engineerId,
                    this.state.status,
                    this.state.CallLogId,
                    this.state.SubscriberName,
                    this.state.updatedon.toISOString().slice(0, 10),
                  ),
                );
              }}
              placeholder="Search CallLogId"
            />
            <TextInput
              defaultValue={''}
              style={styles.textBox}
              onChangeText={text => {
                this.setState({SubscriberName: text}, () =>
                  this.getData(
                    this.state.engineerId,
                    this.state.status,
                    this.state.CallLogId,
                    this.state.SubscriberName,
                    this.state.updatedon.toISOString().slice(0, 10),
                  ),
                );
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
                      {/* <Text style={styles.buttonText}>{this.state.status}</Text> */}
                      {this.state.status ? (
                        <Icon1 style={styles.buttonText} name="edit-3"></Icon1>
                      ) : (
                        <Icon1 style={styles.buttonText} name="eye"></Icon1>
                      )}
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
                  loggedinDetails={this.state.loggedinDetails}
                />
              ) : null}
            </View>
          ) : (
            <Text>No calls</Text>
          )}
        </View>

        <FlashMessage position="top" />
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
    backgroundColor: '#6699cc',
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
