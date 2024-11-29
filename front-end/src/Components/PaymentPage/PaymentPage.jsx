import { useContext } from 'react';
import './PaymentPage.css';
import { Context } from '../../App';
import PaymentPageInfo from './PaymentPageInfo';
import { CartApi } from '../../api/CartApi';

export default function PaymentPage() {
  const { user } = useContext(Context);

  const areAllFieldsFilled = () => {
    if (!user.deliveryMethod || !user.deliveryPlace)
      return false;
    if (!user.paymentMethod) 
      return false;    
    if (user.paymentMethod === "card" && !areCardDetailsFilled())
      return false;

    return true;
  };

  const handleConfirmPayment = async (e) => {
      try {
        const orderDetails = {
          deliveryMethod: user.deliveryMethod,
        }

        if (user.paymentMethod === 'card') {
          orderDetails.cardDetails = {
            cardNumber: user.cardNumber,
            cardDate: user.cardDate,
            cardCVV: user.cardCVV
          }
        }
        const response = await CartApi.confirmPayment({
          deliveryAddress: user.deliveryPlace, 
          paymentMethod: user.paymentMethod, 
          orderDetails: orderDetails
        })
        if (response.error) {
          alert(response.message);
        } else {
          alert("Замовлення підтверджено! Перевірте електронну пошту");
      }
      } catch(error) {
        alert(error.message)
      }
  }

  const areCardDetailsFilled = () => {
    return user.cardCVV && user.cardNumber && user.cardDate
  };
  
  if (!user) {
    return <p>Please, sign into your account</p>
  }
  return (
    <>
      {
        areAllFieldsFilled() ? (
          <div className='order-summary'>
            <PaymentPageInfo user={user} />
            <button className='btn' onClick={handleConfirmPayment}>Confirm payment</button>
          </div>
        ) : (
          <p>Please, clarify payment method and delivery method in your personal cabinet</p>
        )
      }
    </>
  );
}
