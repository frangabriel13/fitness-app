import { ThemedText } from '@/components/themed-text';
import { MOCK_USERS } from '@/data/mock-users';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore, useCurrentUser } from '@/stores/auth-store';
import { useWorkoutStore } from '@/stores/workout-store';
import type { User } from '@/types';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function RoleBadge({ role }: { role: User['role'] }) {
  const isTrainer = role === 'trainer';
  return (
    <View
      style={[
        styles.roleBadge,
        { backgroundColor: isTrainer ? '#FF6B35' : '#4CAF50' },
      ]}>
      <ThemedText style={styles.roleBadgeText}>
        {isTrainer ? 'T' : 'C'}
      </ThemedText>
    </View>
  );
}

function UserRow({
  user,
  isActive,
  onPress,
}: {
  user: User;
  isActive: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.userRow,
        {
          backgroundColor: isActive
            ? theme.accent + '1A'
            : theme.backgroundElement,
          borderColor: isActive ? theme.accent : 'transparent',
        },
      ]}>
      <View style={[styles.avatar, { backgroundColor: theme.backgroundSelected }]}>
        <ThemedText style={styles.avatarText}>{getInitials(user.displayName)}</ThemedText>
      </View>
      <View style={styles.userInfo}>
        <ThemedText style={{ fontWeight: '600', fontSize: 15 }}>
          {user.displayName}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {user.email}
        </ThemedText>
      </View>
      <RoleBadge role={user.role} />
    </Pressable>
  );
}

export function DevRoleSwitcher() {
  const theme = useTheme();
  const currentUser = useCurrentUser();
  const switchUser = useAuthStore((s) => s.switchUser);
  const clearWorkouts = useWorkoutStore((s) => s.clearAll);
  const [visible, setVisible] = useState(false);

  const handleSelect = (userId: string) => {
    if (userId !== currentUser.id) {
      clearWorkouts();
      switchUser(userId);
    }
    setVisible(false);
  };

  return (
    <>
      {/* Floating button */}
      <Pressable
        onPress={() => setVisible(true)}
        style={[styles.fab, { backgroundColor: theme.backgroundElement, bottom: BottomTabInset + Spacing.four }]}>
        <View style={[styles.fabAvatar, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText style={styles.fabAvatarText}>
            {getInitials(currentUser.displayName)}
          </ThemedText>
        </View>
        <RoleBadge role={currentUser.role} />
      </Pressable>

      {/* Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <Pressable
            style={[styles.sheet, { backgroundColor: theme.background }]}
            onPress={(e) => e.stopPropagation()}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sheetTitle}>
              CAMBIAR USUARIO (DEV)
            </ThemedText>
            <FlatList
              data={MOCK_USERS}
              keyExtractor={(u) => u.id}
              renderItem={({ item }) => (
                <UserRow
                  user={item}
                  isActive={item.id === currentUser.id}
                  onPress={() => handleSelect(item.id)}
                />
              )}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Spacing.three,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
  fabAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabAvatarText: {
    fontSize: 12,
    fontWeight: '700',
  },
  roleBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.four,
    paddingBottom: Spacing.six,
    maxHeight: '60%',
  },
  sheetTitle: {
    marginBottom: Spacing.three,
    textAlign: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
});
