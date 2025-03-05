import styled from "styled-components";

export const MemoriaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
  min-block-size: 100vh;
`;

export const GameHeader = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  inline-size: 100%;
  max-inline-size: 1200px;
  margin-block-end: 20px;
`;

export const GameControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  inline-size: 100%;
  max-inline-size: 600px;
`;

export const GameStats = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  inline-size: 100%;
  max-inline-size: 800px;
  margin-block-end: 20px;
`;

export const StatCard = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const DifficultySelect = styled.select`
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const NewGameButton = styled.button`
  padding: 10px 20px;
  background-color: #2E7D32;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  inline-size: 100%;
  max-inline-size: 800px;
`;
