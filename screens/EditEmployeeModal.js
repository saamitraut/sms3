import React, {Component} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
  Replyid,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

class EditEmployeeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CallLogId: '',
      CalltypeId: 0,
      CustomerId: '',
      Description: '',
      Engineer: '',
      SubCallType: '',
      SubscriberName: '',
      complaintid: '',
      status: 0,
      subscriberid: '',
      loading: false,
      errorMessage: '',
      address: '',
      MobileNo: 0,
    };
  }
  //

  componentDidMount() {
    // state value is updated by selected employee data    // console.log(this.props);
    const {
      CallLogId,
      CalltypeId,
      CustomerId,
      Description,
      Engineer,
      SubCallType,
      SubscriberName,
      complaintid,
      status,
      subscriberid,
      address,
      MobileNo,
    } = this.props.selectedEmployee;

    this.setState({
      CallLogId: CallLogId,
      CalltypeId: CalltypeId,
      CustomerId: CustomerId,
      Description: Description,
      Engineer: Engineer,
      SubCallType: SubCallType,
      SubscriberName: SubscriberName,
      complaintid: complaintid,
      status: status,
      subscriberid: subscriberid,
      loading: false,
      errorMessage: '',
      address: address,
      Replyid: 0,
      Reply: '',
      CreatedBy: 1,
      //
      MobileNo: MobileNo,
      OTP1: '',
      OTP: '',
    });
  }
  handleChange = (value, state) => {
    this.setState({[state]: value});
  };

  makeid(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  sendConfirmationOTP = () => {
    this.setState({errorMessage: '', loading: true});
    var data = new FormData();
    const OTP1 = this.makeid(5);
    this.setState({OTP1: OTP1});

    data.append('MobileNo', this.state.MobileNo);
    data.append('CallLogId', OTP1);
    data.append('SubscriberName', this.state.SubscriberName);
    // console.log(data);
    const InsertAPIURL = 'http://103.219.0.103/sla/call_verification.php';
    fetch(InsertAPIURL, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if ((res.Status = 'success')) {
          alert(res.Message);
        }
        this.setState({
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

  updateEmployee = () => {
    // console.log('state in updateEmployee');// console.log(this.state);// return;// alert(JSON.stringify(this.state));

    const {complaintid, Reply, status, CreatedBy, Replyid, OTP, OTP1} =
      this.state;
    this.setState({errorMessage: '', loading: true});

    console.log('OTP IS ' + OTP);
    console.log('OTP1 IS ' + OTP1);
    if (OTP != OTP1) {
      alert('sorry confirmation otp does not match');
      return;
    }

    if (complaintid && Reply != '' && CreatedBy && Replyid != '') {
      // selected employee is updated with employee id
      //

      var data = new FormData();
      data.append('complaintid', complaintid);
      data.append('Reply', Reply);
      data.append('status', status);
      data.append('CreatedBy', CreatedBy);
      data.append('Replyid', Replyid);
      // alert(JSON.stringify(data));
      const updateAPIURL = 'http://103.219.0.103/sla/updateCallDetails.php';

      fetch(updateAPIURL, {
        method: 'POST',
        body: data,
      })
        .then(res => res.json())
        .then(res => {
          console.log(res);
          if (res.status) {
            this.props.closeModal();
            this.props.updateEmployee(res.data);
            // alert(res.msg);
          } else {
            alert(res.msg);
          }
        })
        .catch(() =>
          this.setState({
            loading: false,
            errorMessage: 'Network Error. Please try again.',
          }),
        );
    } else {
      this.setState({errorMessage: 'Fields are empty.', loading: false});
    }
  };

  render() {
    const {isOpen, closeModal} = this.props;
    const {
      CallLogId,
      CalltypeId,
      CustomerId,
      Description,
      Engineer,
      SubCallType,
      SubscriberName,
      complaintid,
      status,
      subscriberid,
      loading,
      errorMessage,
      address,
      Replyid,
      Reply,
      MobileNo,
    } = this.state;

    return (
      <Modal
        propagateSwipe={true}
        visible={isOpen}
        onRequestClose={closeModal}
        animationType="slide">
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.title}>Update Call</Text>
            <View style={styles.row}>
              <View>
                <Text style={styles.title2}>Call Id:</Text>
                <Text style={styles.title3}>{CallLogId}</Text>
              </View>
              {/* <TextInput
              value={CallLogId}
              style={styles.textBox}
              onChangeText={text => this.handleChange(text, 'CallLogId')}
              placeholder="CallLogId"
            /> */}
              <View>
                <Text style={styles.title2}>CallType:</Text>
                <Text style={styles.title3}>
                  {CalltypeId == 2 ? 'Complaint' : ''}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View>
                <Text style={styles.title2}>CustomerId:</Text>
                <Text style={styles.title3}>{CustomerId}</Text>
              </View>
              <View>
                <Text style={styles.title2}>Engineer:</Text>
                <Text style={styles.title3}>{Engineer}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.title2}>Description:</Text>
              <Text style={styles.title3}>{Description}</Text>
            </View>

            <View style={styles.row}>
              <View>
                <Text style={styles.title2}>SubCallType:</Text>
                <Text style={styles.title3}>{SubCallType}</Text>
              </View>

              <View>
                <Text style={styles.title2}>SubscriberName:</Text>
                <Text style={styles.title3}>{SubscriberName}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View>
                <Text style={styles.title2}>ComplaintId</Text>
                <Text style={styles.title3}>{complaintid}</Text>
              </View>
              <View>
                <Text style={styles.title2}>SubscriberId:</Text>
                <Text style={styles.title3}>{subscriberid}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.title2}>MobileNo:</Text>
              <Text style={styles.title3}>{MobileNo}</Text>
            </View>
            <Text style={styles.title2}>Address:</Text>
            <Text style={styles.title3}>{address}</Text>

            <Text style={styles.title2}>Reply:</Text>
            <TextInput
              defaultValue={Reply}
              style={styles.textBox}
              onChangeText={text => this.handleChange(text, 'Reply')}
              placeholder="Reply"
            />
            <Text style={styles.title2}>CONFIRMATION OTP:</Text>

            <TextInput
              defaultValue={''}
              style={styles.textBox}
              onChangeText={text => this.handleChange(text, 'OTP')}
              placeholder="OTP"
            />
            <Text style={styles.title2}>Final Status:</Text>
            <Picker
              selectedValue={Replyid}
              onValueChange={text => this.handleChange(text, 'Replyid')}>
              <Picker.Item label="Select Final Status " value="" />
              <Picker.Item label="Ok Accomplished" value="0" />
              <Picker.Item label="Failed Not Accomplished" value="2" />
              <Picker.Item label="Declined Inadmissible" value="3" />
            </Picker>

            <Text style={styles.title2}>Status</Text>
            {status ? (
              <TouchableOpacity
                style={{
                  ...styles.button,
                  marginVertical: 0,
                  backgroundColor: '#034f84',
                }}
                //
                onPress={() => this.setState({status: 0})}>
                <Text style={styles.buttonText}>OPEN</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  ...styles.button,
                  marginVertical: 0,
                  backgroundColor: '#d64161',
                }}
                onPress={() => this.setState({status: 1})}>
                <Text style={styles.buttonText}>CLOSED</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={this.sendConfirmationOTP}
              style={styles.button}>
              <Text style={styles.buttonText}>CONFIRMATION OTP</Text>
            </TouchableOpacity>

            {loading ? (
              <Text style={styles.message}>Please Wait...</Text>
            ) : errorMessage ? (
              <Text style={styles.message}>{errorMessage}</Text>
            ) : null}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={this.updateEmployee}
                // onPress={() => alert('hello')}
                style={{...styles.button, marginVertical: 0}}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={closeModal}
                style={{
                  ...styles.button,
                  marginVertical: 0,
                  marginLeft: 10,
                  backgroundColor: 'tomato',
                }}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    );
  }
}
export default EditEmployeeModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  textBox: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'rgba(0,0,0,0.3)',
    marginBottom: 15,
    fontSize: 18,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
  message: {
    color: 'tomato',
    fontSize: 17,
  },
  title2: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 15,
    color: '#37859b',
  },
  title3: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 5,
    color: '#eca1a6',
  },
});
