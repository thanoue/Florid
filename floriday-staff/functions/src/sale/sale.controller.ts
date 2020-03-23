const express = require('express');
const saleRouter = express.Router();
const sha256 = require('js-sha256');
import * as adminSdk from '../helper/admin.sdk';

// routes
saleRouter.post('/momoconfirm', momoQRCodeConfirm);

module.exports = saleRouter;

function momoQRCodeConfirm(req: any, res: any) {

    const status = parseInt(req.body.status_code);

    console.log(req.body);

    if (status === 0) {

        // const rawReqSig = `accessKey=${req.body.accessKey}&amount=${req.body.amount}&message=${req.body.message}&momoTransId=${req.body.momoTransId}
        // &partnerCode=${req.body.partnerCode}&partnerRefId=${req.body.partnerRefId}&partnerTransId=${req.body.partnerTransId}
        // &responseTime=${req.body.responseTime}&status=${req.body.status}&storeId=${req.body.storeId}&transType=momo_wallet`;

        // const reqSig = sha256.hmac.create(adminSdk.momoConfig.secretKey).update(rawReqSig).hex();

        // if (!reqSig === req.body.signature) {
        //     res.status(400).send("Authorize error!!!");
        //     return;
        // }


        const rawSignature = `amount=${req.body.amount}&message=${req.body.message}&transaction_id=${req.body.transaction_id}&order_id=${req.body.order_id}&status_code=${status}`;

        const signature = sha256.hmac.create(adminSdk.momoConfig.secretKey).update(rawSignature).hex();

        adminSdk.defauDatabase.ref('momoTrans/' + req.body.order_id).set({
            Id: req.body.order_id,
            MomoTransId: req.body.transaction_id,
            Amount: parseInt(req.body.amount),
            TransType: req.body.order_type,
            ResponseTime: req.body.response_time,
            StoreId: req.body.store_id,
            Status: status,
            OrderInfo: req.body.order_info
        }, (error: any) => {

            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send({
                    status_code: status,
                    message: req.body.message,
                    amount: parseInt(req.body.amount),
                    order_id: req.body.order_id,
                    transaction_id: req.body.transaction_id,
                    signature: signature
                });
            }
        })
    } else {
        res.status(400).send("trans failed");
    }

}

