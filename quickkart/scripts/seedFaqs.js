const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("../serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const FAQ_CATEGORIES = [
  {
    id: "general-inquiry",
    title: "General Inquiry",
    order: 0,
    questions: [
      {
        question: "What is Quickkart Daily?",
        answer:
          "Quickkart Daily is a membership program that gives you access to certain benefits such as free delivery on orders above the order value Rs. 99 and discounts on select products.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "How do I delete my account?",
        answer:
          'You will need to contact our customer support through "Chat With Us" option or email to delete your account.',
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "How do I log in to the Quickkart app?",
        answer:
          "Once the app is installed, you could log in by entering your mobile number and validating it with an OTP.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "Quickkart doesn't sell my favourite brand. How can I tell you about It?",
        answer:
          "We would love to hear what you think is missing on Quickkart. We are always open to new products to expand our selection. Just click on ‘Suggest Products Option’ on our app.",
        hasContactFooter: true,
        hasLink: false,
      },
      {
        question: "Tell me a little about Quickkart",
        answer:
          "Quickkart is a fast-growing startup that delivers groceries in 10 minutes through an optimized network of dark stores! We now deliver in more than 10 cities.",
        hasContactFooter: true,
        hasLink: false,
      },
      {
        question:
          "Do you charge any amount or taxes over and above the price of each item?",
        answer:
          "All our products prices are inclusive of taxes. We charge a nominal fee for rendering the services of packing & delivering your products. If applicable, the delivery fee and small-cart fee will be specified on the checkout page.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Do you deliver all beverages cold?",
        answer:
          "We try to deliver all cold beverages chilled. However, given that there is a delivery time involved, there can be times when the beverages aren't as chilled.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "How do you pack your veg and non-veg items?",
        answer: "All veg & non-veg items are stored & packed separately.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "How do I order anything from the paan corner?",
        answer:
          "You can find the Paan Corner section on our app. Simply browse through the Paan Corner category and add your desired items to the cart.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "Do you follow discreet packaging for sexual wellness product?",
        answer:
          "Yes, we do follow discreet packaging for sexual wellness products. Your privacy is important to us and all such products are packed in plain, unmarked packaging.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "What is the minimum order value?",
        answer:
          "You can place an order for any amount on Quickkart. There is no minimum order value or MOV. However, a small cart fee may be levied in case the cart value is below a certain threshold.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Want to work with us?",
        answer:
          "Thank you for your interest in working with Quickkart. Kindly share your updated resume with us at careers@quickkart.com and someone from our Human Resources team will connect with you if you fulfill our required criteria. We wish you all the best with your application!.",
        hasContactFooter: false,
        hasLink: true,
      },
      {
        question: "What is the maximum COD limit?",
        answer: "Yes, we do have a maximum limit of Rs.700 on COD orders.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Why is my ETA more than 10 minutes?",
        answer:
          "While our effort is always to deliver your order within 10 minutes, if there is a surge in demand or a traffic-related issue, it can sometimes take a bit longer for your order to be delivered. The estimated delivery time is always indicated in the app before you place your order.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Can I pay the rider by UPI?",
        answer:
          "We are working on this option. As of now, we don't have this capability.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Why does Quickkart not deliver In my area?",
        answer:
          'We strive hard to ensure Quickkart is serviceable in as many areas as possible. You could head to the "Delivery Areas" page on our website to know more details about the areas we are currently serviceable in.',
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "Can I make a product request which is not available on Quickkart?",
        answer:
          "Yes, we love when you let us know what you want from Quickkart! You can suggest products to us by clicking on the menu at the top right side of the App.",
        hasContactFooter: false,
        hasLink: true,
      },
      {
        question: "Why are you not taking orders?",
        answer:
          "Due to higher order volumes, we are currently not accepting orders. You could check in after some time! Thank you for your patience!",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Can I partner/sell with Quickkart?",
        answer:
          "You could e-mail us at below mentioned email ID and we could take this further from there.",
        hasContactFooter: true,
        hasLink: false,
      },
      {
        question: "Location serviceability / Non servicable area",
        answer:
          'We strive hard to ensure Quickkart is serviceable in as many areas as possible. You could head to the "Delivery Areas" page on our website to know more details about the areas we are currently serviceable in.',
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "What are your timings?",
        answer: "Our support team is here to help you 24*7",
        hasContactFooter: false,
        hasLink: false,
      },
    ],
  },
  {
    id: "payment-related",
    title: "Payment Related",
    order: 1,
    questions: [
      {
        question: "What are the modes of payment?",
        answer:
          '"The following modes of payment are available on our app:\n a. Cash on Delivery (COD), after the first order is placed via Online Payment.\n b. Visa, Mastercard, and Rupay-credit and debit cards.\n c. CRED Pay\n d. Wallets (Freecharge, Mobikwik, PayZapp)\n e. Pay Later (SIMPL, LazyPay)\nIf the order must be left at the security gate, please continue to pay online using wallets, UPI, net banking, or credit/debit cards."',
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "How do I change the mode of payment?",
        answer:
          "Since the orders are already out for delivery shortly, it's not possible to change the payment method at this time.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "Is It safe to use my debit/credit card to shop on Quickkart?",
        answer:
          "Yes, it is. All transactions on Quickkart are completed via secure payment gateways that are PCI DSS compliant. We do not store your card details at any point.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "How can I delete my saved card details?",
        answer:
          "You can contact us through email mentioned below to delete your card details.",
        hasContactFooter: true,
        hasLink: false,
      },
      {
        question: "Do you accept Sodexo, ticket restaurants etc.?",
        answer: "You may check the Quickkart app for the same.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Why is my COD blocked?",
        answer:
          "When orders are placed and cancelled, post packing or delivering, the COD gets disabled. Please place an order using the 'Online Payment' option. As soon as your order is marked as 'Delivered', the system will automatically enable COD on your account.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "What is the limit to place a COD order?",
        answer: "You can place a COD order with a value of upto Rs 700.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "What are the small cart fees?",
        answer:
          "It is a nominal charge for rendering the services of picking and packing the products for you. If your order value is more than a certain amount, this value is waived. The minimum amount benchmark and subsequent small-cart fees will be specified on the checkout page.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Is there a delivery fee for each order?",
        answer:
          "Delivery fee is only applied below a certain MOV which is communicated on the cart page.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Do you charge for the Bag ?",
        answer: "No, sellers dont levy separate charge for the bag.",
        hasContactFooter: false,
        hasLink: false,
      },
    ],
  },
  {
    id: "feedback-suggestions",
    title: "Feedback & Suggestions",
    order: 2,
    questions: [
      {
        question: "Tell me a little about your rider safety initiative.",
        answer:
          "Our model and store mapping ensure that our rider partners operate in a much smaller 3 km radius around the same dark store, building greater familiarity, safety, and comfort for our Quickkart Rider Partners as well as the communities.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Rider feedback In general",
        answer:
          "We love to hear from you! Please reach out to us and we will get back to you in a bit!",
        hasContactFooter: true,
        hasLink: false,
      },
      {
        question: "Any feedback / review",
        answer:
          "We love to hear from you! Please reach out to us and we will get back to you in a bit!.",
        hasContactFooter: true,
        hasLink: false,
      },
      {
        question: "Out of stock",
        answer:
          'Sellers try to replenish all the items which are out of stock regularly. However, if the product is out of stock, you could simply click on the "Notify Me" button and we will send you a notification once it is available.',
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Packaging feedback",
        answer:
          "Please reach out to us and we will get back to you in a bit!",
        hasContactFooter: true,
        hasLink: false,
      },
    ],
  },
  {
    id: "order-products-related",
    title: "Order / Products Related",
    order: 3,
    questions: [
      {
        question: "Can I change the delivery address of my order?",
        answer:
          "Once an order is placed, it cannot be routed to another address. You can return your order and place a new order after updating the delivery address.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Can I reschedule my order?",
        answer:
          "Since all orders are usually delivered at Quickkart speed, rescheduling is not required. If you have already placed an order, you have the option to return the order and place a new one when you are available.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Can I edit my cart / add items ?",
        answer:
          "Order is packed right away as soon it is accepted so it arrives to you quickly. As a result, it is impossible to make changes after placing the order.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Want the invoice/ pricing break-up ?",
        answer:
          "You can view invoice in the app from 'Orders' section or download from the link sent through sms from us after the order is placed. Please follow the link to open 'Order' section",
        hasContactFooter: false,
        hasLink: true,
      },
      {
        question: "Do you take delivery instructions?",
        answer:
          "There are certain delivery options and capabilities like contactless delivery at the moment. However, we do envision having more options in the near future.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Is there a minimum order value?",
        answer:
          "You can place an order for any amount on the platform, as there is no minimum order value prescribed by sellers. However, a small fee may be applicable for orders below a certain cart value threshold.",
        hasContactFooter: false,
        hasLink: false,
      },
    ],
  },
  {
    id: "gift-card",
    title: "Gift Card",
    order: 4,
    questions: [
      {
        question:
          "Can I use my Quickkart cash to buy Gold or Silver coins?",
        answer:
          "Please note that you cannot use Quickkart Cash [uploaded via Gift Card or otherwise] to purchase Gold or Silver coins on the Quickkart platform.\n\nThe same is also mentioned in the terms of use which can be found in the app.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "What is 'Add Gift card' on Quickkart Cash?",
        answer:
          "The 'Add Gift Card' allows you to add gift cards purchased to Quickkart Cash through platforms like HDFC SmartBuy, Gyftr, Axis Bank, Kotak Bank, Woohoo, Amazon, Cred, and Paytm!",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "How do I add my Gift Card?",
        answer:
          "To add your Gift Card to Quickkart Cash follow the following steps:\n1. Click on the Profile Icon on your Quickkart Homepage\n2. Click on 'Add Money' on the Wallet and Gift Card section\n3. Click on 'Add card' on the 'Have a Gift Card?' strip.\n4. Enter the 16 digit Gift Card Code and the 6-digit pin\n5. Click on 'Add Gift Card' to successfully add the Gift Card!",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Where can I buy a Gift Card?",
        answer:
          "You can buy gift cards directly on Quickkart App, HDFC SmartBuy, Gyftr etc.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "Are there any fees associated with redeeming Gift Cards?",
        answer:
          "There are no additional fees for redeeming gift cards on our platform. The value of the gift card will be applied directly to your purchase.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "What should I do if my Gift Card is not working?",
        answer:
          "If your Gift Card is not working, please check that you have entered the 16 digit Card code and 6 digit PIN accurately while redeeming your Gift Card.",
        hasContactFooter: true,
        hasLink: false,
      },
      {
        question: "Can I use multiple Gift Cards for a single purchase?",
        answer:
          "Yes, you can use multiple Gift Cards during a single transaction. You will have to add all Gift Cards into Quickkart Cash and then use the balance to purchase anything on Quickkart",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Is there an expiry date for the Gift Card?",
        answer:
          "The expiry date for Gift Card amount is 1 year from the day of balance addition to Quickkart Cash.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "How will I receive the Gift Card that I purchased?",
        answer:
          "Once purchased, Gift Card will be sent to your registered email address and mobile number with Gift Card credentials.",
        hasContactFooter: false,
        hasLink: false,
      },
    ],
  },
  {
    id: "no-cost-emi",
    title: "No-Cost EMI",
    order: 5,
    questions: [
      {
        question: "What is EMI?",
        answer:
          "EMI allows you to pay for products in installments with an additional interest as charged by the bank. Quickkart offers this functionality on select products via Credit Cards.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "What is No-Cost EMI?",
        answer:
          "No-Cost EMI allows you to pay for products in installments without additional interest. The bank will continue to charge interest; however, this interest amount is offset by an upfront discount provided to the user while placing the order.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "How do I know if a product has a No-Cost EMI offer?",
        answer:
          'Products with a No-Cost EMI offer will have a "No-Cost EMI" tag displayed on the product detail page and in the cart. If your cart contains products without this offer, those will be processed with standard EMI or excluded from the EMI option.',
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Will I be charged any processing fees?",
        answer:
          "Some banks may charge processing fees. For more details, reach out to your bank.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "What happens if I cancel or return a product purchased with No-Cost EMI?",
        answer:
          "In the event of a return of items purchased under the EMI facility, refunds will be processed on behalf of the sellers as per Quickkart's refund policy. Customers are advised to consult their respective bank/issuer regarding the impact of such returns on the EMI terms including any pre-closure charges or interest adjustments.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "What are some other Terms and Conditions I should be aware of?",
        answer:
          "Quickkart facilitates an Equated Monthly Installments (\"EMI\") payment option for eligible purchases made on its platform using approved payment methods. The availability of the EMI facility is solely at the discretion of the respective banks. Quickkart disclaims any liability for the provision or non-provision of the EMI facility by the banks/issuer.\nApplicable Goods and Services Tax (GST) will be charged on such fees as per prevailing regulations.\nEMI options are subject to approval by the respective bank. Customers must adhere to all terms and conditions specified by the issuing bank for availing of the EMI facility.\nQuickkart reserves the right to withdraw, discontinue, or modify the availability of the EMI or No Cost EMI payment options at any time, without prior notice and without incurring any liability.\nQuickkart shall not be held responsible for any disputes arising from or related to the EMI facility provided/facilitated by the respective banks/issuer pertaining to the accuracy, completeness or authenticity of EMI-related information shared by the banks/issuer and displayed on the Quickkart platform.\nThe EMI facility is facilitated by the issuer/respective banks. Quickkart does not play any role in the approval, pricing, modification, pre-closure or closure of the EMI facility which is entirely at the discretion of the issuing bank.",
        hasContactFooter: false,
        hasLink: false,
      },
    ],
  },
  {
    id: "wallet-related",
    title: "Wallet Related",
    order: 6,
    questions: [
      {
        question: "I am not able to add money to my Quickkart Cash",
        answer:
          "Apologies for the inconvenience caused. Please update the app to the latest version from the App Store or Google Play Store and try again",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "I am not able to see the money refunded to my Quickkart Cash. What should I do?",
        answer:
          "We're sorry for the inconvenience caused. Please update the app to the latest version from the App Store or Google Play Store and check again.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "What is Quickkart Cash?",
        answer:
          "1. Quickkart Cash is a wallet service offered to the customers, which can be used for purchase of Products until expiry.\n\n2. Quickkart Cash is valid for 12 months from the date of issue unless specified a validity period. Quickkart Cash is not refundable.\n\n3. Quickkart Cash can be used in such cities where Quickkart is operating and shall be subject to Platform Terms of Use and applicable laws.\n\n4. You can purchase Quickkart Cash using any available payment methods. You can also redeem Vouchers to add Quickkart Cash into your wallet.\n\n5. Quickkart Cash will be auto-applied on the checkout page when applicable.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "I am unable to use my Quickkart Cash",
        answer:
          "We're really sorry for the experience. Please reach out to us on support@quickkart.com",
        hasContactFooter: false,
        hasLink: false,
      },
    ],
  },
  {
    id: "quickkart-club",
    title: "QuickKart Club",
    order: 7,
    questions: [
      {
        question: "What is Quickkart Club?",
        answer:
          "Quickkart Club is a loyalty membership program that offers selected eligible users enhanced experience which includes benefits such as Q-Coin cashback, certain priority service features, etc.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Is Quickkart Club available to all Users?",
        answer:
          "Currently, participation in Quickkart Club is strictly on an invitation-only basis. User eligibility is determined at the sole and absolute discretion of Quickkart.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "What is the membership fee for Quickkart Club?",
        answer:
          "Quickkart Club membership fee will be clearly displayed on Your account prior to purchase. Please note that the fee is non-refundable, non-transferable, non-exchangeable, and subject to applicable taxes. The membership is User specific and cannot be gifted or transferred to any other User or account.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Is Quickkart Club subscription mandatory?",
        answer:
          "No. Participation and subscription to the Quickkart Club is strictly voluntary. Quickkart Club Users retain the unrestricted right to access the Platform and place orders without participating in Quickkart Club as well.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "How do I sign up for Quickkart Club?",
        answer:
          "If you are eligible, you can sign up for Quickkart Club by accessing Quickkart Club details page via the profile section or other in-app prompts and successfully paying the applicable membership fee.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "What is the validity period of Quickkart Club membership?",
        answer:
          "Quickkart Club membership is valid for thirty (30) days from the date of successful purchase and activation.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "What happens when my Quickkart Club membership expires?",
        answer:
          "Upon expiration, Your fresh Quickkart Club benefits will automatically cease. If Quickkart, at its sole discretion, determines that You are eligible for continued participation in the Quickkart Club for a subsequent term, such eligibility shall be communicated to You directly via Quickkart Club details page through Your profile section. In case, you are eligible for subsequent term, you may start availing fresh Quickkart Club benefits by subscribing to the Program.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Can I cancel my Quickkart Club membership?",
        answer:
          "Yes, You may request to cancel/ terminate Your membership at any time via email. Your cancellation request will be processed and actioned within three (3) business days of receipt. However, please be advised that cancellation does not entitle You to any refund of the membership fee or redemption of any unused benefits.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Can I transfer my membership to someone else?",
        answer:
          "No. Quickkart Club membership is non-transferable and are tied exclusively to the originally registered Quickkart Club User's account.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "What happens in case of misuse or fraud?",
        answer:
          "In cases of suspected fraudulent activity, abuse, or misuse of the program, Quickkart reserves the right to immediately suspend or terminate Your membership and forfeit any accrued benefits without prior notice, in strict accordance with the Quickkart Club Terms and Conditions.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "How do I contact support regarding Quickkart Club?",
        answer:
          'For any queries or assistance, please write to support@quickkart.com with the subject line "Quickkart Club."',
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "Can Quickkart change benefits during my membership?",
        answer:
          "Yes, Quickkart reserves the absolute right to modify, amend, suspend, or withdraw the Quickkart Club program including its benefits, fees, and eligibility criteria at any time. Any such modifications will be updated on the Platform and shall become effective immediately, without individual prior notice.",
        hasContactFooter: false,
        hasLink: false,
      },
    ],
  },
  {
    id: "referral",
    title: "Referral",
    order: 8,
    questions: [
      {
        question: "What is the Referral Program?",
        answer:
          "Quickkart's Referral Program lets you invite people to shop on Quickkart. Your reward gets credited within 24 hours of the qualifying order being successfully delivered and not returned. The user you referred gets a head start with a referral gift for joining with the code & placing an order.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Who can participate ?",
        answer:
          "Any registered eligible Quickkart users with a verified mobile number can participate in the Program. Quickkart reserves the right to determine eligibility at its sole discretion.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Who can I refer?",
        answer:
          "You can refer anyone you think would enjoy shopping on Quickkart. Eligibility for the Referee is determined based on Quickkart's internal policies. The easiest way to check eligibility is to grant Quickkart access to your contact book in the application; eligible contacts will be automatically highlighted to you. You can also refer without granting access to the contact book as well.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Is there a limit on how many people I can refer?",
        answer:
          "You may invite as many people as you like. There is no limit to the number of people you can refer. However, rewards you can receive are limited and capped at the first 10 successful referrals.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "What does the referrer receive?",
        answer:
          "When someone you referred completes a qualifying order you will receive Q-Coins as mentioned at the time of referral. Q-Coins are credited to your account within 24 hours of the Referee's qualifying order being successfully delivered and not returned or cancelled.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "What does the person I refer receive?",
        answer:
          "Referee is eligible to receive a gift upon joining the Quickkart app with your referral code. The gift can be claimed by the Referee on any order within the next 15 days or in the first order itself.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "When will rewards be credited?",
        answer:
          "Q-Coins for Referrer are credited within 24 hours of the qualifying order being successfully delivered and not returned and the Referee can select the gift on any order within the next 15 days or in the first order itself.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Do rewards expire?",
        answer:
          "Yes. Expiry periods are as follows:\na) Referee Gift: valid for 15 days from the date of credit.\nb) Referrer Q-Coins: valid for 2 months from the date of credit.\nExpired rewards cannot be reinstated under any circumstances.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "Can I convert my rewards to cash?",
        answer:
          "No. Gifts and Q-Coins issued under this Program cannot be transferred, encashed, or redeemed outside the Quickkart Platform.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "What is the limited referral event?",
        answer:
          "During a limited referral event, completing a specified number of qualifying referrals unlocks a chance for receiving an aspirational gift and remaining other eligible participants are eligible for the gift as will be displayed on Quickkart App. Selection is randomized and Quickkart's decision is final. This will not be applicable in the state of Tamil Nadu.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "I referred someone but did not receive a reward - why?",
        answer:
          "Common reasons include:\na) The person did not use your specific referral link or was not invited via your contact book.\nb) The person was not eligible under Quickkart's referral conditions.\nc) The order placed by the Referee was cancelled or returned.\nd) Your account was flagged for suspicious or fraudulent activity",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "What counts as a qualifying order?",
        answer:
          "A referral is successful only when: (a) the referred person signs up using your referral link and completes first order upto a minimum order value threshold that is successfully delivered and not cancelled or returned.",
        hasContactFooter: false,
        hasLink: false,
      },
    ],
  },
  {
    id: "coca-cola-campaign",
    title: "Coca Cola campaign",
    order: 9,
    questions: [
      {
        question:
          "How do I participate in the Coca-Cola Match Day Hangout campaign?",
        answer:
          "Purchase any Coca-Cola product on Quickkart between 16 June and 20 July 2026. Once your order is successfully delivered, a scratch card will be available on the order tracking page. Scratch the card and follow the instructions to participate in the campaign. The scratch card code can also be found in the Rewards section of the Quickkart app.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "I purchased a Coca-Cola product but did not receive a scratch card.",
        answer:
          "Your scratch card is unlocked after the successful delivery of any eligible Coca-Cola product purchased during the campaign period. Head to the Rewards section in the Quickkart app to find and scratch your card.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "How do I access the campaign after receiving the scratch card?",
        answer:
          "Scratch your card and tap the link to get started. It will take you directly to the Coca-Cola microsite, where you can follow the steps to participate in the campaign.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "I'm unable to access the scratch card, microsite, or WhatsApp participation flow.",
        answer:
          "We're sorry you're experiencing this issue. The campaign microsite and WhatsApp journey are managed by Coca-Cola. Please contact indiahelpline@coca-cola.com for further assistance.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "How do I know if my participation was successfully recorded?",
        answer:
          "Once the participation process is completed successfully, a confirmation will be shared via WhatsApp and/or email to your registered contact details.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "I completed all the steps but have not received a confirmation.",
        answer:
          "Participation confirmations are shared via WhatsApp and/or email to your registered contact details. If you have completed all the participation steps but have not received a confirmation, please contact indiahelpline@coca-cola.com for further assistance.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question: "How and when will winners be notified?",
        answer:
          "If you're selected as a winner, you'll be notified via WhatsApp and/or email using the contact details provided during participation.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "I was selected but did not receive the WhatsApp notification or YouTube watchalong link.",
        answer:
          "For concerns related to winner notifications, WhatsApp communication, or access to the YouTube watchalong event, please contact indiahelpline@coca-cola.com for further assistance.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "I accidentally deleted the WhatsApp message or cannot find the YouTube link.",
        answer:
          "For assistance related to campaign communications or watchalong access, please contact indiahelpline@coca-cola.com.",
        hasContactFooter: false,
        hasLink: false,
      },
      {
        question:
          "Who should I contact for issues related to the Coca-Cola microsite, WhatsApp journey, lucky draw, or watchalong event?",
        answer:
          "The Coca-Cola microsite, WhatsApp participation journey, lucky draw process, and watchalong event are managed by Coca-Cola. Please contact indiahelpline@coca-cola.com for assistance with these campaign-related issues.",
        hasContactFooter: false,
        hasLink: false,
      },
    ],
  },
];

async function seedFaqs() {
  console.log("Starting FAQ seeding...\n");

  for (const category of FAQ_CATEGORIES) {
    const { id, title, order, questions } = category;
    try {
      await db.collection("faq_categories").doc(id).set({
        title,
        order,
        questions,
      });
      console.log(`✓ Seeded "${title}" (${questions.length} questions)`);
    } catch (err) {
      console.error(`✗ Failed to seed "${title}":`, err.message);
    }
  }

  const totalQuestions = FAQ_CATEGORIES.reduce(
    (sum, c) => sum + c.questions.length,
    0
  );
  console.log(
    `\nDone. ${FAQ_CATEGORIES.length} categories, ${totalQuestions} questions total.`
  );
  process.exit(0);
}

seedFaqs();
