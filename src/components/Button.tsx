import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {Text} from 'react-native-gesture-handler';

type ButtonProps = {
  title: string;
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activeOpacity?: number;
  children?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
  activeOpacity = 0.8,
  children,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      activeOpacity={activeOpacity}>
      {children ? (
        children
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: '10%',
    height: '10%',
  },
  button: {
    backgroundColor: '#201c5c',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 22,
    fontFamily: 'Montserrat-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default Button;
