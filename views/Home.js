import React from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

const Home = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/sidibou.jpg')}
      style={styles.background}
    >
      <BlurView
        style={styles.absolute}
        blurType="light"
        blurAmount={1}
        reducedTransparencyFallbackColor="white"
      >
        <LinearGradient
          colors={['rgba(55, 169, 180, 0.5)', 'rgba(255, 255, 255, 0.5)']}
          style={styles.gradient}
        >
          <View style={styles.container}>
            <Text style={styles.title}></Text>
            <View style={{ flex: 1 }} />
          </View>
        </LinearGradient>
      </BlurView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Signup')}
        >
          <LinearGradient
            colors={['#37A9B4', '#5CC7D2', '#89A6ED', '#507BE4']}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>S'inscrire</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Signin')} 
        >
          <LinearGradient
            colors={['#37A9B4', '#5CC7D2', '#89A6ED', '#507BE4']}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Se connecter</Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center', 
    justifyContent: 'space-between', 
    height: 115, 
  },
  gradientButton: {
    borderRadius: 200,
    padding: 15,
    width: 320,
  },
  button: {
    borderRadius: 77,
    overflow: 'hidden',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center', 
  },
});

export default Home;
