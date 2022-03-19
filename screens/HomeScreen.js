import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Button, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = props => {
  // console.log('props received on HomeScreen on line 7');
  // console.log(props);

  // let loggedinDetails = props.route.params.loggedinDetails;

  // return (
  //   <View>
  //     <Text>HomeScreen</Text>
  //     <Text>{loggedinDetails}</Text>
  //   </View>
  // );

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [engineerId, setengineerId] = useState('');
  const [engineers, setengineers] = useState([]);

  const loadProfile = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      props.navigation.navigate('Login');
    }

    const decoded = JSON.parse(token);
    setFullName(decoded.fullName);
    setEmail(decoded.email);
    setengineerId(decoded.engineerId);
    console.log('HomeScreen 32');
    console.log(token);
    console.log('HomeScreen 34');
    console.log(decoded);
    console.log('HomeScreen 36');
    console.log(fullName);
    console.log(email);
    console.log(engineerId);
    // callAPI(decoded.engineerId);
  };
  //

  const logout = props => {
    AsyncStorage.removeItem('token')
      .then(() => {
        props.navigation.replace('Login');
      })
      .catch(err => console.log(err));
  };
  //

  const callAPI = ENGINEER => {
    var data = new FormData();
    data.append('EngineerId', ENGINEER);
    const InsertAPIURL = 'http://103.219.0.103/sla/getEngineerDetails.php';

    fetch(InsertAPIURL, {
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(result => {
        setengineers(result.data);
        // console.log(result.data);
      });
  };
  useEffect(() => {
    loadProfile();
    // callAPI();
  });
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>Welcome {fullName ? fullName : ''}</Text>
      </View>
      <View>
        <Text style={styles.text}>Your Email: {email ? email : ''}</Text>
      </View>
      <View>
        <Button title="Logout" onPress={() => logout(props)} />
      </View>
      <View>
        <Text>{engineerId}</Text>
      </View>
      <View style={styles.container}>
        <FlatList
          //
          data={engineers}
          renderItem={({item}) => (
            <View>
              <Text style={styles.input}>
                {item.SubscriberName}
                {/* {item.address} */}
                {/* {item.Description} */}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};
//
//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    paddingTop: 23,
  },
  text: {
    fontSize: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    //
    height: 45,
  },
  input: {
    width: 300,
    backgroundColor: '#B6BFC4',
    // borderRadius: 25,
    padding: 16,
    fontSize: 16,
    marginVertical: 10,
  },
  item2: {fontSize: 15, margin: 0, backgroundColor: 'skyblue'},
});
//

export default HomeScreen;
