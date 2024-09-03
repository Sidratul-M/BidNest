import React, { useState, useEffect } from "react";
import axios from "axios";
import OpenAI from "openai";

const AiData = () => {
  const [data, setData] = useState([]);
  const [searchQuery2, setSearchQuery2] = useState("");
  const [response, setResponse] = useState("");
  const [command, setCommand] = useState("");

  const llm = new OpenAI({
    apiKey: "cf1dd8aa9641b9278d212c4e1e7c2b645c2629fcdbd63507c3a74e7875f90e63",
    baseURL: "https://api.together.xyz/v1",
    dangerouslyAllowBrowser: true,
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/auctoin/getallauctoin"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCommand = async () => {
    const newCommand = command + ". Do not write anything extra.";
    try {
      const response = await llm.chat.completions.create({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",

        messages: [
          { role: "user", content: newCommand },
          { role: "assistant", content: JSON.stringify(data) }, // Pass the fetched data as context
        ],
      });

      if (response.choices && Array.isArray(response.choices)) {
        const firstChoice = response.choices[0].message.content;
        // console.log(response.choices[0].message.content);
        setResponse(firstChoice);
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      alert(error);
      console.error("Error processing command:", error);
    }
  };

  const filteredData2 = data?.filter((item) =>
    item.houseName.toLowerCase().includes(searchQuery2.toLowerCase())
  );

  return (
    <div>
      <div className="mt-10 mx-4">
        <div className="flex flex-row gap-4">
          <input
            className="border-2 border-slate-800 rounded-lg overflow-auto w-[40rem]"
            type="text"
            placeholder="Enter a command..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          />
          <button className="rounded-lg bg-slate-800" onClick={handleCommand}>
            Submit
          </button>
        </div>
        <h1 className="my-10 text-xl text-semibold">{response}</h1>
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
                  <td className="hidden md:table-cell">{item2.bidderEmail}</td>
                  <td>{item2.bidAmount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AiData;