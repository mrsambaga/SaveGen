import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { faAngleRight, faLock } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type SettingOptionProps = {
  iconName: IconProp;
  title: string;
  onPress: () => void;
  value?: string;
  locked?: boolean;
};

const SettingsOption: React.FC<SettingOptionProps> = ({
  iconName,
  title,
  onPress,
  value,
  locked = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.settingsOptionContainer}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.settingsOptionLeft}>
        <View style={styles.iconBadge}>
          <FontAwesomeIcon icon={iconName} size={16} color={'#201c5c'} />
        </View>
        <Text style={styles.settingsOptionText}>{title}</Text>
      </View>
      <View style={styles.settingsOptionRight}>
        {value && <Text style={styles.valueText}>{value}</Text>}
        {locked ? (
          <FontAwesomeIcon icon={faLock} size={13} color={'#8B8AA3'} />
        ) : (
          <FontAwesomeIcon icon={faAngleRight} size={18} color={'#8B8AA3'} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SettingsOption;

const styles = StyleSheet.create({
  settingsOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEAF5',
  },
  settingsOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F1EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsOptionText: {
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
    color: '#201c5c',
    flexShrink: 1,
  },
  settingsOptionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  valueText: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: '#8B8AA3',
  },
});
