import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';

interface ProfileImageProps {
  imageUri?: string | null;
  fullName: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  imageUri,
  fullName,
  size = 80,
  backgroundColor = '#6A5ACD',
  textColor = '#FFFFFF',
}) => {
  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    let initials = nameParts[0].charAt(0);

    if (nameParts.length > 1) {
      initials = initials + nameParts[nameParts.length - 1].charAt(0);
    }

    return initials.toUpperCase();
  };

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: imageUri ? 'transparent' : backgroundColor,
  };

  const textStyle = {
    fontSize: size / 3,
    color: textColor,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {imageUri ? (
        <Image
          source={{uri: imageUri}}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, textStyle]}>
          {getInitials(fullName)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontWeight: 'bold',
  },
});

export default ProfileImage;
