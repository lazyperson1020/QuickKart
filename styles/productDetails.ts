import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  bodyContainer: {
    backgroundColor: '#E3E3E3',
    flex: 1,
  },
  productImage: {
    height: 300,
    backgroundColor: '#E3E3E3',
  },
  productInfoContainer: {
    padding: 15,
    gap: 5,
    backgroundColor: '#fff',
  },
  productTitle: {
    fontSize: 16.5,
    color: '#111',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14.5,
    color: 'red',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  productWeight: {
    fontSize: 14,
    color: '#888',
    fontWeight: '400',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'space-between',
  },
  priceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  productPrice: {
    fontSize: 19,
    color: '#111',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  originalPrice: {
    fontSize: 16,
    color: '#888',
    fontWeight: '400',
    letterSpacing: 0.5,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 5,
  },
  discountText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  productDescriptionContainer: {
    padding: 15,
    marginTop: 9,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productDescriptionTitle: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  quantity: {
    fontSize: 16,
    color: '#fff',
    paddingHorizontal: 8,
  },
  descriptionContainer: {
    padding: 15,
    marginTop: 9,
    backgroundColor: '#fff',
  },
  descText: {
    fontSize: 13,
    color: '#111',
    lineHeight: 24,
  },
  footerContainer: {
    backgroundColor: '#E3E3E3',
  },
  btnCart: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  cartText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  outOfStockImage: {
  opacity: 0.4,
},

outOfStockBanner: {
  backgroundColor: '#fdeaea',
  marginHorizontal: 15,
  marginTop: 12,
  padding: 12,
  borderRadius: 12,
},

outOfStockTitle: {
  color: '#d32f2f',
  fontWeight: '700',
  fontSize: 14,
},

outOfStockSubtitle: {
  color: '#666',
  marginTop: 4,
  fontSize: 13,
},

notifyButton: {
  backgroundColor: '#e91e63',
  paddingHorizontal: 20,
  paddingVertical: 8,
  borderRadius: 10,
},

notifyButtonText: {
  color: '#fff',
  fontWeight: '600',
},
});
