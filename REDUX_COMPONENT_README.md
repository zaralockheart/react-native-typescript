

```
import * as _ from 'lodash'
import * as React from 'react'
import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'

export class ReduxTextField extends React.Component<
  any & {
    onSubmitEditing: () => any | void
  }
> {
  state = {
    isPasswordVisible: !this.props.isPasswordEntry,
    selection: { start: 0, end: 0 },
    viewPasswordTriggered: false,
    valueChanged: false
  }

  componentDidMount() {
    if (this.props.defaultValue) {
      this.props.input.onChange(this.props.defaultValue)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (_.get(nextProps, 'input.value', false)) {
      if (!this.state.valueChanged) {
        this.setState({
          valueChanged: true
        })
      }
    }
  }

  onPressPasswordVisibility = () => {
    return this.setState(prevState => {
      return {
        isPasswordVisible: !this.state.isPasswordVisible,
        viewPasswordTriggered: true,
        selection: (prevState as any).selection
      }
    })
  }

  onSelectionChange = event => {
    const selection = event.nativeEvent.selection
    if (this.state.viewPasswordTriggered) {
      this.setState({
        viewPasswordTriggered: false
      })
      return
    }
    this.setState({
      selection: {
        start:
          this.props.input.value.length < selection.start
            ? this.props.input.value.length
            : selection.start,
        end:
          this.props.input.value.length < selection.end
            ? this.props.input.value.length
            : selection.end
      }
    })
  }

  render() {
    const props = this.props
    const {
      header,
      blurOnSubmit,
      refCallback,
      index,
      headerStyle,
      input,
      testID,
      style,
      label,
      onSubmitEditing,
      showErrorComponent = true,
      placeholder,
      isPasswordEntry,
      autoFocus = false,
      showErrorWithoutTouching = false,
      onChangeText,
      hideError,
      accessibilityLabel,
      underlineColor,
      eyeColor,
      hideVisibilityToggle = false,
      focus,
      maxLength,
      onFocus,
      keyboardType,
      returnKeyType,
      disabled = false,
      viewStyle,
      flexContainerStyle,
      errorStyle,
      meta: { touched, error },
      errorToBlock,
      ...otherProps
    } = props
    const value = input.value
    let hideErrorField = false
    if (error === errorToBlock) {
      hideErrorField = true
    }
    return (
      <View style={flexContainerStyle}>
        {header ? (
          <Text
            style={[commonStyle.textDarkGrey, { padding: 16 }, headerStyle]}
          >
            {header}
          </Text>
        ) : null}
        <View
          style={[
            {
              flexDirection: 'row',
              backgroundColor: COLOR_GREY_TEXT_INPUT,
              borderBottomColor: underlineColor || COLOR_WHITE,
              borderBottomWidth: 2
            },
            viewStyle
          ]}
        >
          <TextInput
            testIDAndAccessibilityLabel={testID || accessibilityLabel}
            autoCapitalize={'none'}
            {...input}
            {...otherProps}
            keyboardType={keyboardType}
            ref={componentRef => {
              if (refCallback) {
                refCallback(index, componentRef)
              }
            }}
            value={value}
            autoFocus={autoFocus}
            autoComplete={false}
            autoCorrect={false}
            spellCheck={false}
            onBlur={val => input.onBlur(val)}
            focus={focus}
            onFocus={onFocus}
            secureTextEntry={!this.state.isPasswordVisible}
            style={[
              { ...ClanProNews },
              {
                color: COLOR_DARK_GREY,
                width: '100%',
                paddingLeft: 24,
                paddingBottom: Platform.OS === 'ios' ? 17 : 10
              },
              style,
              iosReduxTextFieldStyle
            ]}
            // onSelectionChange={
            //   Platform.OS === 'ios' ? null : this.onSelectionChange
            // }
            // selection={Platform.OS === 'ios' ? null : this.state.selection}
            label={label}
            editable={!disabled}
            placeholder={placeholder}
            blurOnSubmit={blurOnSubmit}
            accessibilityLabel={testID || accessibilityLabel}
            underlineColorAndroid={'transparent'}
            maxLength={maxLength}
            returnKeyType={returnKeyType}
            onChangeText={onChangeText || input.onChange}
            // onSubmitEditing={() => {
            //   if (onSubmitEditing) {
            //     onSubmitEditing(index)
            //   }
            // }}
            onSubmitEditing={params => {
              if (onSubmitEditing) {
                if (index) {
                  onSubmitEditing(index)
                } else {
                  onSubmitEditing(params)
                }
              }
            }}
            clearButtonMode="never"
          />
          {isPasswordEntry && !hideVisibilityToggle ? (
            <TouchableOpacity
              onPress={this.onPressPasswordVisibility}
              style={{
                paddingVertical: 14,
                paddingRight: 14
              }}
            >
              <EyeIcon
                color={eyeColor}
                eyeState={this.state.isPasswordVisible}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        {showErrorComponent ? (
          (showErrorWithoutTouching ||
            touched ||
            value ||
            this.state.valueChanged) &&
          error &&
          !hideError &&
          !hideErrorField ? (
            <RedErrorMessage style={errorStyle}>{error}</RedErrorMessage>
          ) : (
            <RedErrorMessage style={errorStyle}>{''}</RedErrorMessage>
          )
        ) : null}
      </View>
    )
  }
}
```

