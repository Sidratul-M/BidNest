const express = require("express");
const router = express.Router();
const {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
  bidAuctionbyId,
  bidpayStripe,
  endAuction,
  approveBidoveBid
} = require("../controller/auctionController");

// create auction
router.post("/createauction", createAuction);

// get all auctions
router.get("/getallauctoin", getAllAuctions);

// get a specific auction by ID
router.get("/:email", getAuctionById);

// update an auction by ID
router.put("/:id", updateAuction);

router.put("/bid/:id", bidAuctionbyId);

router.post("/bid/pay/stripe/:id", bidpayStripe);

router.post('/endAuction/:id', endAuction); // Assuming you use `id` to identify the auction


// delete an auction by ID
router.delete("/:id", deleteAuction);

module.exports = router;
