import {Image, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-gesture-handler';
import Button from '../../components/Button';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  Landing: undefined;
  Register: undefined;
};

type HomeProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Register'>;
};

const HomeScreen: React.FC<HomeProps> = ({navigation}) => {
  const income = 600;
  const expenses = 400;
  const total = income + expenses;
  const incomeRatio = income / total;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back, Sam!</Text>
      <View style={styles.card}>
        <View style={styles.topCard}>
          <Text style={styles.cardText}>Your spending</Text>
          <Image
            source={require('../../../assets/icons/coin.png')}
            style={styles.icon}
          />
        </View>
        <View>
          <Text style={styles.spendingText}>Rp 1.0000.000</Text>
        </View>
        <View style={styles.ratioBar}>
          <View style={[styles.spendingBar, {flex: incomeRatio}]} />
        </View>
      </View>
      <View style={styles.budgetingContainer}>
        <Text style={styles.heading}>Budgeting</Text>
        <View style={styles.budgeting}>
          <Text style={styles.heading}>Set your budget</Text>
          <Text>Save more money by setting budget</Text>
          <Button
            title="Setup now"
            buttonStyle={styles.button}
            textStyle={styles.buttonText}
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#ffffff',
  },
  card: {
    marginTop: 30,
    backgroundColor: '#201c5c',
    width: '100%',
    height: '20%',
    padding: 20,
    borderRadius: 20,
  },
  topCard: {
    flexDirection: 'row',
    gap: '25%',
    marginBottom: 10,
  },
  icon: {
    width: '20%',
    height: 70,
  },
  ratioBar: {
    marginTop: 5,
    flexDirection: 'row',
    height: 10,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  spendingBar: {
    backgroundColor: '#8290ed',
    borderRadius: 30,
  },
  expenseBar: {
    backgroundColor: '#f44336',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat',
    color: '#201c5c',
  },
  heading: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#201c5c',
  },
  heading2: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#201c5c',
  },
  cardText: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    color: '#ffffff',
  },
  spendingText: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#ffffff',
  },
  budgetingContainer: {
    marginTop: 30,
    height: '21%',
  },
  budgeting: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    height: '100%',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    color: '#ffffff',
  },
  button: {
    marginTop: 48,
    backgroundColor: '#8290ed',
    paddingVertical: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '50%',
  },
});

export default HomeScreen;
