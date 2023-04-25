const express = require("express");
const router = express.Router();

const { v4: uuidv4 } = require('uuid')



const stripe = require("stripe")("sk_test_51MypM6SDCUqbhCRGVKW9KuAz1ZwuzRdptlx1p90i9F79eE26fFRMfcYx5KR8BXXxp3rL1l8hzvOOznZCeEtGJQJj004qa9AqiQ")

const Order = require('../models/orderModel')

router.post("/placeorder", async (req, res) => {

    const { token, subtotal, currentUser, cartItems } = req.body

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })


        const paymentIntent = await stripe.paymentIntents.create({
            amount: subtotal * 100,
            currency: "INR",
            customer: customer.id,
            receipt_email: token.email,
            automatic_payment_methods : {enabled: true}
        }, {
            idempotencyKey: uuidv4()
        })

        if (paymentIntent) {
            //message : "Something went wrongError: You cannot accept payments using this API as it is no longer supported in India. Please refer to https://stripe.com/docs/payments for accepting payments."


            const newOrder = new Order({
                name: currentUser.names,
                email: currentUser.email,
                userid: currentUser._id,
                orderItems: cartItems,
                orderAmount: subtotal,
                shippingAddress: {
                    address: token.card.address_line1,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    pincode: token.card.address_zip


                },
                transactionId: paymentIntent.source.id
            })

            newOrder.save()
            res.send('Order placed successfully')
        }
        else {
            res.send('Payment failed')
        }

    } catch (error) {

        return res.status(400).json({ message: 'Something went wrong' + error })


    }

});

router.post("/getuserorders", async (req, res) => {
    const { userid } = req.body

    try {
        const orders = await Order.find({ userid: userid }).sort({ _id: -1 })
        res.send(orders)


    } catch (error) {
        return res.status(400).json({ message: "Something went wrong" })

    }
});

module.exports = router

