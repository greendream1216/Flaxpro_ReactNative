import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { SegmentedControls } from 'react-native-radio-buttons';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';

import Calendar from './calendar/Calendar';

import R from 'ramda';
import Moment from 'moment';

const { width, height } = Dimensions.get('window');
import * as CommonConstant from '../../../Components/commonConstant';
const background = require('../../../Assets/images/background.png');
const avatarDefault = require('../../../Assets/images/avatar.png');
const edit = require('../../../Assets/images/edit.png');

const constants = {
  BASIC_INFO: 'BASIC INFO',
  CALENDAR: 'CALENDAR'
};

class ScheduleForm extends Component {

  static propTypes = {
    editable: PropTypes.bool,
  };

  static defaultProps = {
    editable: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedDates: [Moment().format('YYYY-MM-DD')],
      selectedOption: constants.CALENDAR,
    };
  }

  onSelectDate(date) {
    const day = Moment(date).format('YYYY-MM-DD');
    const selectedDates = [...this.state.selectedDates];
    if(selectedDates.includes(day)){
      selectedDates.splice(selectedDates.indexOf(day), 1)
    } else {
      selectedDates.push(day)
    }
    this.setState({ selectedDates });
  }

  onBack() {
    Actions.pop();
  }
  onChangeOptions(option) {
    const { selectedOption } = this.state;

    if (selectedOption !== option) {
      Actions.pop();
    }
  }
  onEdit() {
    Actions.EditAvailability(...this.props);
  }

  get getShowNavBar() {
    const { selectedOption } = this.state;
    return (
      <View style={ styles.navigateButtons }>
        <View style={ styles.navBarContainer }>
          <TouchableOpacity
            onPress={ () => this.onBack() }
            style={ styles.navButtonWrapper }
          >
            <EntypoIcons
              name="chevron-thin-left"  size={ 25 }
              color="#fff"
            />
          </TouchableOpacity>

          <Text style={ styles.textTitle }>SCHEDULE</Text>

          {
            this.props.editable ?
              <TouchableOpacity
                onPress={ () => this.onEdit() }
                style={ styles.navButtonWrapper }
              >
                <Image source={ edit } style={ styles.imageEdit } resizeMode="cover"/>
              </TouchableOpacity>
              :
              <View style={ styles.navButtonWrapper }/>
          }

        </View>

        <View style={ styles.navigateButtons }>
          <SegmentedControls
            tint={ "#fff" }
            selectedTint= { "#41c3fd" }
            backTint= { "#41c3fd" }
            options={ [constants.BASIC_INFO, constants.CALENDAR] }
            onSelection={ (option) => this.onChangeOptions(option) }
            selectedOption={ selectedOption }
            allowFontScaling={ true }
            optionStyle={styles.segmentedControlsOptions}
            containerStyle= {styles.segmentedControlsContainer}
          />
        </View>
      </View>
    );
  }

  render() {
    const { auth, profile: { schedule, user } } = this.props;

    return (
      <View style={ styles.container }>
        <Image source={ background } style={ styles.background } resizeMode="cover">
          { this.getShowNavBar }
          <View style={ styles.contentContainer }>

            <Calendar
              customStyle={ customStyle }
              dayHeadings={ ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ] }
              eventDates={ R.pluck('date')(schedule) }
              nextButtonText={ '>' }
              prevButtonText={'<'}
              showControls={ true }
              showEventIndicators={ true }
              isSelectableDay={ true }
              onDateSelect={ (date) => this.onSelectDate(date) }
            />
            <ScrollView showsVerticalScrollIndicator={true}>
            {
              schedule.filter((e)=>this.state.selectedDates.includes(Moment(new Date(e.date)).format('YYYY-MM-DD'))).map((day, index) => (
                <View key={index}>
                  <View style={ styles.sectionTitleContainer }>

                    <Text style={ styles.textSectionTitle }>{day.date}</Text>
                  </View>
                  {
                    day.schedules.map((session) => (
                      auth.user.role === CommonConstant.user_client ?
                      <View style={ styles.timeMainContainer } key={session._id}>
                        <View style={ styles.timeRowContainer}>
                          <Text style={ [styles.textSectionTitle, styles.segmentedControlsOptions] }>{Moment(session.from).format('LT')} To {Moment(session.to).format('LT')}</Text>
                          <View style={ styles.separator}>
                            <Text style={ [styles.textSectionTitle] }>{session.profession && session.profession.name}</Text>
                          </View>
                        </View>
                        <View style={ styles.timeRowContainer}>
                          <Image source={ avatarDefault } style={ styles.imageAvatar } resizeMode="cover"/>
                          <Text style={ styles.textSectionTitle }>{session[user.role === CommonConstant.user_professional ? 'professional': 'client'].name || 'No Name'}</Text>
                        </View>
                      </View>
                      :
                      <View style={ styles.timeMainContainer } key={session._id}>
                        <View style={ styles.timeRowContainer}>
                          <Text style={ [styles.textSectionTitle, styles.segmentedControlsOptions] }>{Moment(session.from).format('LT')} To {Moment(session.to).format('LT')}</Text>
                          <View style={ styles.separator}>
                            <View style={ styles.timeRowContainer}>
                              <Image source={ avatarDefault } style={ styles.imageAvatar } resizeMode="cover"/>
                              <Text style={ styles.textSectionTitle }>{session[user.role === CommonConstant.user_professional ? 'professional': 'client'].name || 'No Name'}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    ))
                  }
                </View>
              ))
            }
            </ScrollView>
          </View>
        </Image>
      </View>
    );
  }
}

