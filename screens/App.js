import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AddEmployeeModal from './AddEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
import DeleteEmployeeModal from './deleteEmployeeModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

class App extends Component {
  constructor(props) {
    super(props);

    console.log(props);
    this.state = {
      calls: [],
      isAddEmployeeModalOpen: false,
      isEditEmployeeModalOpen: false,
      isDeleteEmployeeModalOpen: false,
      loading: false,
      errorMessage: '',
      selectedEmployee: {},
      engineerid: 0,
    };
  }
  componentDidMount() {
    this.getEngineerId();
    // this.props.navigation.navigate('About');
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
    // alert(this.state.engineerid);
    var data = new FormData();
    data.append('EngineerId', engineerid);
    data.append('status', 0);

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

          <TouchableOpacity onPress={this.logout} style={styles.button}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Call Lists:</Text>
          {this.state.calls.map((call, index) => (
            <View style={styles.employeeListContainer} key={call.CallLogId}>
              <Text style={{...styles.listItem, color: 'tomato'}}>
                {index + 1}.
              </Text>
              <Text style={styles.name}>{call.SubscriberName}</Text>
              <Text style={styles.listItem}>CallLogId: {call.CallLogId}</Text>
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
      </ScrollView>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
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
    fontSize: 17,
  },
});
