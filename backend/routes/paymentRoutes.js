const express = require("express");
const router = express.Router();

const itemController = require("../controller/paymentContrtoller");



router.post("/create-payment/:id", itemController.stipePyament);

router.get("/test",itemController.test);



//after testing remove this part 

// id = object id of the auction 
// body = {
//     "amount":10000,
//     "email":"ex@gmail",
//     "bidderName":"exam"
// }

// api test : http://localhost:3001/api/payment/create-payment/:id
// it returns 
// updated object of acction and in backend it updates the db 


module.exports = router;
