export const products = [
  {
    name: 'Fresh Bananas',
    grams: 500,
    price: 50,
    
    discounted_price: 45,
    discount_percentage: 10,
    description:
      'Sweet and ripe bananas, perfect for snacking or adding to your favorite smoothies. Bananas are rich in potassium, which helps maintain healthy blood pressure. They are also a good source of dietary fiber, aiding in digestion. Enjoy them as a quick energy boost anytime during the day.',
    image:
      'https://img.freepik.com/free-psd/banana-isolated-transparent-background_191095-14410.jpg?size=626&ext=jpg&ga=GA1.1.513501153.1719743535&semt=sph',
  },
  {
    name: 'Almond Milk',
    grams: 1000,
    price: 150,
    discounted_price: 135,
    discount_percentage: 10,
    description:
      'A dairy-free alternative, rich in vitamins and perfect for a healthy lifestyle. Almond milk is low in calories and a great source of vitamin E, which supports skin health. It’s also fortified with calcium, making it a nutritious substitute for regular milk. Ideal for those with lactose intolerance or following a vegan diet.',
    image:
      'https://img.freepik.com/free-psd/milk-bottle-isolated-transparent-background_191095-28453.jpg?ga=GA1.1.513501153.1719743535&semt=sph',
  },
  {
    name: 'Organic Spinach',
    grams: 200,
    price: 60,
    discounted_price: 50,
    discount_percentage: 16,
    description:
      'Fresh organic spinach, packed with nutrients for your salads and dishes. Spinach is an excellent source of iron, crucial for blood health and energy production. It’s also high in antioxidants, including vitamin C and beta-carotene, which support immune function and eye health. Add it to your meals for a nutritional boost.',
    image:
      'https://img.freepik.com/free-psd/spinach-isolated-transparent-background_191095-27857.jpg?ga=GA1.1.513501153.1719743535&semt=sph',
  },
  {
    name: 'Brown Eggs',
    grams: 600,
    price: 120,
    discounted_price: 110,
    discount_percentage: 8,
    description:
      'Free-range brown eggs, a great source of protein and essential nutrients. Each egg contains around 6 grams of high-quality protein, making them ideal for muscle repair and growth. They are also rich in choline, important for brain health and memory. Enjoy them boiled, scrambled, or in your favorite recipes.',
    image:
      'https://img.freepik.com/free-psd/eggs-bowl-isolated-transparent-background_191095-18210.jpg?ga=GA1.1.513501153.1719743535&semt=sph',
  },
  {
    name: 'Whole Wheat Bread',
    grams: 400,
    price: 40,
    discounted_price: 35,
    discount_percentage: 12,
    description:
      'Freshly baked whole wheat bread, perfect for a healthy and balanced diet. Whole wheat bread is high in fiber, which helps in maintaining digestive health. It also provides essential B vitamins, which are vital for energy metabolism. Use it for sandwiches, toast, or as a side with your meals.',
    image:
      'https://img.freepik.com/free-psd/quick-bread-isolated-transparent-background_191095-27910.jpg?ga=GA1.1.513501153.1719743535&semt=sph',
  },
  {
    name: 'Greek Yogurt',
    grams: 500,
    price: 100,
    discounted_price: 90,
    discount_percentage: 10,
    description:
      'Creamy and rich Greek yogurt, great for breakfast or as a snack. Greek yogurt is packed with protein, which helps keep you full longer and supports muscle growth. It also contains probiotics, which are beneficial for gut health. Enjoy it with fresh fruits, nuts, or as a base for smoothies.',
    image:
      'https://img.freepik.com/free-photo/greek-yogurt-wooden-bowl-isolated-white-background_123827-22632.jpg?ga=GA1.1.513501153.1719743535&semt=sph',
  },
  {
    name: 'Avocados',
    grams: 300,
    price: 80,
    discounted_price: 70,
    discount_percentage: 12,
    description:
      'Fresh and creamy avocados, perfect for salads, toasts, and guacamole. Avocados are a rich source of healthy monounsaturated fats, which are good for heart health. They are also high in fiber and contain more potassium than bananas. Use them to add creaminess and nutrition to your meals.',
    image:
      'https://img.freepik.com/free-vector/vector-green-fresh-whole-half-cut-avocado-with-leaf-side-view-isolated-white-background_1284-45445.jpg?ga=GA1.1.513501153.1719743535&semt=sph',
  },
  {
    name: 'Fresh Strawberries',
    grams: 250,
    price: 90,
    discounted_price: 80,
    discount_percentage: 11,
    description:
      'Juicy and sweet strawberries, perfect for desserts, salads, or snacking. Strawberries are low in calories and high in vitamin C, which supports immune function and skin health. They are also rich in antioxidants, which help fight free radicals in the body. Enjoy them fresh, in smoothies, or with yogurt.',
    image:
      'https://img.freepik.com/free-photo/strawberry-isolated-white-background_1232-1974.jpg?t=st=1719747267~exp=1719750867~hmac=f39d001307a6ad572fabbc049cf1c16b7d3b8dbcbdb048dc5c08fc16b73134da&w=900',
  },
  {
    name: 'Quinoa',
    grams: 500,
    price: 140,
    discounted_price: 125,
    discount_percentage: 10,
    description:
      'High-protein quinoa, a versatile grain for salads, bowls, and side dishes. Quinoa is a complete protein, containing all nine essential amino acids. It’s also gluten-free and a good source of fiber, iron, and magnesium. Use it as a base for salads, or as a side dish for your favorite meals.',
    image:
      'https://img.freepik.com/free-psd/quinoa-isolated-transparent-background_191095-31649.jpg?ga=GA1.1.513501153.1719743535&semt=sph',
  },
  {
    name: 'Olive Oil',
    grams: 1000,
    price: 300,
    discounted_price: 270,
    discount_percentage: 10,
    description:
      'Pure and fresh olive oil, ideal for cooking, dressings, and marinades. Olive oil is rich in monounsaturated fats, which support heart health. It also contains antioxidants, such as vitamin E, which help protect cells from damage. Use it to enhance the flavor of your dishes while adding health benefits.',
    image:
      'https://img.freepik.com/free-vector/fresh-pressed-olive-oil-bottle-pourer-with-ornamental-black-green-olives-poster_1284-10923.jpg?ga=GA1.1.513501153.1719743535&semt=ais_user',
  },
];

export const categories = [
  'Dairy, Bread & Eggs',
  'Cold Drinks & Juices',
  'Tea, Coffee & More',
  'Masala, Dry Fruits & More',
  'Munchies',
  'Sweet Cravings',
  'Biscuits',
  'Meat, Fish & Eggs',
  'Packaged Food',
  'Breakfast & Sauces',
  'Pan Corner',
  'Health & Baby Care',
  'Bath & Body',
  'Cleaning Essentials',
  'Home Needs',
  'Hygiene & Grooming',
];