const Auction = require("../models/auction");

const createAuction = async (req, res) => {
  try {
    const newAuction = new Auction({
      email: req.body.email,
      houseName: req.body.houseName,
      modelName: req.body.modelName,
      modelYear: req.body.modelYear,
      startingPrice: req.body.startingPrice,
      date: req.body.date,
      details: req.body.details,
      image: req.body.image,
      auctionStartTime: req.body.auctionStartTime,
      auctionEndTime: req.body.auctionEndTime,
    });

    const auction = await newAuction.save();

    res.status(200).send({
      message: "Auction created successfully!",
      auction,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({}).sort({ timestamp: -1 });
    res.send(auctions);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAuctionById = async (req, res) => {
  const email = req.params.email;
  try {
    const auction = await Auction.find({ email });
    res.send(auction);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findOne({ _id: req.params.id });

    if (auction) {
      auction.houseName = req.body.houseName;
      auction.modelName = req.body.modelName;
      auction.modelYear = req.body.modelYear;
      auction.startingPrice = req.body.startingPrice;
      auction.date = req.body.date;
      auction.details = req.body.details;
      auction.image = req.body.image;
      auction.auctionStartTime = req.body.auctionStartTime;
      auction.auctionEndTime = req.body.auctionEndTime;

      const updatedAuction = await auction.save();

      res.send({
        message: "Auction updated successfully!",
        auction: updatedAuction,
      });
    } else {
      res.status(404).send({
        message: "This Auction not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteAuction = async (req, res) => {
  try {
    await Auction.deleteOne({ _id: req.params.id });

    res.status(200).send({
      message: "Auction deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

//////////////////////////////////////
const endAuction = async (req, res) => {
  const auctionId = req.params.id;

  try {
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).send("Auction not found");
    }

    // Notify all bidders that the auction has ended
    const notificationPromises = auction.bidders.map(bidder => {
      const notification = new Notification({
        userEmail: bidder.bidderEmail,
        message: `The auction for ${auction.houseName} has ended.`,
        type: 'auctionEnd'
      });

      return notification.save();
    });

    await Promise.all(notificationPromises);

    res.status(200).json({ message: 'Auction ended and notifications sent.' });
  } catch (error) {
    res.status(500).send("Server Error: " + error.message);
  }
};


//////////////////////////////////////

const Notification = require("../models/Notification");

const bidAuctionbyId = async (req, res) => {
  const auctionId = req.params.id;
  const { email, trxnid, bidderName, bidAmount } = req.body;

  try {
    const updatedAuction = await Auction.findByIdAndUpdate(
      auctionId,
      {
        $push: {
          bidders: {
            bidderName,
            bidAmount,
            bidtrnx: trxnid,
            bidderEmail: email,
          },
        },
      },
      { new: true }
    );

    if (!updatedAuction) {
      return res.status(404).send("Auction not found");
    }

    // Create a notification for the auction owner
    const notification = new Notification({
      userEmail: updatedAuction.email, // Auction owner's email
      message: `${bidderName} placed a bid of $${bidAmount} on your auction: ${updatedAuction.houseName}.`,
      type: 'bid'
    });

    await notification.save();

    res.status(200).json(updatedAuction);
  } catch (error) {
    res.status(500).send("Server Error: " + error.message);
  }
};

const bidpayId = async (req, res) => {
  const auctionId = req.params.id; // Extract auction ID from URL
  const { trxnid, email } = req.body; // Extract bidder transaction ID and email from request body

  try {
    // Find the auction document by ID
    let auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).send("Auction not found");
    }

    // Find the bidder and update payment status
    const bidderIndex = auction.bidders.findIndex(
      (bidder) => bidder.bidtrnx === trxnid && bidder.bidderEmail === email
    );
    if (bidderIndex === -1) {
      return res.status(404).send("Bidder not found");
    }

    auction.bidders[bidderIndex].payment = true; // Update payment status to true

    // Save the updated auction
    const updatedAuction = await auction.save();

    // Send the updated auction data as a response
    res.status(200).json(updatedAuction);
  } catch (error) {
    // Handle any errors
    res.status(500).send("Server Error: " + error.message);
  }
};

const bidpayStripe = async(req,res) =>{
  
}

module.exports = {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
  bidAuctionbyId,
  bidpayId,
  bidpayStripe,
  endAuction
};
