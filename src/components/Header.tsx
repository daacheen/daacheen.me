import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink as ReactstrapNavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from "reactstrap";
import { Link } from "gatsby";
import * as React from "react";
import Icon from "../../assets/logo.svg";
import styled from "styled-components";
import { widths } from "../styles/variables";
import Container from "./Container";

interface Props {
  title: string;
}

interface State {
  isOpen: boolean;
}

function NavLink(props: {to: string, children: React.ReactNode}) {
  return <Link to={props.to} className="nav-link">
      {props.children}
  </Link>;
}

const StyledLogo = styled(Icon)`
  width: 42px;
  height: 42px;
  margin-right: 8px;
`;

function Branding(props: {title: string}) {
  return <Link to={"/"} className={"navbar-brand"}>
      <StyledLogo/>
    {props.title}
  </Link>;
}

const NavbarDiv = styled.div`
  background-color: #303030;
  
  & > *{ 
    max-width: ${widths.xl}px;
    margin-left: auto;
    margin-right: auto;
  }
`;

export default class Header extends React.PureComponent<Props, State> {

  state = {
    isOpen: false,
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    return <NavbarDiv>
      <Navbar color="light" light={true} expand="md" >
        <Branding title={this.props.title}/>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar={true}>
          <Nav className="ml-auto" navbar={true}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about/project">About Website</NavLink>
            <NavLink to="/about/me">About Me</NavLink>
            <ReactstrapNavLink target="__blank" href="https://github.com/viccrubs">
              GitHub
            </ReactstrapNavLink>
          </Nav>
        </Collapse>
        </Navbar>
    </NavbarDiv>;
  }

}
