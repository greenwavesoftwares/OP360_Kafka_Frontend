import { Link, useNavigate } from "react-router-dom";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import BackHandIcon from "@mui/icons-material/BackHand";
import ReplyIcon from "@mui/icons-material/Reply";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import notfoundimg from "./page404.png"
import { useEffect } from "react";
import { Button, Result, Space } from "antd";

const NotFound = () => {
  const navigate=useNavigate();
  // useEffect(()=>{
  //   localStorage.clear()
  // },[])
  return (
    <>
      {/* <br />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.4rem",
        }}
      >
        <Link
          to="/"
          style={{
            margin: "10px",
            padding: "10px 20px",
            textAlign: "center",
            // fontSize: "1rem",
            transition: "0.5s",
            backgroundSize: "200% auto",
            color: "white",
            borderRadius: "10px",
            display: "block",
            border: "0px",
            fontWeight: "700",
            boxShadow: "0px 0px 14px -7px #f09819",
            backgroundImage:
              "linear-gradient(45deg, #FF512F 0%, #F09819 51%, #FF512F 100%)",
            cursor: "pointer",
            userSelect: "none",
            WebkitUserSelect: "none",
            touchAction: "manipulation",
          }}
        >
          <ReplyIcon fontSize="small" />
          Back to Login Page
        </Link>
      </div>

      <div
        id="not-found"
        style={{
          display: "grid",
          justifyContent: "center",
          alignItems: "center",
          rowGap: "2rem",
        }}
      >
        <br />
        <img
          src={notfoundimg}
          alt="404page"
          style={{ height: "400px", width: "400px" }}
        ></img>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.4rem",
          }}
        >
          <FindInPageIcon /> &nbsp; Page not Found
        </div>
        <center>
          <br />
        </center>
      </div> */}
      <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Space >
          <Button type="primary" onClick={()=>navigate("/")}>Back Home</Button>
          <Button type="primary" onClick={()=>navigate(-1)}>Go Back</Button>
          </Space>
          }
        />
    </>
  );
};

export default NotFound;
