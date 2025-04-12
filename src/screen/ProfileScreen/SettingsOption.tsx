import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

type SettingOptionProps = {
  iconName: IconProp;
  title: string;
  onPress: () => void;
};

const SettingsOption: React.FC<SettingOptionProps> = ({
  iconName,
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.settingsOptionContainer} onPress={onPress}>
      <View style={styles.settingsOptionLeft}>
        <FontAwesomeIcon icon={iconName} size={20} color={'#201c5c'} />
        <Text style={styles.settingsOptionText}>{title}</Text>
      </View>
      <FontAwesomeIcon icon={faAngleRight} size={20} color={'#201c5c'} />
    </TouchableOpacity>
  );
};

export default SettingsOption;

const styles = StyleSheet.create({
  settingsOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingsOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  settingsOptionText: {
    fontSize: 15,
    fontFamily: 'Montserrat',
    color: '#201c5c',
  },
});
