import React, { useState, createContext, useContext } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { IDValidator } from '../helpers/IDValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { getDatabase, ref, onValue, once, get } from 'firebase/database';
import '../../firebase';
