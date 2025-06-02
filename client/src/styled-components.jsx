import styled from "styled-components";
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @media print {
    body * {
      display: none !important;
    }
    #print-area, #print-area * {
      visibility: visible !important;
      display: block !important;
    }
    #print-area {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      color: black;
      padding: 20px;
      font-size: 1.2rem;
    }
  }
`;

export const Container = styled.div`
  min-height: 100vh;
  background-color: rgb(49, 43, 43);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-height: 720px) {
    overflow-y: scroll;
    overflow-x: hidden;
  }
`;

export const Title = styled.h1`
  font-size: 5.5rem;
  font-weight: bold;
  margin-top: 25px;
  margin-bottom: 25px;
  @media (max-height: 780px) {
    font-size: 5rem;
  }
`;

export const Description = styled.p`
  max-width: 1000px;
  font-size: 1.1rem;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 50px;
`;

export const Textarea = styled.textarea`
  width: 95%;
  height: 50%;
  background-color: rgb(255, 253, 232);
  padding: 8px;
  border-radius: 3px;
  border: none;
  font-size: 1rem;
  &:focus {
    outline: none;
  }
`;

export const Button = styled.button`
  width: 25%;
  padding: 8px 8px;
  border-radius: 3px;
  font-weight: bold;
  background-color: rgb(185, 34, 34);
  color: white;
  border: none;
  margin-top: 16px;
  cursor: pointer;
  float: right;

  &:hover {
    background-color: rgb(200, 45, 45);
  }

  &:active {
    background-color: rgb(170, 30, 30);
  }
`;

export const PDFButton = styled.button`
  width: 130px;
  padding: 10px 10px;
  border-radius: 4px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  background-color: ${(props) => props.bgColor || "#EBD18B"};

  &:hover {
    background-color: ${(props) => props.hoverColor || "#d1b477"};
  }

  &:active {
    background-color: ${(props) => props.activeColor || "#b8a165"};
  }
  @media (max-height: 850px) {
    padding: 7px 10px;
    margin-bottom: 5px;
  }
`;

export const Input = styled.input`
  width: 80%;
  color: black;
  padding: 8px;
  border-radius: 4px;
  border: none;
  font-size: 1rem;
  margin-top: 16px;
  box-sizing: border-box;
`;

export const Card = styled.div`
  background-color: ${(props) => (props.yellow ? "#CC9703" : "#EBD18B")};
  padding: 16px;
  border-radius: 3px;
  width: 400px;
  height: 200px;
  position: relative;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background: linear-gradient(
      135deg,
      transparent 50%,
      rgba(0, 0, 0, 0.1) 50%
    );
    clip-path: polygon(100% 0, 0 100%, 100% 100%);
  }

  @media (max-width: 768px) {
    width: 90%;
    height: auto;
    padding: 12px;
  }

  @media (max-height: 850px) {
    height: 150px;
  }
`;

export const EmailContainer = styled.div`
  background-color: rgb(185, 34, 34);
  padding: 24px;
  border-radius: 3px;
  width: 450px;
  height: 220px;
  position: relative;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  @media (max-width: 768px) {
    width: 90%;
    height: auto;
    padding: 16px;
  }

  @media (max-height: 850px) {
    height: 180px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  gap: 40px;
`;
export const CardsWrapper = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const MobileStyle = createGlobalStyle`
  @media (max-width: 768px) {
    ${Container} {
     overflow-y: scroll;
     overflow-x: hidden;
      padding: 14px;
    }

    ${Title} {
      font-size: 3rem;
      text-align: center;
    }

    ${Description} {
      font-size: 0.95rem;
      text-align: center;
      margin-bottom: 30px;
      padding: 0 10px;
    }

    ${Card} {
      width: 90%;
      height: auto;
      padding: 12px;
    }

    ${Textarea} {
      width: 90%;
      height: 100px;
      font-size: 0.9rem;
    }

    ${Button} {
      width: 100%;
      margin-top: 12px;
    }

    ${PDFButton} {
      width: 90%;
    }

    ${Input} {
      font-size: 0.9rem;
    }

    ${EmailContainer} {
      width: 90%;
      height: auto;
      padding: 12px;
      justify-content: center;
      align-items: center;
    }

  ${ContentWrapper} {
    flex-direction: column;
    padding: 0 10px;
    align-items: center;
  }
  }
`;
