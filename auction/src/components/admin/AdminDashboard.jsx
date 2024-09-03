import React, { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import Tablecom from "./Tablecom";
import Auctioncard from "../customer/Auctioncard";
import axios from "axios";
import AiData from "./AiData";
const AdminDashboard = () => {
  function checkUserLoggedIn() {
    const token = localStorage.getItem("token");
    let userLoggedIn = false;

    if (token) {
      userLoggedIn = true;
    }

    return userLoggedIn;
  }
  const userLoggedIn = checkUserLoggedIn();

  const navigate = useNavigate();

  const userEmail = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).email
    : "";

  const isAdmin = true;

  const name = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).name
    : "";

  const userimage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).image
    : "";

  const [action, setAction] = useState("");
  const [image, setImage] = useState("");
  const [data, setData] = useState([]);
  const [reprots, setReport] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/auctoin/getallauctoin"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error appropriately
    }
  };

  const fetchReport = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/report");
      setReport(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    if (!userLoggedIn) {
      navigate("/login");
    }
    fetchData();
    fetchReport();
  }, []);

  console.log(data);

  function changeStatus(obj_id, email, trxnid) {
    console.log(obj_id, email, trxnid);
    axios
      .put(`http://localhost:3001/api/auctoin/bid/pay/${obj_id}`, {
        email,
        trxnid,
      })
      .then((response) => {
        console.log("Success:", response.data);
        // Reload the page after the request is successful
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [searchQuery3, setSearchQuery3] = useState("");
  const [searchQuery4, setSearchQuery4] = useState("");

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSearch2 = (event) => {
    setSearchQuery2(event.target.value);
  };
  const handleSearch3 = (event) => {
    setSearchQuery3(event.target.value);
  };
  const handleSearch4 = (event) => {
    setSearchQuery4(event.target.value);
  };

  // Filter data based on the search query
  const filteredData = data?.filter((item) =>
    item.houseName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredData2 = data?.filter((item) =>
    item.houseName.toLowerCase().includes(searchQuery2.toLowerCase())
  );
  const filteredData3 = data?.filter((item) =>
    item.houseName.toLowerCase().includes(searchQuery3.toLowerCase())
  );
  const filteredData4 = reprots?.filter((item) =>
    item.email.toLowerCase().includes(searchQuery4.toLowerCase())
  );

  return (
    <>
      {isAdmin ? (
        <div className="flex flex-col">
          <div className="flex flex-col items-center mt-[100px]">
            <img
              className="rounded-full shadow-sm shadow-gray-800 h-36 w-36"
              src={
                userimage
                  ? ""
                  : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
              }
              alt="profile pic"
            />
            <h1 className="font-bold text-2xl mt-4">Welcome {name}</h1>
            <div className="mt-2 h-0.5 w-[200px] bg-gray-800"></div>
          </div>

          <div className="my-10">
            <div className="flex fle-row gap-4 items-center">
              <h1 className="font-bold text-2xl ml-4">All Auctions</h1>
              <input
                className="border-2 border-gray-800 rounded-md px-2"
                type="search"
                placeholder="Search By House Name"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="mt-2 h-0.5 w-full bg-gray-800"></div>
            <div className="mt-10 mx-4">
              <div className="flex flex-wrap mx-5 mt-10 gap-24 overflow-auto">
                {filteredData?.map((item, index) => (
                  // Conditional rendering based on email match
                  <Auctioncard
                    key={index} // Assuming each item has a unique 'id'. If not, use 'index'.
                    imagelink={item.image}
                    houseName={item.houseName}
                    details={`${item.modelYear} ${item.modelName}, ${item.details}`}
                    startbid={item.startingPrice}
                    id={item._id}
                    placebid={false}
                    // timer={/* logic to calculate remaining time based on item.auctionEndTime */}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="my-10 md:w-auto w-auto ">
            <div className="flex fle-row gap-4 items-center w-auto">
              <h1 className="font-bold text-2xl ml-4">All Bids</h1>
              <input
                className="border-2 border-gray-800 rounded-md px-2"
                type="search"
                placeholder="Search By House Name"
                value={searchQuery2}
                onChange={handleSearch2}
              />
            </div>
            <div className="mt-2 h-0.5 md:w-full bg-gray-800"></div>
            <div className="mt-10 mx-4">
              <table>
                <thead>
                  <tr>
                    <th className="bg-gray-800 text-white text-center rounded-md">
                      ID
                    </th>
                    <th className="bg-gray-800 text-white text-center rounded-md">
                      House Name
                    </th>
                    <th className="hidden md:table-cell bg-gray-800 text-white text-center rounded-md">
                      Owner
                    </th>
                    <th className="hidden md:table-cell bg-gray-800 text-white text-center rounded-md">
                      Bidder
                    </th>
                    <th className="bg-gray-800 text-white text-center rounded-md">
                      Bid Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData2?.map((item1) =>
                    item1.bidders?.map((item2, index) => (
                      <tr>
                        <td>1</td>
                        <td>{item1.houseName}</td>
                        <td className="hidden md:table-cell">{item1.email}</td>
                        <td className="hidden md:table-cell">
                          {item2.bidderEmail}
                        </td>
                        <td>{item2.bidAmount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="my-10">
            <div className="flex fle-row gap-4 items-center">
              <h1 className="font-bold text-2xl ml-4">All Payments</h1>
              <input
                className="border-2 border-gray-800 rounded-md px-2"
                type="search"
                placeholder="Search By House Name"
                value={searchQuery3}
                onChange={handleSearch3}
              />
            </div>
            <div className="mt-2 h-0.5 w-full bg-gray-800"></div>
            <div className="mt-10 mx-4">
              <table>
                <thead>
                  <tr>
                    <th className="bg-gray-800 text-white text-center rounded-md">
                      ID
                    </th>
                    <th className="hidden md:table-cell bg-gray-800 text-white text-center rounded-md">
                      House Name
                    </th>
                    <th className="hidden md:table-cell bg-gray-800 text-white text-center rounded-md">
                      Owner
                    </th>
                    <th className="hidden md:table-cell bg-gray-800 text-white text-center rounded-md">
                      Bidder
                    </th>
                    <th className="bg-gray-800 text-white text-center rounded-md">
                      Bid Amount
                    </th>
                    <th className="bg-gray-800 text-white text-center rounded-md">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData3?.map((item1) =>
                    item1.bidders?.map(
                      (item2, index) =>
                        item2.payment === false && (
                          <tr>
                            <td>1</td>
                            <td className="hidden md:table-cell">
                              {item1.houseName}
                            </td>
                            <td className="hidden md:table-cell">
                              {item1.email}
                            </td>
                            <td className="hidden md:table-cell">
                              {item2.bidderEmail}
                            </td>
                            <td>{item2.bidAmount}</td>
                            <td className="flex flex-row items-center justify-around">
                              <button
                                className="rounded shadow-sm bg-teal-600 hover:bg-teal-800"
                                value={"approve"}
                                onClick={() =>
                                  changeStatus(
                                    item1._id,
                                    item2.bidderEmail,
                                    item2.bidtrnx
                                  )
                                }
                              >
                                Approve
                              </button>
                            </td>
                          </tr>
                        )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="my-10">
            <div className="flex fle-row gap-4 items-center">
              <h1 className="font-bold text-2xl ml-4">All Reports</h1>
              <input
                className="border-2 border-gray-800 rounded-md px-2"
                type="search"
                placeholder="Search By Email"
              />
            </div>
            <div className="mt-2 h-0.5 w-full bg-gray-800"></div>
            <div className="mt-10 mx-4">
              <table>
                <thead>
                  <tr>
                    <th className="bg-gray-800 text-white text-center rounded-md">
                      ID
                    </th>
                    <th className="bg-gray-800 text-white text-center rounded-md">
                      Name
                    </th>
                    <th className="bg-gray-800 text-white text-center rounded-md">
                      Email
                    </th>
                    <th className="bg-gray-800 text-white text-center rounded-md">
                      Issue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData4?.map((item) => (
                    <tr>
                      <td>1</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="my-10">
            <h1 className="font-bold text-2xl ml-4">Generate Report</h1>
            <div className="ml-4 mt-4">
              <AiData />
            </div>
          </div>
        </div>
      ) : (
        <h1>You are not an admin</h1>
      )}
    </>
  );
};

export default AdminDashboard;