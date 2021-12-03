import styled from "styled-components";

const Foo = styled.div`
  height: 100px;
  width: 100%;
  background-color: ${(props) => props.theme.black.darker};
  display: flex;
  position: static;
  justify-content: center;
  align-items: center;
`;

function Footer() {
  return <Foo>Nomflix</Foo>;
}

export default Footer;
