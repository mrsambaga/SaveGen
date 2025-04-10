import {StyleSheet, Text, View} from 'react-native';
import {Image} from 'react-native';

type ProfileOptionProps = {
  size?: number;
  textColor?: string;
};

const ProfileOption: React.FC<ProfileOptionProps> = ({
  size = 180,
  textColor = '#201c5c',
}) => {
  const containerStyle = {
    width: size * 0.8,
    height: size,
  };
  const titleStyle = {
    fontSize: 20,
    color: textColor,
  };
  const descriptionStyle = {
    fontSize: 15,
    color: textColor,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={require('../../../assets/icons/wallet.png')}
        style={styles.icon}
      />
      <Text style={[styles.title, titleStyle]}>Title</Text>
      <Text style={[styles.description, descriptionStyle]}>Description</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 20,
  },
  icon: {
    width: '55%',
    height: '43%',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
  },
  description: {
    fontFamily: 'Montserrat',
  },
});

export default ProfileOption;
