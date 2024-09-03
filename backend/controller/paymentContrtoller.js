
const Auction = require("../models/auction");

const key =
  "sk_test_51NuinfBn5he3qegRfz7n3nvdgPmbXLney6t0GeAzzk2PvSKy8FZn15xV4iP6b0eOnwA66rbocq5bhtPi2TCYLsLh009Ate8hZS";

const stripe = require("stripe")(key);


exports.test = async (req,res) => {
  res.status(200).json({
    message : "working"
  })
}

exports.stipePyament = async (req, res) => {
  const { amount,email, bidderName, } = req.body;
  const auctionId = req.params.id;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    data = paymentIntent;

    amountPaid = paymentIntent.amount;

    if (amountPaid >= 1000) {
  
      const updatedAuction = await Auction.findByIdAndUpdate(
        auctionId,
        {
          $push: {
            bidders: {
              bidderName,
              amount,
              bidtrnx: data.id,
              bidderEmail: email,
              paymentData: data,
              payment: true
            },
          },
        },
        { new: true } // Returns the updated document
      );

      if (!updatedAuction) {
        return res.status(404).send("Auction not found");
      }


      res.status(200).json(updatedAuction);
      
    } else {
      res.status(400).send("insufficient amount");
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
