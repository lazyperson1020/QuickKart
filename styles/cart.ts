import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: '#35035C',
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
  },
  bodyContainer: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  img: {
    width: 100,
    height: 100,
  },
  firstChild: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  nameContainer: {
    flex: 1,
    marginLeft: 10,
    gap: 5,
  },
  name: {
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    color: '#111',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#35035C',
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  quantity: {
    fontSize: 16,
    color: '#fff',
    paddingHorizontal: 5,
  },
  secondChild: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#E3E3E3',
    marginTop: 10,
    paddingBottom: 10,
  },
  separator: {
    height: 20,
  },
  weightContainer: {
    flexDirection: 'row',
    gap: 1,
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    paddingVertical: 5,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  weight: {
    fontSize: 13,
    color: '#35035C',
    fontWeight: 'bold',
  },
  btn: {
    backgroundColor: '#35035C',
    padding: 15,
  },
  btnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
