import { useState } from "react";

export default function Login() {
  
    const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const basicAuth = "Basic " + btoa(userName + ":" + password);

    await fetch("localhost:8089/login", {
      method: "GET",
      headers: {
        Authorization: basicAuth,
        "Content-Type": "application/json",
      },
    }).then(resp => console.log(resp));
  };

  return (
    <div>
      <form className="form-signin" method="post" action="/login">
        <h2 className="form-signin-heading">Please sign in</h2>
        {/* <div className="alert alert-danger" role="alert">
          Invalid credentials
        </div>{" "} */}
        <p>
          <label for="username" className="sr-only">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            placeholder="Username"
            required
            autofocus
            onChange={(event) => setUserName(event.target.value)}
          />
        </p>
        <p>
          <label for="password" className="sr-only">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="Password"
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </p>
        <input
          name="_csrf"
          type="hidden"
          value="N80UDWtSBitz__pEfh3LQqyoY6L7chwFzcOfGdrqW63-QjcUAvotOw5qNklexp4iSDD_dJ-fTsPCSngoq_WtKe2PYp7HclJw"
        />
        <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={login}>
          Sign in
        </button>
      </form>
    </div>
  );
}
