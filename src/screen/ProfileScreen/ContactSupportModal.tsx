import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCheck,
  faCopy,
  faEnvelope,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

const SUPPORT_EMAIL = 'save-gen@gmail.com';
const PRIMARY = '#201c5c';
const MUTED = '#8B8AA3';
const SUCCESS = '#22a06b';

type ContactSupportModalProps = {
  visible: boolean;
  onClose: () => void;
};

const ContactSupportModal: React.FC<ContactSupportModalProps> = ({
  visible,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!visible) {
      setCopied(false);
      return;
    }
  }, [visible]);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = () => {
    Clipboard.setString(SUPPORT_EMAIL);
    setCopied(true);
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
            Have a question or need help? Send us an email and we'll get back
            to you as soon as possible.
          </Text>

          <TouchableOpacity
            style={styles.emailBox}
            onPress={handleCopy}
            activeOpacity={0.7}>
            <View style={styles.emailBoxText}>
              <Text style={styles.emailLabel}>Email</Text>
              <Text style={styles.emailValue} selectable numberOfLines={1}>
                {SUPPORT_EMAIL}
              </Text>
            </View>
            <View
              style={[
                styles.copyButton,
                copied && styles.copyButtonSuccess,
              ]}>
              <FontAwesomeIcon
                icon={copied ? faCheck : faCopy}
                size={14}
                color={copied ? SUCCESS : PRIMARY}
              />
              <Text
                style={[
                  styles.copyButtonText,
                  copied && styles.copyButtonTextSuccess,
                ]}>
                {copied ? 'Copied' : 'Copy'}
              </Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.helperText}>
            Tap the email or the copy button to copy it to your clipboard.
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F4FB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  emailBoxText: {
    flex: 1,
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
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    color: PRIMARY,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  copyButtonSuccess: {
    borderColor: SUCCESS,
    backgroundColor: '#E8F7F0',
  },
  copyButtonText: {
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    color: PRIMARY,
  },
  copyButtonTextSuccess: {
    color: SUCCESS,
  },
  helperText: {
    marginTop: 14,
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    color: MUTED,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default ContactSupportModal;
