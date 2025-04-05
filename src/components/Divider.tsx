import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-gesture-handler';

const Divider: React.FC<{text: string}> = ({text}) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 30,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#969393',
    fontFamily: 'Montserrat',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#CCCCCC',
  },
});

export default Divider;