```
import * as React from 'react'
import { PinCodeEntry } from '../PinCodeEntry'
import { WrappedFieldProps } from 'redux-form'
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewProperties,
  ViewStyle
} from 'react-native'
import { HeaderText } from '../../Settings/components/HeaderText'
import { commonStyle } from '../../resource/styles'
import { getCSSMarginViaShorthand } from '../../util/helpers'

export class PinCodeEntryWithHeader extends React.Component<
  WrappedFieldProps & {
    pinStatus: number
    containerStyle: StyleProp<ViewStyle>
    headerText: string
  }
> {
  render() {
    const { containerStyle, headerText, ...pinCodeEntryProps } = this.props
    const { meta: { touched, dirty, error, warning } } = this.props
    const { disableErrorMessage } = this.props as any
    return (
      <View style={[styles.container, containerStyle]}>
        <HeaderText style={getCSSMarginViaShorthand('0, 0, 11')}>
          {headerText}
        </HeaderText>
        <PinCodeEntry {...pinCodeEntryProps as any} />
        {dirty && error && !disableErrorMessage ? (
          // changed from touched to dirty; touched seems to be always false
          // reference: https://github.com/erikras/redux-form/issues/2524
          <Text style={[commonStyle.formErrorRed, styles.errorText]}>
            {error}
          </Text>
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 26
  },
  errorText: {
    paddingHorizontal: 0
  }
})

```

**How to use?**
1. Declare a form name
    ```$xslt
    const MOBILE_NUMBER_FORM_DATA = 'MOBILE_NUMBER_FORM_DATA
    ```
2. Make sure your component use this `Prop`
    ```
    type Props = InjectedFormProps<MobileNumberFormData> &
      typeof mapDispatchToPropsT &
      MapStateToPropsT &
      ExternalProps
    ```
3.  Use Field
    ```
    import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
    
    <Field
          autoFocus
          hideError
          name={'give your name here'}
          normalize={emailNormalizer}
          maxLength={MAX_LENGTH_EMAIL}
          component={ReduxTextField}
          style={[styles.textEmail]}
          placeholder={TEXT_EMAIL}
        />
    ```

4. Export your class with:
    ```
    export const ValidateMobileNumber = connect(
      mapStateToProps,
      mapDispatchToPropsT
    )(reduxForm({
      form: 'MOBILE_NUMBER_FORM_DATA',
      validate
    })(ValidateMobileNumberBase as any) as React.ComponentClass<any>) as React.ComponentClass<
      any
    >
    ```

5. For validate, eg use Joi, but you can use anything you want:
    ```
    const validate = (data: MobileNumberFormData) => {
      const schema: Partial<{ [x in keyof MobileNumberFormData]: any }> = {
        mobileNumber: Joi.string()
          .regex(/[0-9]+/, 'NUMBERS')
          .min(8)
          .max(11)
          .required()
      }
    
      const errors = validateUsingJoi(data, schema, {
        replaceErrors: true
      })
      return errors
    }
    ```