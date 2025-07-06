import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '../../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const AccountSection: React.FC = () => {
  const { user, updateUserData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user?.username || '');

  const handleEdit = () => {
    setEditedUsername(user?.username || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedUsername.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    try {
      await updateUserData({ username: editedUsername.trim() });
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update username');
    }
  };

  const handleCancel = () => {
    setEditedUsername(user?.username || '');
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Account Information</Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Username</Text>
          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.textInput}
                value={editedUsername}
                onChangeText={setEditedUsername}
                placeholder="Enter username"
                autoFocus
              />
              <TouchableOpacity style={styles.iconButton} onPress={handleSave}>
                <FontAwesomeIcon icon={faCheck} size={16} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleCancel}>
                <FontAwesomeIcon icon={faTimes} size={16} color="#F44336" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{user?.username || 'Not set'}</Text>
              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <FontAwesomeIcon icon={faEdit} size={16} color="#201c5c" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email || 'Not set'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#201c5c',
    marginBottom: 20,
  },
  infoContainer: {
    gap: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#201c5c',
    flex: 1,
  },
  value: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#666666',
    flex: 2,
    textAlign: 'right',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  editButton: {
    marginLeft: 10,
    padding: 5,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#201c5c',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
    fontFamily: 'Montserrat',
    flex: 1,
    marginRight: 10,
  },
  iconButton: {
    padding: 5,
    marginLeft: 5,
  },
});

export default AccountSection;
