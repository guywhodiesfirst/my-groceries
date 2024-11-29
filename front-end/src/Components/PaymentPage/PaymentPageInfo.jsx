import PaymentDetailsSection from '../AccountPage/PaymentDetailsSection';
import './PaymentPage.css';

export default function PaymentPageInfo({user}) {
  return (
    <div className='order-payment-details'>
      <p><span className='order-payment-details--p'>Payment method:</span> {user.paymentMethod}</p>
      {user.paymentMethod == "card" && 
      <>
        <p><span className='order-payment-details--p'>Card number:</span> {user.cardNumber}</p>
        <p><span className='order-payment-details--p'>Card expiry date:</span> {user.cardDate}</p>
        <p><span className='order-payment-details--p'>CVV:</span> {user.cardCVV}</p>
      </>}
      <p><span className='order-payment-details--p'>Delivery method:</span> {user.deliveryMethod}</p>
      <p><span className='order-payment-details--p'>Delivery place:</span> {user.deliveryPlace}</p>
    </div>
  );
}