import React, { Component } from 'react';
import {
  Alert,
  Animated,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Switch
} from 'react-native';

import ImageProgress from 'react-native-image-progress';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { SegmentedControls } from 'react-native-radio-buttons';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import Slider from 'react-native-slider';
import ModalDropdown from 'react-native-modal-dropdown';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import RadioButton from '../../../Explore/components/smart/radioButton';
import UploadFromCameraRoll from '../../../Components/imageUploader';
import * as clientProfileActions from '../../actions';

const { width, height } = Dimensions.get('window');
const background = require('../../../Assets/images/background.png');
const avatarDefault = require('../../../Assets/images/avatar.png');
const labelSex = ['Male', 'Female'];
const prices = [
  {item: '$', price: '$50-100', level: 1},
  {item: '$$', price: '$100-300', level: 2},
  {item: '$$$', price: '$300+', level: 3}
];

//const variable
const constants = {
  BASIC_INFO: 'BASIC INFO',
  CALENDAR: 'CALENDAR'
};

class EditProfile extends Component {

  constructor(props) {
    super(props);

    props.auth.user.age = props.auth.user.age || 15;
    props.auth.user.profession = props.explore && props.explore.professions && props.explore.professions[0] || {};
    this.state = {
      user: props.auth.user,
      selectedOption: constants.BASIC_INFO,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { auth: { user }, profile: { error } } = nextProps;

    if (error) {
      Alert.alert(error);
    } else if (this.state.updateRequest) {
      Alert.alert('Update Successful');
    }
    this.setState({updateRequest: false})
  }

  saveProfile() {
    const { updateProfile } = this.props;
    const { user } = this.state;
    this.setState({updateRequest: true}, () => updateProfile(user));
  }

  onBack() {
    Actions.pop();
  }

  onChangeOptions(option) {
    const { selectedOption } = this.state,
      { auth: { user } } = this.props;


    if (selectedOption != option) {
      this.setState({selectedOption: option})
    }
  }

  get getShowNavBar() {
    const { selectedOption } = this.state;

    return (
      <View style={ styles.navBarContainer }>
        <View style={ styles.navigateButtons }>
          <TouchableOpacity
            onPress={ () => this.onBack() }
            style={ styles.navButtonWrapper }
          >
            <EntypoIcons
              name="chevron-thin-left"  size={ 25 }
              color="#fff"
            />
          </TouchableOpacity>

          <Text style={ [styles.fontStyles, styles.textTitle] }>PROFILE EDIT</Text>

          <TouchableOpacity
            onPress={ () => this.saveProfile() }
            style={ styles.navButtonWrapper }
          >
            <EntypoIcons
              name="check"  size={ 25 }
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <SegmentedControls
          tint={ "#fff" }
          selectedTint= { "#41c3fd" }
          backTint= { "#41c3fd" }
          options={ [constants.BASIC_INFO, constants.CALENDAR] }
          onSelection={ (option) => this.onChangeOptions(option) }
          selectedOption={ selectedOption }
          allowFontScaling={ true }
          optionStyle={{
            fontSize: 12,
            height: 20,
            paddingTop:3,
          }}
          containerStyle= {{
            borderRadius:10,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 10,
            marginVertical: 5,
          }}
        />
        </View>);
  }
  addAvatarUri = (uri) => {
    const { user } = this.state;
    this.setState({ user: {...user, avatar: '' }}, () => this.setState({ user: {...user, avatar: uri }}));
  }
  onSelectProfession(value) {
    const { user } = this.state;
    const profession = this.props.explore.professions.filter((e)=>e.name===value)[0];
    this.setState({ user: {...user, profession } });
  }
  render() {
    const { avatar, user, updateRequest } = this.state;
    const { explore: { professions } } = this.props;

    const sliderWidth = width * 1/4;
    const ageInitialValue = 15;
    const numberDivisions = 72;
    const allPaddingsMargings = 85;
    let scale = (width - sliderWidth - allPaddingsMargings) / numberDivisions ;
    const paddingLeft =(user.age - ageInitialValue) * scale;

    return (
      <View style={ styles.container }>
        <Image source={ background } style={ styles.background } resizeMode="cover">
          { this.getShowNavBar }
          <View style={ styles.contentContainer }>
            <View style={ styles.avatarContainer }>
              <View style={ styles.avatarWrapper }>
                { avatar ?
                  <ImageProgress source={ {uri: avatar} } indicator={ActivityIndicator} style={ styles.imageAvatar } resizeMode="cover"/>
                  :
                  <Image source={ avatarDefault } style={ styles.imageAvatar } resizeMode="cover"/>
                }
                <UploadFromCameraRoll directlyUpload={true} addAvatarUri={this.addAvatarUri}/>
              </View>
            </View>

            <View style={ styles.cellContainer }>
              <View style={ styles.viewInputCenter }>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={ false }
                  placeholder="Add your name here"
                  placeholderTextColor="#9e9e9e"
                  style={ [styles.fontStyles, styles.textInputCenter] }
                  value={ user.name }
                  onChangeText={ (name) => this.setState({ user: {...user, name}}) }
                />
              </View>
            </View>

            <View style={ [styles.cellContainer, styles.profileVisibility] }>
              <View style={ styles.profileVisibilityTitle }>
                <Text style={ styles.fontStyles }>Profile visibility</Text>
              </View>
              <View style={ styles.profileVisibilitySwitch }>
                <Switch
                  onValueChange={(visibility) => this.setState({ user: {...user, visibility }})}
                  value={ user.visibility } />
              </View>
            </View>

            <View style={ styles.cellContainer }>
              <Text style={ [styles.fontStyles, styles.textCellTitle] }>Gender</Text>
              <View style={ styles.cellValueContainer }>
                {
                  labelSex.map(value => {
                    return (
                      <RadioButton
                        style={ styles.paddingTwo }
                        key={ value }
                        label={ value }
                        color="#19b8ff"
                        iconStyle={ styles.iconButton }
                        labelStyle={ [styles.fontStyles, styles.textCellValue] }
                        checked={ user.gender === value }
                        onPress={ () => this.setState({ user: {...user, gender: value }}) }
                      />
                    );
                  })
                }
              </View>
            </View>

            <View style={ styles.cellContainer }>
              <Text style={ [styles.fontStyles, styles.textCellTitle] }>Age</Text>
              <View style={ styles.viewSlider }>
                <Animated.View style={ [styles.animateContainer, {paddingLeft: paddingLeft}] }>
                  <Animated.View style={ styles.bubble }>
                    <Animated.Text style={ [styles.textAboveSlider, styles.priceButtonText] }>{ user.age }</Animated.Text>
                  </Animated.View>
                  <Animated.View style={ styles.arrowBorder } />
                  <Animated.View style={ styles.arrow } />
                </Animated.View>
                <Slider style={ styles.slider }
                        maximumTrackTintColor="#9be5ff"
                        minimumTrackTintColor="#10c7f9"
                        trackStyle= {{backgroundColor: 'rgba(173, 230, 254, 0.5);'}}
                        thumbTouchSize={{width: 40, height: 60}}
                        thumbStyle={ styles.thumbStyle }
                        minimumValue={ 15 }
                        maximumValue={ 85 }
                        step={ 1 }
                        value = { user.age }
                        onValueChange={ (value) => this.setState({ user: {...user, age: value }}) }
                />
              </View>
            </View>

            <View style={ [styles.cellContainer, styles.withoutBorder] }>
              <Text style={ [styles.fontStyles, styles.textCellTitle] }>Looking for</Text>
              <View style={ styles.dropdownWrapper }>
                <ModalDropdown
                  options={ professions.map((e)=>e.name) }
                  renderRow={(value)=>(<Text  numberOfLines={1} style={ [styles.fontStyles, styles.dropDownOptions] }>{value}</Text>)}
                  dropdownStyle={ styles.dropdownStyle }
                  onSelect={ (rowId, rowData) => this.onSelectProfession(rowData) }
                >
                  <Text  numberOfLines={1} style={ [styles.fontStyles, styles.dropdown, styles.dropDownText] }>{user.profession.name}</Text>
                  <EvilIcons
                    style={ styles.iconDropDown }
                    name="chevron-down"
                    size={ 24 }
                    color="#10c7f9"
                  />
                </ModalDropdown>
              </View>
            </View>

            <View style={ styles.cellContainer }>
              <Text style={ [styles.fontStyles, styles.textCellTitle] }>Price</Text>
              <View style={ styles.pricesBlock }>
                {
                  prices.map((item, index) =>(
                    <TouchableOpacity key={ index } activeOpacity={ .5 } onPress={ () => this.setState({ user: {...user, priceLevel: item.level }}) }>
                      <View style={ [styles.viewTwoText, item.level === user.priceLevel ? styles.priceButtonChecked : styles.priceButton] }>
                        <Text style={ [styles.fontStyles, styles.textSubTitle, item.level === user.priceLevel ? styles.priceButtonTextChecked : styles.priceButtonText] }>{ item.item }</Text>
                        <Text style={ [styles.fontStyles, styles.textSubValue, item.level === user.priceLevel ? styles.priceButtonTextChecked : styles.priceButtonText] }>{ item.price }</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                }

              </View>
            </View>
            <View style={ styles.seekingProfessional }>

            </View>
            <View style={ styles.addProfession }>

            </View>
            <View style={ styles.aboutMe }>

            </View>
          </View>
        </Image>
        { updateRequest ? <View
          style={styles.activityIndicatorContainer}>
          <ActivityIndicator
            style={styles.activityIndicator}
            color="#0000ff"
            size="large"
          />
        </View> : null }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width,
    height,
  },
  activityIndicator: {
    flex: 1,
    position: 'relative'
  },
  activityIndicatorContainer: {
    flex: 1,
    position: 'absolute',
    backgroundColor: '#a3a4a7',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.5,
    width,
    height
  },
  navBarContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    paddingVertical: 10,
  },
  navigateButtons: {
    alignItems: 'flex-end',
    flexDirection: 'row'
  },
  navButtonWrapper: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  textTitle: {
    flex: 10,
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    paddingBottom: 10,
  },
  contentContainer: {
    flex: 6.4,
    backgroundColor: '#fff',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    borderColor: '#d9d9d9',
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  timeMainContainer: {
    flex: 3,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  scheduleButton: {
    width: width - 100,
    backgroundColor: '#14c2f7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#14c2f7',
    borderStyle: 'solid',
    shadowOffset: {
      width: 3,
      height: 2,
    },
    shadowColor: '#000',
    shadowOpacity: 0.3,
    paddingVertical: 15,
    paddingHorizontal: 40,
    height: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  calendarTime: {
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#d7d7d7',
    borderStyle: 'solid',
  },
  timeRowContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
  },
  textTimeTo: {
    paddingHorizontal: 20,
    textAlign: 'center',
    color: '#565656',
  },
  //avatar
  avatarContainer: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrapper: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageAvatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  //end avatar
  //inputWrap
  inputWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    marginHorizontal: 80,
    marginVertical: 10
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  //end inputWrap
  mHProfileField: {
    marginHorizontal: 10
  },
  profileVisibility: {
    flex: 1,
    flexDirection: 'row'
  },
  profileVisibilityTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  profileVisibilitySwitch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  gender: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#e3e3e3',
  },
  age: {
    flex: 1,
    borderTopWidth: 2,
    borderTopColor: '#e3e3e3',
  },
  seekingProfessional: {
    flex: 1,
    borderTopWidth: 2,
    borderTopColor: '#e3e3e3',
  },
  addProfession: {
    flex: 1,
    borderTopWidth: 2,
    borderTopColor: '#e3e3e3',
  },
  aboutMe: {
    flex: 1,
    borderTopWidth: 2,
    borderTopColor: '#e3e3e3',
  },

  cellContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 11,
  },
  viewInputCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    marginHorizontal: 70,
  },
  textInputCenter: {
    paddingHorizontal:10,
    flex: 1,
    color: '#1e1e1e',
    // fontSize: 18,
    height: 32,
  },
  viewTwoText: {
    flexDirection: 'column',
  },
  textCellTitle: {
    color: '#1e1e1e',
  },

  textCellValue: {
    color: '#707070',
    fontSize: 16,
  },
  cellValueContainer: {
    flexDirection: 'row',
  },
  paddingTwo: {
    marginRight: 10,
    paddingVertical: 0,
  },
  iconButton: {
    fontSize: 25,
    marginRight: 5,
    marginLeft: -5,
  },

  viewSlider:{
    flex: 1,
    flexDirection: 'column',
    marginLeft: width/4,
  },
  slider: {
    marginRight: 15,
    height: 20,
    marginBottom: -8,
  },
  animateContainer: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    marginRight: 6,
    marginLeft: -6,
  },

  bubble: {
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    flex: 0,
    alignSelf: 'flex-start',
    backgroundColor: '#19b8ff',
    borderRadius: 5,
    borderColor: '#19b8ff',
    borderWidth: 1,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 6,
    borderColor: 'transparent',
    borderTopColor: '#19b8ff',
    alignSelf: 'center',
    marginTop: -15,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 6,
    borderColor: 'transparent',
    borderTopColor: '#19b8ff',
    alignSelf: 'center',
    marginTop: -0.5,
  },
  textAboveSlider: {
    textAlign: 'center',
    height: 15,
    width: 20,
    color: '#6b6b6b',
    fontSize: 13,
  },
  thumbStyle:{
    top:11,
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderColor: '#10c7f9',
    borderWidth: 1
  },

  withoutBorder:{
    borderWidth: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
  },
  dropdownWrapper: {
    flexDirection: 'row',
    // height: 25,
    borderWidth: 1,
    borderColor: '#10c7f9',
    borderRadius: 15,
    overflow:'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    width : width * 0.4,
  },
  dropdown: {
    width : width * 0.4,
  },
  dropdownStyle: {
    height: 100,
    width : width * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:  15,
    borderWidth: 1,
    borderColor: '#6ad0fd',
    marginTop: 1,
    overflow: 'hidden',
  },
  dropDownText: {
    color: '#6b6b6b',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
  dropDownOptions: {
    color: '#6b6b6b',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  iconDropDown: {
    position: 'absolute',
    right: 4,
    top: 1
  },

  priceButtonChecked: {
    borderWidth: 1,
    borderColor: '#19b8ff',
    backgroundColor: '#19b8ff',
    alignItems: 'center',
    borderRadius: 30,
    width: 80,
    marginLeft: 10,
    overflow:'hidden',
  },
  priceButton: {
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 30,
    width: 80,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#19b8ff',
    overflow:'hidden',
  },
  priceButtonTextChecked: {
    color: '#fff',
    textAlign: 'center',
  },
  priceButtonText: {
    color: '#6b6b6b',
    textAlign: 'center',
  },
  pricesBlock: {
    flexDirection: 'row',
  },
  textSubTitle: {
    color: '#707070',
    fontSize: 12,
  },

  textSubValue: {
    color: '#707070',
    fontSize: 13,
  },

  fontStyles: {
    fontFamily: 'Open Sans',
    fontSize: 18,
  },
});


export default connect(state => ({
    auth: state.auth,
    profile: state.profile,
    explore: state.explore,
  }),
    (dispatch) => ({
      updateProfile: (data) => dispatch(clientProfileActions.updateProfile(data)),
    })
)(EditProfile);