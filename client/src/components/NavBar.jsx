import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notifications from "./Game/Notifications";

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <Navbar bg="light" variant="light" className="mb-4" style={{ height: "3.75rem", borderBottom: "1px solid rgb(200, 200, 200)" }}>
      <Container>
        <h2>
          <Link to="/" className="text-dark text-decoration-none">
            GameApp
          </Link>
        </h2>
        {user && <span className="text-warning">Logged in as {user.name}</span>}
        <Nav>
          <Stack direction="horizontal" gap={3}>
            {!user && (
              <>
                <Link to="/login" className="text-dark text-decoration-none">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-dark text-decoration-none"
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <>
                <Notifications />
                <Link
                  onClick={() => logoutUser()}
                  to="/login"
                  className="text-dark text-decoration-none"
                >
                  Logout
                </Link>
              </>
            )}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
