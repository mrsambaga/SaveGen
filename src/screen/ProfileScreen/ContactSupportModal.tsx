import React from 'react';
import {
  Alert,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faEnvelope,
  faPaperPlane,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

const SUPPORT_EMAIL = 'save-gen@gmail.com';
const PRIMARY = '#201c5c';
const MUTED = '#8B8AA3';

type ContactSupportModalProps = {
  visible: boolean;
  onClose: () => void;
};

const ContactSupportModal: React.FC<ContactSupportModalProps> = ({
  visible,
  onClose,
}) => {
  const handleOpenEmail = async () => {
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      'SaveGen Support Request',
    )}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert(
          'No email app found',
          `Please send your message to ${SUPPORT_EMAIL}.`,
        );
        return;
      }
      await Linking.openURL(url);
      onClose();
    } catch {
      Alert.alert(
        'Something went wrong',
        `Please send your message to ${SUPPORT_EMAIL}.`,
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}>
            <FontAwesomeIcon icon={faXmark} size={18} color={MUTED} />
          </TouchableOpacity>

          <View style={styles.iconCircle}>
            <FontAwesomeIcon icon={faEnvelope} size={26} color={PRIMARY} />
          </View>

          <Text style={styles.title}>Contact Support</Text>
          <Text style={styles.subtitle}>
            Have a question or need help? Reach out to our team and we'll get
            back to you as soon as possible.
          </Text>

          <View style={styles.emailBox}>
            <Text style={styles.emailLabel}>Email</Text>
            <Text style={styles.emailValue} selectable>
              {SUPPORT_EMAIL}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleOpenEmail}
            activeOpacity={0.85}>
            <FontAwesomeIcon icon={faPaperPlane} size={14} color="#fff" />
            <Text style={styles.primaryButtonText}>Open Email App</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    paddingTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: PRIMARY,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    color: MUTED,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  emailBox: {
    width: '100%',
    backgroundColor: '#F5F4FB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  emailLabel: {
    fontSize: 11,
    fontFamily: 'Montserrat-SemiBold',
    color: MUTED,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  emailValue: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: PRIMARY,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    gap: 10,
  },
  primaryButtonText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default ContactSupportModal;
