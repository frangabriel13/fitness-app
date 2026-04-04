import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface ProfileAvatarProps {
  displayName: string;
  photoUrl?: string | null;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
}

export function ProfileAvatar({
  displayName,
  photoUrl,
  size = 80,
  backgroundColor,
  textColor,
}: ProfileAvatarProps) {
  const theme = useTheme();
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: backgroundColor ?? theme.backgroundSelected,
  };

  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={[styles.avatar, containerStyle]}
        contentFit="cover"
      />
    );
  }

  return (
    <View style={[styles.avatar, containerStyle]}>
      <ThemedText style={[styles.text, { fontSize: Math.round(size * 0.35), color: textColor }]}>
        {getInitials(displayName)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    fontWeight: '700',
  },
});
