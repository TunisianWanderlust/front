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
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
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
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
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
    justifyContent: 'center',
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
    position: 'absolute',  // This will position the buttons absolutely
    bottom: 20,            // Position them 20 units from the bottom
    left: 0,               // Align to the left side
    right: 0,              // Align to the right side
    alignItems: 'center',  // Center align the buttons
  },
  gradientButton: {
    borderRadius: 200,
    padding: 15,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  button: {
    marginVertical: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textAlign: 'center',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});

export default Home;
