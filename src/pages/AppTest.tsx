import axios from "axios";
import { useEffect, useState } from "react";

const AppTest = () => {
  const [text, setText] = useState<string>();

  useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = () => {
    // axios
    //   .get(`api/test`, { withCredentials: true })
    //   .then((res) => {
    //     setText(res.data);
    //   })
    //   .catch((err) => {
    //     console.log("err", err);
    //   });
    axios
      .post(`api/test`, { name: "gregergrgrg" }, { withCredentials: true })
      .then((res) => {
        setText(res.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return <div>{text || "-"}</div>;
};

export default AppTest;
