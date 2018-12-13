import React from 'react';
import { View, Text, TextInput, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Auth, I18n, Logger } from 'aws-amplify';
import { FormField, PhoneField, LinkCell, Header, ErrorRow, AmplifyButton } from '../AmplifyUI';
import AuthPiece from './AuthPiece';

const logger = new Logger('SignUp');
export default class SignUp extends AuthPiece {
    constructor(props) {
        super(props);

        this._validAuthStates = ['signUp'];
        this.state = {
            username: null,
            password: null,
            email: null,
            phone_number: null,
            name: null
        };

        this.signUp = this.signUp.bind(this);
    }

    signUp() {
        const { password, email, phone_number, name } = this.state;
        const username = email;
        logger.debug('Sign Up for ' + username);
        Auth.signUp({
          username, 
          password,
          attributes: {
            email, 
            phone_number,
            name
          } 
        }).then(data => {
            logger.debug(data);
            this.changeState('confirmSignUp', username);
        }).catch(err => this.error(err));
    }

    showComponent(theme) {
        return React.createElement(
            TouchableWithoutFeedback,
            { onPress: Keyboard.dismiss, accessible: false },
            React.createElement(
                View,
                { style: theme.section },
                React.createElement(
                    Header,
                    { theme: theme },
                    I18n.get('Create a new account')
                ),
                React.createElement(
                    View,
                    { style: theme.sectionBody },
                    React.createElement(FormField, {
                      theme: theme,
                      onChangeText: text => this.setState({ email: text }),
                      label: I18n.get('Email'),
                      placeholder: I18n.get('Enter your email'),
                      keyboardType: 'email-address',
                      required: true
                    }),
                    React.createElement(FormField, {
                        theme: theme,
                        onChangeText: text => this.setState({ password: text }),
                        label: I18n.get('Password'),
                        placeholder: I18n.get('Enter your password'),
                        secureTextEntry: true,
                        required: true
                    }),
                    React.createElement(FormField, {
                      theme: theme,
                      onChangeText: text => this.setState({ name: text }),
                      label: I18n.get('Name'),
                      placeholder: I18n.get('Enter your name'),
                      keyboardType: 'email-address',
                      required: true
                    }),
                    React.createElement(PhoneField, {
                        theme: theme,
                        onChangeText: text => this.setState({ phone_number: text }),
                        label: I18n.get('Phone Number'),
                        placeholder: I18n.get('Enter your phone number'),
                        keyboardType: 'phone-pad',
                        required: true
                    }),
                    React.createElement(AmplifyButton, {
                        text: I18n.get('Sign Up').toUpperCase(),
                        theme: theme,
                        onPress: this.signUp,
                        disabled: !this.state.email || !this.state.password
                    })
                ),
                React.createElement(
                    View,
                    { style: theme.sectionFooter },
                    React.createElement(
                        LinkCell,
                        { theme: theme, onPress: () => this.changeState('confirmSignUp') },
                        I18n.get('Confirm a Code')
                    ),
                    React.createElement(
                        LinkCell,
                        { theme: theme, onPress: () => this.changeState('signIn') },
                        I18n.get('Sign In')
                    )
                ),
                React.createElement(
                    ErrorRow,
                    { theme: theme },
                    this.state.error
                )
            )
        );
    }
}