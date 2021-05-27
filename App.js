import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';

export default class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermissions: null,
      scanned: false,
      scannedData: '',
      buttonState: 'normal',
    };
  }

  getCameraPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    console.log(status);

    this.setState({
      hasCameraPermissions: status === 'granted',
      buttonState: 'Clicked',
      scanned: false,
    });
  };

  handleBarcodeScanned = async ({ type, data }) => {
    const { buttonState } = this.state;

    this.setState({
      scanned: true,
      buttonState: 'normal',
      scannedData: data,
    });
    console.log(this.state.scanned);
  };

  OpenApp = async (url) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Unable to open the following link: ` + url);
    }
  };

  render() {
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;

    if (buttonState !== 'normal' && hasCameraPermissions === true) {
      return (
        <BarCodeScanner
          onBarCodeScanned={
            scanned === true ? undefined : this.handleBarcodeScanned
          }
          style={StyleSheet.absoluteFillObject}
        />
      );
    } else if (buttonState === 'normal') {
      return (
        <View style={styles.mainStyle}>
          <View>
            <Image
              style={styles.logo}
              source={require('./assets/QRScanner.png')}
            />
            <Text style={{ textAlign: 'center', fontSize: 30, color: 'white',  }}>
              Barcode And QR Code Scanner
            </Text>
          </View>

          <View style={styles.inputView}>
            <TouchableOpacity
              style={styles.ButtonStyle}
              onPress={() => {
                this.getCameraPermissions();
              }}>
              <Text style={styles.ButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>
          <Text style={{color: 'white'}}>{this.state.scannedData}</Text>
          <Text> </Text>
          <TouchableOpacity
            style={styles.ButtonStyle}
            onPress={() => {
              if (this.state.scannedData !== '') {
                this.OpenApp(this.state.scannedData);
              } else {
                alert('Unable to Scan');
              }
            }}>
            <Text style={styles.ButtonText}>Open Link</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  mainStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  ButtonStyle: {
    backgroundColor: 'blue',
    padding: 10,
  },
  ButtonText: {
    fontSize: 15,
    textAlign: 'center',
  },

  inputView: {
    flexDirection: 'row',
    margin: 20,
  },

  logo: {
    height: 128,
    width: 128,
    marginLeft: '35%',
    marginTop: '-20%',
    margin: 20,
  },
});
