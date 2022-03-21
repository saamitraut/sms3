import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import DeviceInfo from 'react-native-device-info';

// import {useDispatch} from 'react-redux';
// import * as authAction from '../redux/actions/authAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
const formSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
});
//

const LoginScreen = navData => {
  //
  // console.log(navData);
  // const dispatch = useDispatch();

  const loadProfile = async () => {
    const token = await AsyncStorage.getItem('token');
    // alert(token);

    if (token != null) {
      // alert(token);
      navData.navigation.navigate('Home');
    }
  };
  //

  useEffect(() => {
    loadProfile();
  });
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <Formik
        initialValues={{
          email: 'raju@gmail.com',
          password: 'password',
        }}
        validationSchema={formSchema}
        //
        onSubmit={values => {
          // console.log('submitted values on line 59');
          // console.log(values);
          // return;
          let loginAPIURL = 'http://103.219.0.103/api/check.php';

          let deviceId = DeviceInfo.getUniqueId();

          var data = new FormData();
          data.append('password', values.password);
          data.append('email', values.email);
          data.append('deviceId', deviceId);

          fetch(loginAPIURL, {
            method: 'POST',
            body: data,
          })
            .then(response => response.json())
            .then(async result => {
              console.log(
                'result received after hitting login api in LoginScreen on line 77',
              );
              console.log(result);
              // return;
              if (result.success) {
                try {
                  await AsyncStorage.setItem(
                    'token',
                    JSON.stringify(result.loggedinDetails),
                  );
                  navData.navigation.navigate('Home', {
                    loggedinDetails: JSON.stringify(result.loggedinDetails),
                  });
                } catch (err) {
                  console.log(err);
                }
              } else {
                Alert.alert(result.message);
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
        }}>
        {props => (
          <View style={styles.container}>
            <View style={styles.logo}>
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.image}
              />
            </View>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Email.."
                placeholderTextColor="#fff"
                keyboardType="email-address"
                onChangeText={props.handleChange('email')}
                value={props.values.email}
                onBlur={props.handleBlur('email')}
                autoCapitalize="none"
              />
              <Text style={styles.error}>
                {props.touched.email && props.errors.email}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#fff"
                secureTextEntry={true}
                onChangeText={props.handleChange('password')}
                value={props.values.password}
                onBlur={props.handleBlur('password')}
              />
              <Text style={styles.error}>
                {props.touched.password && props.errors.password}
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={props.handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have account?</Text>
                <TouchableOpacity
                  onPress={() => navData.navigation.navigate('Register')}>
                  <Text style={styles.registerButton}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: 100,
    height: 100,
  },
  input: {
    width: 300,
    backgroundColor: '#B6BFC4',
    borderRadius: 25,
    padding: 16,
    fontSize: 16,
    marginVertical: 10,
  },
  button: {
    width: 300,
    backgroundColor: '#738289',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
  registerContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 16,
    flexDirection: 'row',
  },
  registerText: {
    color: '#738289',
    fontSize: 16,
  },
  registerButton: {
    color: '#738289',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
  },
});
////
//

export default LoginScreen;
