import { placeholderImage, t } from '@/utils';
import { Modal } from 'antd';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaAngleRight } from 'react-icons/fa6';
import { MdClose } from 'react-icons/md';
import stripe from '../../../../public/assets/ic_stripe.png';
import razorpay from '../../../../public/assets/ic_razorpay.png';
import paystack from '../../../../public/assets/ic_paystack.png';
import useRazorpay from 'react-razorpay';
import { useRouter } from 'next/navigation';
// import PaystackPop from '@paystack/inline-js';
import toast from 'react-hot-toast';
import { createPaymentIntentApi } from '@/utils/api';
import { loadStripe } from '@stripe/stripe-js';

import { Elements, ElementsConsumer, elements } from '@stripe/react-stripe-js'; // Corrected line
import { CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_test_51OXHuyBvoXuMhOgsDDsPnkhDar7xywK5RD07QoxNHgwk0jgV16C7QTp3CcgZRCwWWaPtQYvtc1I116eEC0giEqcT00CXsDq9e1");

const PaymentModal = ({ isPaymentModal, OnHide, packageSettings, priceData, settingsData, user }) => {
    const router = useRouter();
    const PayStackActive = packageSettings?.Paystack;
    const RazorPayActive = packageSettings?.Razorpay;
    const StripeActive = packageSettings?.Stripe;

    const [showStripeForm, setShowStripeForm] = useState(false);
    const [clientSecret, setClientSecret] = useState("");

    const PaymentModalClose = () => {
        OnHide()
        setShowStripeForm(false)
    }
    useEffect(() => {
    }, [showStripeForm, clientSecret])

    const CloseIcon = <div className="close_icon_cont"><MdClose size={24} color="black" /></div>;
    // const [stripeModal, setStripeModal] = useState(false);

    const handleOpenStripeModal = () => {
        setShowStripeForm(true)
    }
    const [Razorpay, isLoaded] = useRazorpay();
    let rzpay; // Define rzpay outside the function

    const PayWithRazorPay = useCallback(async () => {
        try {
            const res = await createPaymentIntentApi.createIntent({ package_id: priceData.id, payment_method: RazorPayActive.payment_method });

            if (res.data.error) {
                throw new Error(res.data.message);
            }

            const paymentIntent = res.data.data.payment_intent;
            const paymentTransaction = res.data.data.payment_transaction;

            const options = {
                key: RazorPayActive.api_key,
                name: settingsData.company_name,
                description: settingsData.company_name,
                image: settingsData.company_logo,
                order_id: paymentIntent.id,
                handler: function (response) {
                    router.push("/");
                    toast.success(t('paymentSuccess'));
                    if (rzpay) {
                        rzpay.close(); // Close the Razorpay payment modal
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.mobile,
                },
                notes: {
                    address: user.address,
                    user_id: user.id,
                    package_id: priceData.id,
                },
                theme: {
                    color: settingsData.web_theme_color,
                },
            };

            rzpay = new Razorpay(options); // Assign rzpay outside the function

            rzpay.on('payment.failed', function (response) {
                console.error(response.error.description);
                toast.error(response.error.description);
                if (rzpay) {
                    rzpay.close(); // Close the Razorpay payment modal
                }
            });

            rzpay.on('payment.modal.closed', function () {
                toast(t('paymentMClose'));
            });

            rzpay.open();
        } catch (error) {
            console.error("Error during payment", error);
            toast.error(t("errorProcessingPayment"));
        }
    }, [RazorPayActive, priceData, settingsData, user, router]);


    const paymentReferenceRef = useRef(null);
    const paymentPopupRef = useRef(null);

    const handlePayStackPayment = useCallback(async () => {
        try {
            const res = await createPaymentIntentApi.createIntent({ package_id: priceData.id, payment_method: PayStackActive.payment_method });

            if (res.data.error) {
                throw new Error(res.data.message);
            }

            const paymentIntent = res.data.data.payment_intent;
            const authorizationUrl = paymentIntent?.payment_gateway_response?.data?.authorization_url;
            const reference = paymentIntent?.payment_gateway_response?.data?.reference;

            paymentReferenceRef.current = reference;

            if (authorizationUrl) {
                const popupWidth = 600;
                const popupHeight = 700;
                const popupLeft = (window.innerWidth / 2) - (popupWidth / 2);
                const popupTop = (window.innerHeight / 2) - (popupHeight / 2);

                const paymentPopup = window.open(authorizationUrl, 'paymentWindow', `width=${popupWidth},height=${popupHeight},top=${popupTop},left=${popupLeft}`);
                paymentPopupRef.current = paymentPopup;

                const handleUrlChange = () => {
                    const currentUrl = window.location.href;
                    const reference = paymentReferenceRef.current;

                    if (currentUrl.includes(`success?reference=${reference}`)) {
                        toast.success(t("paymentSuccessfull"));
                        PaymentModalClose();
                        paymentPopup.close();
                        router.push('/');
                    } else if (currentUrl.includes(`cancel?reference=${reference}`)) {
                        toast.error(t("paymentCancelled"));
                        PaymentModalClose();
                        paymentPopup.close();
                    } else if (currentUrl.includes(`error?reference=${reference}`)) {
                        toast.error(t("paymentFailed"));
                        PaymentModalClose();
                        paymentPopup.close();
                    }
                };

                window.addEventListener('popstate', handleUrlChange);

                return () => {
                    window.removeEventListener('popstate', handleUrlChange);
                };
            } else {
                throw new Error("Unable to retrieve authorization URL.");
            }
        } catch (error) {
            console.error("An error occurred while processing the payment:", error);
            toast.error(t("errorOccurred"));
        }
    }, [PayStackActive, priceData, user, router, OnHide]);


    const handleStripePayment = useCallback(async () => {
        try {
            const res = await createPaymentIntentApi.createIntent({ package_id: priceData.id, payment_method: StripeActive.payment_method });
            if (res.data.error) {
                throw new Error(res.data.message);
            }
            const paymentIntent = res.data.data.payment_intent?.payment_gateway_response;
            const clientSecret = paymentIntent.client_secret;
            setClientSecret(clientSecret)
            handleOpenStripeModal()

        } catch (error) {
            console.error("Error during Stripe payment", error);
            toast.error(t("errorOccurred"));
        }
    }, [StripeActive, priceData, showStripeForm]);

    // Define PaymentForm component to handle Stripe payment
    const PaymentForm = ({ elements }) => {
        const handleSubmit = async (event) => {
            event.preventDefault();

            // Retrieve Stripe instance from stripePromise
            const stripe = await stripePromise;

            // Create payment method using CardElement
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
            });

            // Handle payment response
            if (error) {
                // Handle error here
            } else {
                try {
                    // Confirm the payment with the client secret
                    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                        payment_method: paymentMethod.id,
                    });

                    if (confirmError) {
                        // Handle confirm error here
                    } else {
                        if (paymentIntent.status === 'succeeded') {
                            // Payment successful
                            toast.success(t("paymentSuccess"))
                            PaymentModalClose()
                            router.push('/')
                            // Handle successful payment here
                        } else {
                            // Payment failed
                            toast.error(t('paymentfail ' + paymentIntent.status));
                            // Handle failed payment here
                        }
                    }
                } catch (error) {
                    console.error('Error during payment:', error);
                    // Handle general error here
                }
            }
        };



        return (
            <form onSubmit={handleSubmit}>
                <div className="stripe_module">
                    <CardElement />
                    <button className='stripe_pay' type="submit" disabled={!stripePromise}>
                        {t('pay')}
                    </button>
                </div>
            </form>
        );
    };


    return (
        <>
            <Modal
                centered
                open={isPaymentModal}
                closeIcon={CloseIcon}
                colorIconHover='transparent'
                className="ant_payment_modal"
                onCancel={PaymentModalClose}
                footer={null}
                maskClosable={false}
            >
                <div className="payment_section">
                    {showStripeForm ? (
                        <div className="card">
                            <div className="card-header">
                                {t('payWithStripe')} :
                            </div>
                            <div className="card-body">
                                <Elements stripe={stripePromise} client_key={StripeActive?.api_key} >
                                    <ElementsConsumer>
                                        {({ stripe, elements }) => (
                                            <PaymentForm elements={elements} stripe={stripe} />
                                        )}
                                    </ElementsConsumer>
                                </Elements>
                            </div>
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-header">
                                <span>
                                    {t('paymentWith')}
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {StripeActive?.status === 1 &&
                                        <div className="col-12">
                                            <button onClick={handleStripePayment}>
                                                <div className="payment_details">
                                                    <Image loading='lazy' src={stripe} onEmptiedCapture={placeholderImage} />
                                                    <span>
                                                        {t('stripe')}
                                                    </span>
                                                </div>
                                                <div className="payment_icon">
                                                    <FaAngleRight size={18} />
                                                </div>
                                            </button>
                                        </div>
                                    }
                                    {RazorPayActive?.status === 1 &&
                                        <div className="col-12">
                                            <button onClick={PayWithRazorPay}>
                                                <div className="payment_details">
                                                    <Image loading='lazy' src={razorpay} onEmptiedCapture={placeholderImage} />
                                                    <span>
                                                        {t('razorPay')}
                                                    </span>
                                                </div>
                                                <div className="payment_icon">
                                                    <FaAngleRight size={18} />
                                                </div>
                                            </button>
                                        </div>
                                    }
                                    {PayStackActive?.status === 1 &&
                                        <div className="col-12">
                                            <button onClick={handlePayStackPayment}>
                                                <div className="payment_details">
                                                    <Image loading='lazy' src={paystack} onEmptiedCapture={placeholderImage} />
                                                    <span>
                                                        {t('payStack')}
                                                    </span>
                                                </div>
                                                <div className="payment_icon">
                                                    <FaAngleRight size={18} />
                                                </div>
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default PaymentModal;
