// import axios from "axios";
// import { base_url } from "./base_url";

// export const ApiCall = async (
//   method,
//   endPoint,
//   data = {},
// ) => {
//   // let token = localStorage.getItem("User");

//   try {
//     const res = await axios({
//       method: method,
//       url: `${base_url}${endPoint}`,
//       data: data,
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,
//       },
//     });

//     console.log(res);

//     return {
//       status: res?.status,
//       data: res.data?.data,
//       message: res.data?.message || "",
//     };
//   } catch (error) {
//     console.error("API Error:", error.response);
//     throw error.response.data.message;
//   }
// };

import axios from "axios";
import { base_url } from "./base_url";

export const ApiCall = async (method, endPoint, data) => {
  console.log("base_url", base_url);
  try {
    const token = localStorage.getItem("User");

    const response = await axios({
      method: method,
      url: `${base_url}${endPoint}`,
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("responseapicall", response);

    return {
      status: response?.status,
      data: response?.data,
      message: response?.data?.message || "",
    };
  } catch (error) {
    console.error("API Error:", error);

    // Handle specific error scenarios, if needed
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        status: error.response.status,
        data: null,
        message: error.response.data.message || "Server Error",
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        status: 500,
        data: null,
        message: "No response from server",
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        status: 500,
        data: null,
        message: "Request setup error",
      };
    }
  }
};
