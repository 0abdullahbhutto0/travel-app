import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigation = useNavigation<any>();

  const validateInputs = () => {
    let isValid = true;
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (firstName.trim().length < 2) {
      setFirstNameError('First name is required');
      isValid = false;
    }
    if (lastName.trim().length < 2) {
      setLastNameError('Last name is required');
      isValid = false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      // Update profile with the display name
      await userCredential.user.updateProfile({
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });
    } catch (error: any) {
      Alert.alert('Signup Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>Aether</Text>
        <Text style={styles.subTitle}>Begin your mindful journey.</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={[styles.input, firstNameError ? styles.inputError : null]}
            placeholder="John"
            placeholderTextColor="#999"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              if (firstNameError) setFirstNameError('');
            }}
          />
          {!!firstNameError && <Text style={styles.errorText}>{firstNameError}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput
            style={[styles.input, lastNameError ? styles.inputError : null]}
            placeholder="Doe"
            placeholderTextColor="#999"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              if (lastNameError) setLastNameError('');
            }}
          />
          {!!lastNameError && <Text style={styles.errorText}>{lastNameError}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="hello@mindful.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={[styles.passwordInputWrapper, passwordError ? styles.inputError : null]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor="#999"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity 
              style={styles.visibilityToggle}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Text style={styles.visibilityToggleText}>
                {isPasswordVisible ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
          {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={[styles.passwordInputWrapper, confirmPasswordError ? styles.inputError : null]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmPasswordError) setConfirmPasswordError('');
                if (passwordError) setPasswordError('');
              }}
              secureTextEntry={!isConfirmPasswordVisible}
            />
            <TouchableOpacity 
              style={styles.visibilityToggle}
              onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
            >
              <Text style={styles.visibilityToggleText}>
                {isConfirmPasswordVisible ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
          {!!confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up {'\u2192'}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fbf9f4',
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '700',
    color: '#4e635a',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: '#516169',
  },
  container: {
    backgroundColor: 'rgba(251, 249, 244, 0.95)',
    padding: 32,
    borderRadius: 24,
    shadowColor: '#333f48',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 32,
    textAlign: 'center',
    color: '#1b1c19',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#516169',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#f9f8f6',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 0,
    fontSize: 16,
    color: '#1b1c19',
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f8f6',
    borderRadius: 12,
    borderWidth: 0,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1b1c19',
  },
  visibilityToggle: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  visibilityToggleText: {
    color: '#a0aab2',
    fontSize: 14,
    fontWeight: '600',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#ba1a1a',
  },
  errorText: {
    color: '#ba1a1a',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    marginLeft: 6,
  },
  button: {
    backgroundColor: '#4e635a',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e4e2dd',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#a0aab2',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#f0eee9',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#516169',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignupScreen;
