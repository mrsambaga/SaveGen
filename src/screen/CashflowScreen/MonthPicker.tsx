import { Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { MonthPickerProps } from "../../constants/props";
import { MONTHS } from "../../constants/const";

const MonthPicker: React.FC<MonthPickerProps> = ({ selectedMonth, setSelectedMonth, showMonthPicker, setShowMonthPicker }) => {
  const CURRENT_YEAR = new Date().getFullYear();
  const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

  const handleMonthChange = (month: string) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(MONTHS.indexOf(month));
    setSelectedMonth(newDate);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(selectedMonth);
    newDate.setFullYear(year);
    setSelectedMonth(newDate);
  };

  return (
    <Modal
      visible={showMonthPicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowMonthPicker(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Month</Text>
            <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
              <Text style={styles.pickerCloseButton}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.customPickerContent}>
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Month</Text>
              <Picker
                selectedValue={MONTHS[selectedMonth.getMonth()]}
                onValueChange={handleMonthChange}
              >
                {MONTHS.map((month) => (
                  <Picker.Item key={month} label={month} value={month} />
                ))}
              </Picker>
            </View>
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Year</Text>
              <Picker
                selectedValue={selectedMonth.getFullYear()}
                onValueChange={handleYearChange}
              >
                {YEARS.map((year) => (
                  <Picker.Item key={year} label={year.toString()} value={year} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#201c5c',
    fontFamily: 'Montserrat-SemiBold',
  },
  pickerCloseButton: {
    fontSize: 16,
    color: '#201c5c',
    fontFamily: 'Montserrat-SemiBold',
  },
  customPickerContent: {
    flexDirection: 'row',
    padding: 16,
  },
  pickerSection: {
    flex: 1,
    marginHorizontal: 8,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#201c5c',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 8,
  },
})

export default MonthPicker;