const customStyle = {
  title: {
    color: '#2e343b',
  },
  calendarContainer: {
    backgroundColor: '#fff',
  },
  calendarControls: {
    backgroundColor: '#f3f3f3',
  },
  controlButtonText: {
    color: '#8e9296',
  },
  currentDayCircle: {
    backgroundColor: '#efefef',
  },
  currentDayText: {
    color: '#000',
  },
  day: {
    color: '#8d99a6',
  },
  dayHeading: {
    color: '#2e343b',
  },
  hasEventCircle: {
    backgroundColor: '#efefef',
    borderWidth: 1,
    borderColor: '#efefef',
  },
  hasEventText: {
    color: '#8d99a6',
  },
  selectedDayCircle: {
    backgroundColor: '#45c7f1',
    borderWidth: 1,
    borderColor: '#34aadc',
  },
  selectedDayText: {
    color: '#fff',
  },
  weekendDayText: {
    color: '#8d99a6',
  },
  weekendHeading: {
    color: '#2e343b',
  },
  weekRow: {
    backgroundColor: '#fff',
  },
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width,
    height,
  },
  navBarContainer: {
    // flex: 1,
    paddingTop: 20,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingVertical: 5,
  },  
  contentContainer: {
    flex: 8.5,
    backgroundColor: '#efefef',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    borderColor: '#d9d9d9',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  textSectionTitle: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    textAlign: 'center',
    color: '#565656',
  },
  imageEdit: {
    width: 24,
    height: 24,
  },
  timeMainContainer: {
    flex: 3,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#d9d9d9',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  separator: {
    marginVertical:2,
    marginLeft:1,
    borderColor: '#d9d9d9',
    borderLeftWidth: 1,
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
  navigateButtons: {
    flex:1.5,
    alignItems: 'center',
    flexDirection: 'column'
  },
  segmentedControlsOptions: {
    fontSize: 12,
    height: 20,
    paddingTop:3,
  },
  segmentedControlsContainer:{
    borderRadius:10,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  imageAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginVertical: 5,
    marginHorizontal: 5,
  },
});
export default connect(state => ({
    profile: state.profile,
    auth: state.auth,
  })
)(ScheduleForm);
