import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  perspective: 1000px;

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
  position: absolute;
  top: 0px;
  left: 0px;
`;
