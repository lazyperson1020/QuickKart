import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontFamily: 'Inter_500Medium',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
  },
  errorBorder: {
    borderColor: '#DC2626',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#111',
    fontFamily: 'Inter_400Regular',
  },
  iconContainer: {
    padding: 6,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#DC2626',
    fontFamily: 'Inter_400Regular',
  },
});
