import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  perspective: 1000px;
  width: 100%;
  max-width: 150px;
  height: 0;
  padding-bottom: 150px; // Mantiene la proporción 1:1 para las cartas
  margin: 5px;

  @media (max-width: 768px) {
        max-width: 120px; 
        padding-bottom: 120px;
        margin: 3px;
  }

  .front.volteada {
    z-index: 1;
    transform: rotateY(180deg);
  }
`;

type Props = {
  $volteada: boolean;
};

const sharedStyles = css`
  width: 100%;
  height: 100%;
  transition: all 0.5s;
  backface-visibility: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  position: absolute;
  top: 0;
  left: 0;
`;

export const ImagenFrente = styled.img<Props>`
  ${sharedStyles}

  z-index: ${props => (props.$volteada ? 2 : 1)};
  transform: ${props => (props.$volteada ? 'rotate(0deg)' : 'rotateY(180deg)')};
`;

export const ImagenReverso = styled.img<Props>`
  ${sharedStyles}

  z-index: ${props => (props.$volteada ? 1 : 2)};
  transform: ${props => (props.$volteada ? 'rotateY(180deg)' : 'rotate(360deg)')};
`;
