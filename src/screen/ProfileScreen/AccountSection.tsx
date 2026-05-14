import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faChevronRight,
  faEnvelope,
  faLock,
  faPencil,
  faRightFromBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import ProfileImage from './ProfileImage';

const PRIMARY = '#201c5c';
const MUTED = '#8B8AA3';
const SOFT_BG = '#F5F4FB';
const BORDER = '#ECEAF5';

const AccountSection: React.FC = () => {
  const { user, updateUserData } = useUser();
  const { signOut } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);

  const username = user?.username || 'Not set';
  const email = user?.email || 'Not set';
  const isGuest = user?.is_guest === true;

  const handleSignOut = () => {
    Alert.alert(
      isGuest ? 'Leave guest session?' : 'Log out',
      isGuest
        ? 'Your data is tied to this device. If you log out without creating a real account you will lose access to it.'
        : 'You will need to log in again to access your data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isGuest ? 'Leave anyway' : 'Log out',
          style: 'destructive',
          onPress: () => {
            signOut();
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <ProfileImage imageUri={null} fullName={username} size={88} />
        <Text style={styles.headerName} numberOfLines={1}>
          {username}
        </Text>
        <Text style={styles.headerEmail} numberOfLines={1}>
          {email}
        </Text>
      </View>

      <Text style={styles.sectionLabel}>Personal Information</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onPress={() => setModalVisible(true)}>
          <View style={styles.iconBadge}>
            <FontAwesomeIcon icon={faUser} size={16} color={PRIMARY} />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>Username</Text>
            <Text style={styles.rowValue} numberOfLines={1}>
              {username}
            </Text>
          </View>
          <View style={styles.rowAction}>
            <FontAwesomeIcon icon={faPencil} size={13} color={PRIMARY} />
            <FontAwesomeIcon
              icon={faChevronRight}
              size={12}
              color={MUTED}
              style={styles.chevron}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.separator} />

        <View style={[styles.row, styles.rowDisabled]}>
          <View style={styles.iconBadge}>
            <FontAwesomeIcon icon={faEnvelope} size={16} color={PRIMARY} />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>Email</Text>
            <Text style={styles.rowValue} numberOfLines={1}>
              {email}
            </Text>
          </View>
          <View style={styles.lockBadge}>
            <FontAwesomeIcon icon={faLock} size={11} color={MUTED} />
          </View>
        </View>
      </View>

      <Text style={styles.helperText}>
        Your email is used to sign in and cannot be changed.
      </Text>

      {isGuest && (
        <View style={styles.guestBanner}>
          <Text style={styles.guestBannerTitle}>You're using a guest session</Text>
          <Text style={styles.guestBannerBody}>
            Your data lives only on this device. Sign up to back it up and use
            SaveGen on multiple devices.
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
        activeOpacity={0.8}>
        <FontAwesomeIcon icon={faRightFromBracket} size={14} color="#e74c3c" />
        <Text style={styles.signOutText}>
          {isGuest ? 'Leave guest session' : 'Log out'}
        </Text>
      </TouchableOpacity>

      <EditUsernameModal
        visible={isModalVisible}
        initialUsername={user?.username || ''}
        onClose={() => setModalVisible(false)}
        onSave={async next => {
          await updateUserData({ username: next });
        }}
      />
    </ScrollView>
  );
};

type EditUsernameModalProps = {
  visible: boolean;
  initialUsername: string;
  onClose: () => void;
  onSave: (username: string) => Promise<void> | void;
};

const EditUsernameModal: React.FC<EditUsernameModalProps> = ({
  visible,
  initialUsername,
  onClose,
  onSave,
}) => {
  const [value, setValue] = useState(initialUsername);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setValue(initialUsername);
      setError(null);
      setIsSaving(false);
    }
  }, [visible, initialUsername]);

  const handleChange = (text: string) => {
    setValue(text);
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Username cannot be empty.');
      return;
    }
    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters.');
      return;
    }
    if (trimmed === initialUsername) {
      onClose();
      return;
    }

    try {
      setIsSaving(true);
      await onSave(trimmed);
      onClose();
    } catch (e) {
      setError('Could not update your username. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Edit username</Text>
          <Text style={styles.modalSubtitle}>
            This is how your name will appear across SaveGen.
          </Text>

          <View style={styles.inputWrapper}>
            <FontAwesomeIcon icon={faUser} size={16} color={MUTED} />
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={handleChange}
              placeholder="Enter username"
              placeholderTextColor="#A8A6C2"
              autoFocus
              autoCapitalize="words"
              maxLength={40}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
              disabled={isSaving}
              activeOpacity={0.8}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.saveButton,
                isSaving && styles.saveDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSaving}
              activeOpacity={0.85}>
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: SOFT_BG,
    borderRadius: 18,
    marginBottom: 24,
  },
  headerName: {
    marginTop: 14,
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: PRIMARY,
  },
  headerEmail: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    color: MUTED,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: 'Montserrat-Bold',
    color: MUTED,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowDisabled: {
    opacity: 0.85,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: SOFT_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    color: MUTED,
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
    color: PRIMARY,
  },
  rowAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: 8,
  },
  lockBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: SOFT_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: BORDER,
    marginLeft: 66,
  },
  helperText: {
    marginTop: 10,
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Montserrat',
    color: MUTED,
    lineHeight: 16,
  },
  guestBanner: {
    marginTop: 18,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFF6E5',
    borderWidth: 1,
    borderColor: '#F6D58A',
  },
  guestBannerTitle: {
    fontSize: 13,
    fontFamily: 'Montserrat-Bold',
    color: '#8a5a00',
    marginBottom: 4,
  },
  guestBannerBody: {
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    color: '#a26a0e',
    lineHeight: 16,
  },
  signOutButton: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#fbd6d2',
    backgroundColor: '#fff5f4',
  },
  signOutText: {
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
    color: '#e74c3c',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: PRIMARY,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    color: MUTED,
    marginBottom: 18,
    lineHeight: 18,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: PRIMARY,
    padding: 0,
  },
  errorText: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    color: '#e74c3c',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1EEFF',
  },
  cancelText: {
    fontSize: 15,
    color: PRIMARY,
    fontFamily: 'Montserrat-SemiBold',
  },
  saveButton: {
    backgroundColor: PRIMARY,
  },
  saveDisabled: {
    backgroundColor: '#A8A6C2',
  },
  saveText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default AccountSection;
