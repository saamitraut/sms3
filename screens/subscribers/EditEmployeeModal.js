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
      Area: '',
      CustomerId: '',
      MobileNo: '',
      Operator: '',
      SocietyName: ';',
      SubscriberName: '',
      subscriberid: '',
      loading: false,
      errorMessage: '',
      showclear: false,
      FormNo: '',
      pincode: '',
    };
  }

  componentDidMount() {
    //
    const {
      Area,
      CustomerId,
      MobileNo,
      Operator,
      SocietyName,
      SubscriberName,
      subscriberid,
      FormNo,
      pincode,
    } = this.props.selectedEmployee;

    this.setState({
      Area: Area,
      CustomerId: CustomerId,
      MobileNo: MobileNo,
      Operator: Operator,
      SocietyName: SocietyName,
      SubscriberName: SubscriberName,
      subscriberid: subscriberid,
      loading: false,
      errorMessage: '',
      FormNo: FormNo,
      pincode: pincode,
    });
  }

  handleChange = (value, state) => {
    this.setState({[state]: value});
  };

  updateEmployee = () => {
    // console.log('state in updateEmployee');// console.log(this.state);// return;// alert(JSON.stringify(this.state));

    const {
      Area,
      CustomerId,
      MobileNo,
      Operator,
      SocietyName,
      SubscriberName,
      subscriberid,
    } = this.state;
    this.setState({errorMessage: '', loading: true});

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
      Area,
      CustomerId,
      MobileNo,
      Operator,
      SocietyName,
      SubscriberName,
      subscriberid,
      FormNo,
      pincode,
      loading,
      errorMessage,
    } = this.state;
    // console.log(this.state);
    return (
      <Modal
        propagateSwipe={true}
        visible={isOpen}
        onRequestClose={closeModal}
        animationType="slide">
        <ScrollView>
          <View style={[styles.container]}>
            <Text style={styles.title}>Update Subscriber Details</Text>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{flex: 1, padding: 10}}>
                <Text style={styles.title2}>MobileNo:</Text>
                <TextInput
                  editable={true}
                  defaultValue={MobileNo}
                  style={styles.textBox}
                  placeholder="MobileNo"
                />
              </View>
              <View style={{flex: 1, padding: 10}}>
                <Text style={styles.title2}>CustomerId:</Text>
                <TextInput
                  editable={false}
                  defaultValue={CustomerId}
                  style={styles.textBox}
                  placeholder="CustomerId"
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{flex: 1, padding: 10}}>
                <Text style={styles.title2}>subscriberid:</Text>
                <TextInput
                  editable={false}
                  defaultValue={subscriberid}
                  style={styles.textBox}
                  placeholder="subscriberid"
                />
              </View>
              <View style={{flex: 1, padding: 10}}>
                <Text style={styles.title2}>FormNo:</Text>
                <TextInput
                  editable={false}
                  defaultValue={FormNo}
                  style={styles.textBox}
                  placeholder="FormNo"
                />
              </View>
            </View>
            <Text style={styles.title2}>Area:</Text>
            <TextInput
              multiline={true}
              numberOfLines={2}
              editable={true}
              defaultValue={Area}
              style={styles.textBox}
              placeholder="Area"
            />
            <Text style={styles.title2}>SocietyName:</Text>
            <TextInput
              defaultValue={SocietyName}
              style={styles.textBox}
              onChangeText={text => this.handleChange(text, 'SocietyName')}
              placeholder="SocietyName"
            />
            <Text style={styles.title2}>Pin Code:</Text>
            <TextInput
              defaultValue={pincode}
              style={styles.textBox}
              onChangeText={text => this.handleChange(text, 'pincode')}
              placeholder="pincode"
            />
            <Text style={styles.title2}>Subscriber:</Text>
            <TextInput
              defaultValue={Operator}
              style={styles.textBox}
              onChangeText={text => this.handleChange(text, 'Operator')}
              placeholder="Operator"
            />

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {/* <View style={{flex: 1, padding: 10}}>
                <Text style={styles.title2}>Final Status:</Text>
                <Picker
                  selectedValue={Replyid}
                  onValueChange={text => this.handleChange(text, 'Replyid')}>
                  <Picker.Item label="Select Final Status " value="" />
                  <Picker.Item label="Ok Accomplished" value="0" />
                  <Picker.Item label="Failed Not Accomplished" value="2" />
                  <Picker.Item label="Declined Inadmissible" value="3" />
                </Picker>
              </View> */}
            </View>
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
