
import HeaderBox from '@/components/Headerbox';
import PaymentTransferForm from '@/components/PaymentTransferForm';
import { createTransfer } from '@/lib/actions/transactions.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const page = async() => {

  const loggedIn = await getLoggedInUser();

  // const trans = await createTransfer({
  //   senderEmail: loggedIn.email,
  //   receiverEmail: 'email.dev@mail.com',
  //   amount: "1000"
  // })
  return (
    <section className='payment-transfer'>
      <HeaderBox 
      title='Payment Transfer'
      subtext='Please provide specific details to payment transfer '
      />

      <section className='size-full pt-5'>
        <PaymentTransferForm />
      </section>
    </section>
  )
}

export default page